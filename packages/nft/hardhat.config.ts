import type { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
import '@nomiclabs/hardhat-ethers';
import dotenv from 'dotenv';

interface env {
  ALCHEMY_API_KEY: string,
  POLYGON_AMOY: string,
  POLYGON_MAINNET: string,
  PRIVATE_KEY: string
}

dotenv.config({path: '../../.env'});
const {ALCHEMY_API_KEY, POLYGON_AMOY, POLYGON_MAINNET, PRIVATE_KEY} = process.env as unknown as env;

console.log(ALCHEMY_API_KEY, 14);
console.log(PRIVATE_KEY, 15)
console.log(POLYGON_AMOY, 17)
console.log(POLYGON_MAINNET, 19)

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
  },
  // defaultNetwork: "polygon",
  networks: {
    hardhat: {},
    polygon_amoy: {
      url: POLYGON_AMOY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    polygon_mainnet: {
      url: POLYGON_MAINNET,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
};

export default config;
