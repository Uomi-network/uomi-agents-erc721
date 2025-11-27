// scripts/deploy.js  (ethers v5 + @nomiclabs/hardhat-ethers)
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // usa getFeeData del provider (ritorna BigNumber in v5)
  const fd = await ethers.provider.getFeeData();
  // fallback se mancano campi
  const base = fd.lastBaseFeePerGas || fd.gasPrice || ethers.BigNumber.from(0);
  const priority = ethers.utils.parseUnits("0.5", "gwei"); // BigNumber
  const maxFee = base.mul(2).add(priority);                // BigNumber

  console.log("baseFee:", base.toString());
  console.log("priority:", priority.toString());
  console.log("maxFee  :", maxFee.toString());


  // deploy TYPE:2
  const Factory = await ethers.getContractFactory("UomiAgent");
  const contract = await Factory.deploy();
  await contract.deployed();
  console.log("deployed to:", contract.address);
}

main().catch((e) => { console.error(e); process.exit(1); });
