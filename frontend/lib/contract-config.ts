// Smart contract configuration
export const CONTRACT_CONFIG = {
  // Update this address after deploying the contract
  // You can get this from the deployment script output
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x6057b6587BDF3a54b3B9c6fC4fC70Cb9cB0CCe7E",
  
  // Network configuration - matches hardhat.config.ts
  network: {
    localhost: {
      url: "http://127.0.0.1:7546",
      chainId: 1337,
    },
    hardhat: {
      url: "http://127.0.0.1:7546",
      chainId: 31337,
    },
  },
  
  // Current network to use
  currentNetwork: "localhost" as const,
};

// Get the RPC URL based on current network
export function getRpcUrl(): string {
  return CONTRACT_CONFIG.network[CONTRACT_CONFIG.currentNetwork].url;
}

// Get the chain ID based on current network
export function getChainId(): number {
  return CONTRACT_CONFIG.network[CONTRACT_CONFIG.currentNetwork].chainId;
}
