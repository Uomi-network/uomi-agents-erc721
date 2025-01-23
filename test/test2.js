const ethers = require('ethers');

// Indirizzo del contratto da configurare
const CONTRACT_ADDRESS = "0xDB5e49D00321ACC34C76Af6fa02E7D9766b6e0F5";
// 0xf5dF1DA452cd8e94845C7A05b20fC161f3A5D522 get agent output
// 0x0E00eE528C069b1b91E1c98C15d9a267CC98c0c3
// ABI del contratto (importato dal file)
const CONTRACT_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AccessControlBadConfirmation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "neededRole",
          "type": "bytes32"
        }
      ],
      "name": "AccessControlUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ERC721EnumerableForbiddenBatchMint",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "ERC721OutOfBoundsIndex",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "MaxAgents",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotEnoughPayment",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bytes",
          "name": "output",
          "type": "bytes"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "validationCount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalValidator",
          "type": "uint256"
        }
      ],
      "name": "AgentResult",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        }
      ],
      "name": "BatchMetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "MetadataUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bytes",
          "name": "inputUri",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        }
      ],
      "name": "RequestSent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "FIXED_PRICE",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_AGENTS",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "agents",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "inputSchema",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "outputSchema",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minValidatiors",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minBlocks",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "agentCID",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "nftId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "inputCidFile",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "inputData",
          "type": "string"
        }
      ],
      "name": "callAgent",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cashOut",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_requestId",
          "type": "uint256"
        }
      ],
      "name": "getAgentOutput",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "output",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "totalExecutions",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalConsensus",
              "type": "uint256"
            }
          ],
          "internalType": "struct UomiAgent.AgentOutput",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ipfsStorage",
      "outputs": [
        {
          "internalType": "contract IIPFSStorage",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "callerConfirmation",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "inputSchema",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "outputSchema",
              "type": "string"
            },
            {
              "internalType": "string[]",
              "name": "tags",
              "type": "string[]"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minValidatiors",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minBlocks",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "agentCID",
              "type": "string"
            }
          ],
          "internalType": "struct UomiAgent.Agent",
          "name": "agent",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "safeMint",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IIPFSStorage",
          "name": "_ipfsStorage",
          "type": "address"
        }
      ],
      "name": "setIpfsStorage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "inputSchema",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "outputSchema",
              "type": "string"
            },
            {
              "internalType": "string[]",
              "name": "tags",
              "type": "string[]"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minValidatiors",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minBlocks",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "agentCID",
              "type": "string"
            }
          ],
          "internalType": "struct UomiAgent.Agent",
          "name": "agent",
          "type": "tuple"
        }
      ],
      "name": "updateAgent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];


  const ipfs = "0x2C236e3f14bC72242ba0e9CDDb367331A9E0102C"

class UomiAgentInteractor {
    constructor(providerUrl, privateKey) {
        this.provider = new ethers.providers.JsonRpcProvider(providerUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.wallet);
    }

    // Crea un nuovo agente
    async createAgent(agent, recipient) {
        const tx = await this.contract.safeMint(
            {
                name: agent.name,
                description: agent.description,
                inputSchema: agent.inputSchema,
                outputSchema: agent.outputSchema,
                tags: agent.tags,
                price: ethers.utils.parseEther(agent.price.toString()),
                minValidatiors: agent.minValidators,
                minBlocks: agent.minBlocks,
                agentCID: agent.agentCID
            },
            recipient,
            { value: ethers.utils.parseEther("100") } // Assumendo un prezzo fisso di 0.1 ETH
        );
        return await tx.wait();
    }

    // Chiama un agente
    async callAgent(nftId, inputCidFile, inputData) {
        const agent = await this.contract.agents(nftId);
        const tx = await this.contract.callAgent(
            nftId,
            inputCidFile,
            inputData,
            { value: agent.price }
        );
        return await tx.wait();
    }

