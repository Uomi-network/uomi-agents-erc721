const hre = require("hardhat");

async function main() {
  const lock = await hre.ethers.deployContract("UomiAgent");

  await lock.deployed();

  console.log(`deployed to ${lock.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
