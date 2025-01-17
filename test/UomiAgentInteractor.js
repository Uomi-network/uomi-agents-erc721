const ethers = require('ethers');
const { CONTRACT_ADDRESS, CONTRACT_ABI } = require('./config');

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
            { value: ethers.utils.parseEther("10") } // Assumendo un prezzo fisso di 0.1 ETH
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

module.exports = UomiAgentInteractor;