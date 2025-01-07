# Uomi Network - On-Chain AI Agents

## Overview

 Each uomi agent is represented as an NFT, with a total limited supply of 1024 tokens. All agent metadata, including images and specifications, is stored completely on-chain.

## Key Features

- **Limited Supply**: Maximum of 1024 agent NFTs available
- **On-Chain Metadata**: All agent data, including SVG images, is stored directly on-chain
- **EVM Compatibility**: Full compatibility with Ethereum tooling and standards
- **Precompiled Contract Integration**: Direct interaction with on-chain AI execution environment
- **Role-Based Access Control**: Secure management of contract administration
- **Dynamic NFT Visualization**: Procedurally generated SVG images for each agent

## Smart Contract Details

### Core Components

- **UomiAgent.sol**: Main contract implementing ERC721 with the following extensions:
  - ERC721Enumerable
  - ERC721URIStorage
  - AccessControl

### Agent Properties

Each agent NFT contains the following metadata:
- Name
- Description
- Input Schema
- Output Schema
- Tags
- Price
- Minimum Validators Required
- Minimum Blocks for Execution
- Agent CID

### Key Functions

```solidity
function safeMint(Agent memory agent, address to) public payable
function updateAgent(uint256 tokenId, Agent memory agent) public
function callAgent(uint256 nftId, bytes calldata inputCidFile, bytes calldata inputData) external payable
function getAgentOutput(uint256 _requestId) external view returns (AgentOutput memory)
```

### Pricing

- Fixed price of 10 ETH per agent (testnet configuration)
- Custom pricing can be set per agent for execution

## Usage

### Minting an Agent

To mint a new agent NFT:

1. Prepare the agent metadata
2. Call `safeMint` with required payment
3. Agent NFT will be minted with a unique tokenId

### Executing an Agent

To execute an agent:

1. Obtain the NFT ID of the desired agent
2. Prepare input data and CID file (both are optional, write 0x for empty)
3. Call `callAgent` with appropriate parameters and payment
4. Monitor the request using the returned requestId
5. Retrieve results using `getAgentOutput`

### Updating Agent Properties

Agent owners can update their agent's properties using the `updateAgent` function.

## Events

The contract emits the following events:
- `RequestSent`: When a new agent execution request is initiated
- `AgentResult`: When an agent execution is completed

## Security Features

- Role-based access control for administrative functions
- Owner-only agent updates
- Payment validation
- Maximum supply enforcement

## Technical Implementation

### On-Chain Metadata Implementation

The UomiAgent contract implements a sophisticated system for generating and storing all NFT metadata entirely on-chain, including both the metadata JSON and SVG images. Here's a detailed breakdown of how it works:

#### SVG Image Generation

The contract generates SVG images dynamically using a template-based approach:

```solidity
function generateImage(uint256 tokenId) internal view returns (string memory) {
    Agent memory $ = agents[tokenId];
    
    bytes memory fullSvg = abi.encodePacked(
        SVG_PART1,  // Base SVG template with styling
        tokenId,    // NFT identifier
        SVG_PART2,  // Middle template section
        $.name,     // Agent name
        SVG_PART3   // SVG closing elements
    );

    return string(
        abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(fullSvg)
        )
    );
}
```


#### TokenURI Generation

The `tokenURI` function generates a complete metadata structure that's fully compliant with NFT standards:

```solidity
function tokenURI(uint256 tokenId) public view returns (string memory) {
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
                    // ... additional metadata fields
                    '"image":"', image, '"}'
                )
            )
        )
    );
}
```

Key metadata components:
- External URL linking to the project
- Agent description and name
- Dynamic attributes array
- Input/output schemas
- Pricing information
- Validation requirements
- Base64 encoded SVG image

#### Tags Management

The contract includes a utility function for handling dynamic tag arrays:

```solidity
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
```

#### Gas Optimization Techniques

The metadata implementation employs several gas optimization strategies:
- Use of `string.concat` for efficient string concatenation
- Static SVG parts stored as constants
- Minimal storage access through strategic use of memory variables
- Efficient base64 encoding implementation

### Precompile Integration

The contract interacts with two precompiled addresses:
- UOMI_ENGINE: `0x00000000000000000000000000000000756f6D69`
- IPFS: `0x00000000000000000000000000000000756f6D69`

These precompiles enable:
- Direct on-chain AI agent execution
- Efficient data storage and retrieval
- Integration with the Uomi Network's core functionality

The metadata implementation ensures that each NFT is completely self-contained with all data permanently stored on-chain:
- No external URI dependencies
- No IPFS reliance for core functionality
- Immutable and permanently accessible metadata
- Standard-compliant JSON structure
- Dynamic SVG generation
- Dynamic metadata updates

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.