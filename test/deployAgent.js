const UomiAgentInteractor = require("./UomiAgentInteractor");
const { PROVIDER_URL, PRIVATE_KEY, PUBLIC_KEY } = require("./config");

async function main() {
  const interactor = new UomiAgentInteractor(PROVIDER_URL, PRIVATE_KEY);

  const newAgent = {
    name: "Test Agent",
    description: "Un agente di test infinito",
    inputSchema: "{}",
    outputSchema: "{}",
    tags: ["test", "demo"],
    price: 0,
    minValidators: 1,
    minBlocks: 50,
    agentCID: "bafkreia5kgxvduqtnikxoqlsbyg43tbb5hzz2smmxkfmynyofphclyguci"
  };
  console.log("Creating agent:", newAgent);

  try {
    const setTx = await interactor.createAgent(newAgent, PUBLIC_KEY);
    console.log("Agent deployed correctly:", setTx.transactionHash);
  } catch (error) {
      console.error("Error:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});