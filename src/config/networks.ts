// Network configuration for Hybrid Loan Book module addresses
// Default addresses for the pact::hybrid_loan_book module across different networks

export interface NetworkConfig {
  moduleAddress: string;
  rpcUrl: string;
  faucetUrl?: string;
}

export interface NetworkConfigs {
  mainnet: NetworkConfig;
  testnet: NetworkConfig;
  devnet: NetworkConfig;
}

export const DEFAULT_NETWORK_CONFIGS: NetworkConfigs = {
  mainnet: {
    moduleAddress: '0x1', // TODO: Replace with actual mainnet pact module address
    rpcUrl: 'https://api.mainnet.aptoslabs.com/v1',
  },
  testnet: {
    moduleAddress: '0x1', // TODO: Replace with actual testnet pact module address
    rpcUrl: 'https://api.testnet.aptoslabs.com/v1',
    faucetUrl: 'https://faucet.testnet.aptoslabs.com',
  },
  devnet: {
    moduleAddress: '0x1', // TODO: Replace with actual devnet pact module address
    rpcUrl: 'https://api.devnet.aptoslabs.com/v1',
    faucetUrl: 'https://faucet.devnet.aptoslabs.com',
  },
};

export type NetworkName = keyof NetworkConfigs;

export const HYBRID_LOAN_BOOK_MODULE = 'hybrid_loan_book';
export const PACT_MODULE_PREFIX = 'pact';