    // Ottiene il risultato di un agente
    async getAgentOutput(requestId) {
        const output = await this.contract.getAgentOutput(requestId);
        return {
            output: output.output,
            totalExecutions: output.totalExecutions.toString(),
            totalConsensus: output.totalConsensus.toString()
        };
    }

    // Aggiorna un agente esistente
    async updateAgent(tokenId, agent) {
        const tx = await this.contract.updateAgent(tokenId, {
            name: agent.name,
            description: agent.description,
            inputSchema: agent.inputSchema,
            outputSchema: agent.outputSchema,
            tags: agent.tags,
            price: ethers.utils.parseEther(agent.price.toString()),
            minValidatiors: agent.minValidators,
            minBlocks: agent.minBlocks,
            agentCID: agent.agentCID
        });
        return await tx.wait();
    }

    // Ottiene i dettagli di un agente
    async getAgent(tokenId) {
        const agent = await this.contract.agents(tokenId);
        return {
            name: agent.name,
            description: agent.description,
            inputSchema: agent.inputSchema,
            outputSchema: agent.outputSchema,
            price: ethers.utils.formatEther(agent.price),
            minValidators: agent.minValidatiors.toString(),
            minBlocks: agent.minBlocks.toString(),
            agentCID: agent.agentCID
        };
    }

    async setIpfsStorage(ipfsStorage) {
        const tx = await this.contract.setIpfsStorage(ipfsStorage);
        return await tx.wait();
    }

    // Ritira i fondi dal contratto (solo per admin)
    async cashOut() {
        const tx = await this.contract.cashOut();
        return await tx.wait();
    }
}

// Esempio di utilizzo
async function main() {
    const providerUrl = "https://finney.uomi.ai/"; // es. Infura, Alchemy, etc.
    const privateKey = "";
    
    const interactor = new UomiAgentInteractor(providerUrl, privateKey);

    try {

        // const setTx = await interactor.setIpfsStorage(ipfs);
        // console.log("Ipfs storage settato:", setTx.transactionHash);
         // Esempio di creazione di un nuovo agente
         const newAgent = {
            name: "Whitepaper Agent",
            description: "Whitepaper Agent is the first agent of Uomi Network, it can explain you the uomi network ecosystem",
            inputSchema: "{}",
            outputSchema: "{}",
            tags: ["uomi", "chat", "whitepaper"],
            price: 0,
            minValidators: 4,
            minBlocks: 20,
            agentCID: "bafkreif5jtx37ujddnelg73tuyppzyimal32n6q57ovzkso56g7hcnevye"
        };

        const recipient = "0x9cE69C61B3D51Ab022e130b453A2c4124f3A9E49"; // indirizzo del destinatario
        //send 10 eth
        const createTx = await interactor.createAgent(newAgent, recipient);
        console.log("Agente creato:", createTx.transactionHash);
        // // Esempio di chiamata a un agente
        // const callTx = await interactor.callAgent(4, "", "ciao");
        // console.log("Agente chiamato:", callTx.transactionHash);

        //get agent output
        // const output = await interactor.getAgentOutput(8);
        // console.log("Output dell'agente:", output);

        //update agent

        // const updatedAgent = {
        //     name: "Test Agent 0",
        //     description: "agent test 0 with 1 bad node",
        //     inputSchema: "{}",
        //     outputSchema: "{}",
        //     tags: ["test", "demo"],
        //     price: 0,
        //     minValidators: 3,
        //     minBlocks: 20,
        //     agentCID: "bafkreihw3bk5wfh7sxrumbn3ul2tthddy55ryvrp443dibvd2zo2enmdbm"
        // };
        // const updateTx = await interactor.updateAgent(1, updatedAgent);
        // console.log("Agente aggiornato:", updateTx.transactionHash);

    } catch (error) {
        console.error("Errore:", error);
    }
}


// Esporta la classe per l'uso in altri moduli
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});