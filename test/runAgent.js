const UomiAgentInteractor = require("./UomiAgentInteractor");
const { PROVIDER_URL, PRIVATE_KEY } = require("./config");

async function main() {
  const interactor = new UomiAgentInteractor(PROVIDER_URL, PRIVATE_KEY);

  try {
    const setTx = await interactor.callAgent(6, "", "[{\"role\":\"user\",\"content\":\"ciao come stai\"}]");
    console.log("Agent run request sent correctly:", setTx.transactionHash);
  } catch (error) {
      console.error("Error:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});