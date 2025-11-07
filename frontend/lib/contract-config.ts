// Smart contract configuration
import PropertyRegistryABI from "../contracts/PropertyRegistry.json";
import FractionalizerABI from "../contracts/Fractionalizer.json";
import FractionalNFTABI from "../contracts/FractionalNFT.json";

export const CONTRACT_CONFIG = {
  propertyRegistry: {
    address: "0x683eE44052442cF4e2751244580ffc946a42e71e",
    abi: PropertyRegistryABI.abi,
  },
  fractionalizer: {
    address: "0x7e9c827bFFEc3ECb838FD9f4FEfaD7b6cB557b20",
    abi: FractionalizerABI.abi,
  },
  fractionalNFT: {
    address: "0x1C6E56A1565B50d6BC4d42cAdC6270BD5C3c908a",
    abi: FractionalNFTABI.abi,
  },
  // Network configuration - matches hardhat.config.ts
  network: {
    localhost: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
    },
    hardhat: {
      url: "http://127.0.0.1:7545",
      chainId: 31337,
    },
  },
  currentNetwork: "localhost" as const,
};

export function getRpcUrl(): string {
  return CONTRACT_CONFIG.network[CONTRACT_CONFIG.currentNetwork].url;
}

export function getChainId(): number {
  return CONTRACT_CONFIG.network[CONTRACT_CONFIG.currentNetwork].chainId;
}
