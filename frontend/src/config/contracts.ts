export const CONTRACT_ADDRESSES = {
  // Hardhat local network
  '31337': {
    propertyToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    propertyValuation: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  // Sepolia testnet
  '11155111': {
    propertyToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Replace with actual deployed address
    propertyValuation: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Replace with actual deployed address
  },
} as const;

export type NetworkId = keyof typeof CONTRACT_ADDRESSES;
export type ContractAddresses = typeof CONTRACT_ADDRESSES[NetworkId];

export const networkConfig = {
  localhost: {
    name: 'localhost',
    url: 'http://127.0.0.1:8545',
    chainId: 31337
  }
}; 