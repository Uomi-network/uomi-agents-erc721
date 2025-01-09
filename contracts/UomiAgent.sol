// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Base64} from "solady/src/utils/Base64.sol";
import {LibString} from "solady/src/utils/LibString.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IEngine.sol";
import "./IIpfs.sol";

/**
 * @title UomiAgent
 * @dev Contract for managing agent NFTs with role-based access control
 */
contract UomiAgent is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    AccessControl
{
    // ============ Global Variables ============
    
    IIPFSStorage public ipfsStorage;

    // ============ Constants ============

    /// @dev Address of the UomiEngine precompile
    IEngine private constant PRECOMPILE_ADDRESS_UOMI_ENGINE =
        IEngine(0x00000000000000000000000000000000756f6D69);

    /// @dev Maximum number of AGENTs that can be minted
    uint16 public constant MAX_AGENTS = 1024;

    uint64 public constant FIXED_PRICE = 10 ether; //fixed price just for testnet

    string constant SVG_PART1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800"><rect width="800" height="800" fill="#0d0d1f" /><defs><radialGradient id="center-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#00fff0" stop-opacity="0.2" /><stop offset="70%" stop-color="#001f3f" stop-opacity="0.1" /><stop offset="100%" stop-color="#000000" /></radialGradient><linearGradient id="neon-detail" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00fff0" /><stop offset="100%" stop-color="#ff00c8" /></linearGradient></defs><rect width="800" height="800" fill="url(#center-glow)" /><g><circle cx="400" cy="400" r="60" fill="#00fff0" opacity="0.8" /><circle cx="400" cy="400" r="50" fill="#1a1a2e" /><circle cx="400" cy="400" r="40" fill="#ff007e" opacity="0.6" /><circle cx="400" cy="400" r="30" fill="#00fff0" opacity="0.4" /><line x1="400" y1="400" x2="0" y2="200" stroke="#00fff0" stroke-width="3" opacity="0.4" /><line x1="400" y1="400" x2="800" y2="200" stroke="#ff00c8" stroke-width="3" opacity="0.4" /><line x1="400" y1="400" x2="0" y2="600" stroke="#ff00c8" stroke-width="3" opacity="0.4" /><line x1="400" y1="400" x2="800" y2="600" stroke="#00fff0" stroke-width="3" opacity="0.4" /><line x1="400" y1="400" x2="200" y2="0" stroke="#00c3ff" stroke-width="2" opacity="0.5" /><line x1="400" y1="400" x2="600" y2="0" stroke="#ff00c8" stroke-width="2" opacity="0.5" /><line x1="400" y1="400" x2="200" y2="800" stroke="#00fff0" stroke-width="2" opacity="0.5" /><line x1="400" y1="400" x2="600" y2="800" stroke="#ff007e" stroke-width="2" opacity="0.5" /></g><circle cx="400" cy="400" r="250" fill="none" stroke="#00fff0" stroke-width="2" opacity="0.3" /><circle cx="400" cy="400" r="200" fill="none" stroke="#ff00c8" stroke-width="2" opacity="0.2" /><circle cx="400" cy="400" r="150" fill="none" stroke="#ff007e" stroke-width="2" opacity="0.1" /><line x1="0" y1="400" x2="800" y2="400" stroke="#00fff0" stroke-width="1" opacity="0.2" /><line x1="400" y1="0" x2="400" y2="800" stroke="#ff00c8" stroke-width="1" opacity="0.2" /><text x="50%" y="750" fill="url(#neon-detail)" font-size="24" font-family="Orbitron, Arial, sans-serif" text-anchor="middle">AI AGENT #';

    string constant SVG_PART2 = '</text><text x="50%" y="780" fill="white" font-size="14" font-family="Monospace" text-anchor="middle" opacity="0.5">';

    string constant SVG_PART3 = "</text></svg>";

    // ============ Structs ============

    struct Agent {
        string name; // Agent name
        string description; // Agent description
        string inputSchema; // Agent input schema
        string outputSchema; // Agent output schema
        string[] tags; // Agent tags
        uint256 price; // Agent price
        uint256 minValidatiors; // minimum number of validators
        uint256 minBlocks; // minimum number of blocks for execution
        string agentCID; // Agent CID
    }

    struct AgentOutput {
        bytes output; // Agent's output
        uint256 totalExecutions; // Number of executions
        uint256 totalConsensus; // Total number of consensus
    }

    // ============ State Variables ============

    /// @dev Counter for request IDs
    uint256 private requestId;

    /// @dev Counter for token IDs
    uint256 private currentTokenId;

    /// @dev Mapping of nftId to agent
    mapping(uint256 => Agent) public agents;

    // ============ Events ============

    /**
     * @dev Emitted when a new request is sent
     */
    event RequestSent(
        address indexed sender,
        uint256 indexed requestId,
        bytes indexed inputUri,
        uint256 nftId
    );

    /**
     * @dev Emitted when an agent result is received
     */
    event AgentResult(
        uint256 indexed requestId,
        bytes indexed output,
        uint256 indexed nftId,
        uint256 validationCount,
        uint256 totalValidator
    );

    // ============ Errors ============

    error NotEnoughPayment();
    error MaxAgents();


    // ============ Constructor ============

    /**
     * @dev Initializes the contract with default admin and minter roles
     */
    constructor(
    ) ERC721("UomiAgent", "AGENT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ============ External Functions ============

    /**
     * @notice Safely mints a new token
     * @param agent Agent struct
     * @param to Recipient address
     */
    function safeMint(
        Agent memory agent,
        address to
    ) public payable {
        currentTokenId += 1;
        if (currentTokenId > MAX_AGENTS) {
            revert MaxAgents();
        }
   
        
        if (msg.value != FIXED_PRICE) {
            revert NotEnoughPayment();
        }

        agents[currentTokenId] = agent;

        uint256 tokenId = currentTokenId++;
        //pin agent CID to IPFS
        ipfsStorage.pinAgent(agent.agentCID, tokenId, msg.sender);
        _safeMint(to, tokenId);
    }

    function setIpfsStorage(
        IIPFSStorage _ipfsStorage
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        ipfsStorage = _ipfsStorage;
    }

    /**
     * @notice Updates the agent information for a given token ID.
     * @dev This function can only be called by the owner of the token.
     * @param tokenId The ID of the token whose agent information is to be updated.
     * @param agent The new agent information to be associated with the token.
     */
    function updateAgent(
        uint256 tokenId,
        Agent memory agent,
        address owner
    ) public {
        require(
           msg.sender == ownerOf(tokenId),
            "UomiAgent: caller is not owner"
        );

        if (keccak256(abi.encodePacked(agent.agentCID)) != keccak256(abi.encodePacked(agents[tokenId].agentCID))) {
            ipfsStorage.pinAgent(agent.agentCID, tokenId, owner);
        }

        agents[tokenId] = agent;
    }

    /**
     * @notice Makes a call to the agent
     * @param nftId NFT identifier to use
     * @param inputCidFile Input URI encoded in bytes
     * @param inputData Input data encoded in bytes
     */
    function callAgent(
        uint256 nftId,
        string calldata inputCidFile,
        string calldata inputData
    ) external payable  {
        
        Agent memory $ = agents[nftId];
        if ($.price > 0 && msg.value < $.price) {
            revert NotEnoughPayment();
        }

        requestId += 1;

        if ($.price > 0) {
            address owner = ownerOf(nftId);
            payable(owner).transfer(msg.value);
        }

        PRECOMPILE_ADDRESS_UOMI_ENGINE.call_agent(
            requestId,
            nftId,
            msg.sender,
            bytes(inputData),
            bytes(inputCidFile),
            $.minValidatiors,
            $.minBlocks
        );

        emit RequestSent(msg.sender, requestId, bytes(inputData), nftId);
    }


    /**
     * @dev Allows the admin to withdraw the entire balance of the contract.
     * Can only be called by an account with the `DEFAULT_ADMIN_ROLE`.
     */
    function cashOut() external onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }


    // ============ View Functions ============

    /**
     * @notice Returns the agent output
     * @param _requestId Request identifier
     * @return AgentOutput struct
     */
    function getAgentOutput(
        uint256 _requestId
    ) external view returns (AgentOutput memory) {
        AgentOutput memory output;

        (output.output, output.totalExecutions, output.totalConsensus) = PRECOMPILE_ADDRESS_UOMI_ENGINE.get_output(_requestId);

        return output;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Generates an SVG image for the given tokenId.
     * @param tokenId The ID of the token for which to generate the image.
     * @return A base64-encoded SVG image as a string.
     * 
     * This function retrieves the agent associated with the given tokenId,
     * constructs an SVG image using predefined SVG parts and the agent's name,
     * and returns the image as a base64-encoded data URI.
     */
     function generateImage(uint256 tokenId) internal view returns (string memory) {
        Agent memory $ = agents[tokenId];
        
        bytes memory fullSvg = abi.encodePacked(
            SVG_PART1,
            tokenId,
            SVG_PART2,
            $.name,
            SVG_PART3
        );

        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(fullSvg)
            )
        );
    }

    /**
     * @notice Returns the token URI for a given token ID.
     * @dev This function overrides the tokenURI function from ERC721 and ERC721URIStorage.
     * It generates a JSON metadata string for the token, which includes various attributes
     * such as description, name, tags, inputSchema, outputSchema, price, nftId, minValidators,
     * minBlocks, and an image.
     * @param tokenId The ID of the token for which to retrieve the URI.
     * @return A string representing the token URI in JSON format, encoded in base64.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        string memory image = generateImage(tokenId);
        Agent memory $ = agents[tokenId];
        
      return string.concat(
            "data:application/json;base64,",
            Base64.encode(
                bytes(
                    string.concat(
                        '{"external_url":"https://uomi.ai",',
                        '"description":"', $.description, '",',
                        '"name":"', $.name, " #", LibString.toString(tokenId), '",',
                        '"attributes":',
                        $.tags.length > 0
                            ? string.concat(
                                "[", 
                                _joinTags($.tags), 
                                "]"
                            )
                            : "[]", 
                        ',"inputSchema":"', $.inputSchema, '",',
                        '"outputSchema":"', $.outputSchema, '",',
                        '"price":', LibString.toString($.price), ',',
                        '"nftId":', LibString.toString(tokenId), ',',
                        '"minValidatiors":', LibString.toString($.minValidatiors), ',',
                        '"minBlocks":', LibString.toString($.minBlocks), ',',
                        '"image":"', image, '"}'
                    )
                )
            )
        );
    }

    /**
     * @dev Joins an array of strings into a single string with each element
     *      separated by a comma and enclosed in double quotes.
     * @param tags The array of strings to join.
     * @return A single string with each element from the input array separated
     *         by a comma and enclosed in double quotes.
     */
    function _joinTags(string[] memory tags) private pure returns (string memory) {
        string memory result;
        for (uint i = 0; i < tags.length; i++) {
            if (i > 0) {
                result = string.concat(result, ',"', tags[i], '"');
            } else {
                result = string.concat('"', tags[i], '"');
            }
        }
        return result;
    }

    // ============ Override Functions Needed ============

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
