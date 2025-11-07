import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        "0xbdec6811985ef657770531c6d95d9ddad07ae4718d63cb78d5a3dd1fa02ba895"
      ],
    },
    hardhat: {
      chainId: 31337,
    },
  },
};

export default config;
