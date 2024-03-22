import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    bsctest: {
      accounts: [process.env.PRIVATE_KEY as string],
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    },
  },
};

export default config;
