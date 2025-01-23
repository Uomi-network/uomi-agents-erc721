const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const nonce = await deployer.getTransactionCount();
  console.log(`deployer address: ${deployer.address}`);
  console.log(`deployer nonce: ${nonce}`);
  
  const lock = await hre.ethers.deployContract("UomiAgent");

  await lock.deployed();

  console.log(`deployed to ${lock.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
