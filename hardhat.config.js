require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomicfoundation/hardhat-verify");

sourcify: {
  enabled: false;
}
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.26",
       
      },
      {
        version: "0.8.22",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      },
    },
    testnet: {
      url: ``,
      accounts: [process.env.PRIVATE_KEY],
    },
    uomi: {
      url: `https://turing-a.uomi.ai`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      'uomi': 'empty'
    },
    customChains: [
      {
        network: "uomi",
        chainId: 4386,
        urls: {
          apiURL: "https://explorer.uomi.ai/api",
          browserURL: "https://explorer.uomi.ai"
        }
      }
    ]
  }
};
