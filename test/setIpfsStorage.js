const UomiAgentInteractor = require("./UomiAgentInteractor");
const { PROVIDER_URL, PRIVATE_KEY, IPFS_ADDRESS } = require("./config");

async function main() {
  const interactor = new UomiAgentInteractor(PROVIDER_URL, PRIVATE_KEY);

  try {
    const setTx = await interactor.setIpfsStorage(IPFS_ADDRESS);
    console.log("Ipfs storage set correctly:", setTx.transactionHash);
  } catch (error) {
      console.error("Error:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});