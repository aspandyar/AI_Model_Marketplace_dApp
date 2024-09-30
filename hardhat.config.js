require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { INFURA_API_KEY, METAMASK_MNEMONIC } = process.env;

module.exports = {
    solidity: {
        version: "0.6.0", // Adjust based on your contract's Solidity version
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        ropsten: {
            url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`, // Replace with your desired network
            accounts: {
                mnemonic: METAMASK_MNEMONIC, // Use your mnemonic for generating accounts
            },
        },
        // Add more networks as needed
    },
};
