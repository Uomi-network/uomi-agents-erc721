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
    uint16 public MAX_AGENTS = 1024;

    uint128 public constant FIXED_PRICE = 100 ether; //fixed price just for testnet

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

    function increaseMaxAgents(uint16 _maxAgents) external onlyRole(DEFAULT_ADMIN_ROLE) {
        MAX_AGENTS = _maxAgents;
    }

    /**
     * @notice Safely mints a new token
     * @param agent Agent struct
     * @param to Recipient address
     */
    function safeMint(
        Agent memory agent,
        address to
    ) public payable {
        require(bytes(agent.name).length > 0 && bytes(agent.name).length <= 16, "Invalid name length");
        require(bytes(agent.description).length <= 1000, "Description too long");
        require(agent.minValidatiors > 0, "Invalid validator count");
        require(agent.minBlocks > 0, "Invalid block count");

        currentTokenId += 1;
        if (currentTokenId > MAX_AGENTS) {
            revert MaxAgents();
        }
   
        
        if (msg.value != FIXED_PRICE) {
            revert NotEnoughPayment();
        }

        agents[currentTokenId] = agent;

        //pin agent CID to IPFS
        ipfsStorage.pinAgent(agent.agentCID, currentTokenId, msg.sender);
        _safeMint(to, currentTokenId);
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
        require(bytes(agent.name).length > 0 && bytes(agent.name).length <= 16, "Invalid name length");
        require(bytes(agent.description).length <= 1000, "Description too long");
        require(agent.minValidatiors > 0, "Invalid validator count");
        require(agent.minBlocks > 0, "Invalid block count");
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

        require(exists(nftId), "UomiAgent: agent does not exist");
        
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

        (output.output, output.totalExecutions, output.totalConsensus) = PRECOMPILE_ADDRESS_UOMI_ENGINE.get_agent_output(_requestId);

        return output;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
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
        string memory image = "https://uomi.ai/testnet/agent-nft.jpg";
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
