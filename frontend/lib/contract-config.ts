// Smart contract configuration
import PropertyRegistryABI from "../contracts/PropertyRegistry.json";
import FractionalizerABI from "../contracts/Fractionalizer.json";
import FractionalNFTABI from "../contracts/FractionalNFT.json";

export const CONTRACT_CONFIG = {
  propertyRegistry: {
    address: process.env.NEXT_PUBLIC_PROPERTYREG || "0x6C93dBfd665c959EFcf534Ef829919c09308cB81",
    abi: PropertyRegistryABI.abi,
  },
  fractionalizer: {
    address: process.env.NEXT_PUBLIC_FRACTIONALIZER || "0x90608ec1DEE9D9e8A4d0458079Bf0B2EdA968a19",
    abi: FractionalizerABI.abi,
  },
  fractionalNFT: {
    address: process.env.NEXT_PUBLIC_FRACTIONALNFT ||"0x3402Bf47C2335219e32ADD0F24921dE95d73d5F9",
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
