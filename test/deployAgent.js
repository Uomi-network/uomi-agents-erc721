const UomiAgentInteractor = require("./UomiAgentInteractor");
const { PROVIDER_URL, PRIVATE_KEY, PUBLIC_KEY } = require("./config");

async function main() {
  const interactor = new UomiAgentInteractor(PROVIDER_URL, PRIVATE_KEY);

  const newAgent = {
    name: "Whitepaper agent",
    description: "Uomi agent can explain the Uomi project",
    inputSchema: "{}",
    outputSchema: "{}",
    tags: ["whitepaper", "ai"],
    price: 0,
    minValidators: 3,
    minBlocks: 20,
    agentCID: "bafkreier2hbqc2zefn5t54zlot3tolzf3jek6yyqs5d2yxok3dufgqxsie"
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