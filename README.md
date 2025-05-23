# EstateChain - Next-Gen Real Estate Platform 🏠

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=flat&logo=solidity&logoColor=white)](https://soliditylang.org/)

EstateChain is a cutting-edge decentralized real estate platform built on Ethereum blockchain. It revolutionizes property transactions through smart contracts, NFTs, and advanced features for a seamless real estate experience.
This is just a basic generic idea I wanted to create, it isn't fully perfect yet but I wanted to implement it anyway

## [Preview Here](https://github.com/sbdh11/EstateChain/blob/main/Estatechain%20video.mp4)

## 🌟 Features

### Core Features
- **NFT-based Property Ownership**: Each property is represented as a unique NFT with detailed metadata
- **Property Tokenization**: Fractional ownership of real estate properties
- **Property Verification**: On-chain property verification and documentation
- **Rental Management**: Automated rental collection and management
- **Property Insurance**: Integrated decentralized insurance options
- **Market Analytics**: Real-time property market analytics and trends



## 🛠️ Technology Stack

### Smart Contracts
- Solidity ^0.8.20
- OpenZeppelin Contracts
- Hardhat Development Environment
- TypeChain for TypeScript bindings

### Frontend
- React 18 with TypeScript
- Chakra UI for modern design
- Ethers.js v6 for blockchain interaction
- React Query for server state management

### Development Tools
- ESLint & Prettier for code formatting
- Jest & React Testing Library
- Hardhat Network
- TypeScript for type safety
- Solidity Coverage for contract testing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MetaMask or similar Web3 wallet
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sbdh11/EstateChain.git
cd estate-chain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

1. Start local blockchain:
```bash
npm run node
```

2. Deploy contracts to local network:
```bash
npm run deploy:local
```

3. Start development server:
```bash
npm start
```

### Testing

Run smart contract tests:
```bash
npm run test:contracts
```

Run frontend tests:
```bash
npm test
```

Generate coverage report:
```bash
npm run coverage
```

### Deployment

Deploy to testnet:
```bash
npm run deploy:testnet
```

Deploy to mainnet:
```bash
npm run deploy:mainnet
```

## 📁 Project Structure

```
estate-chain/
├── blockchain/                   
│   ├── contracts/                 # Smart contracts
│   │   ├── tokens/                # Token contracts
│   │   │   ├── PropertyToken.sol
│   │   │   └── GovernanceToken.sol
│   │   ├── core/               
│   │   │   ├── PropertyRegistry.sol
│   │   │   ├── PropertyValuation.sol
│   │   │   └── RentalManagement.sol
│   │   ├── governance/           # Governance contracts
│   │   │   ├── DAO.sol
│   │   │   └── Timelock.sol
│   │   └── interfaces/           # Contract interfaces
│   ├── scripts/                  # Deployment scripts
│   │   ├── deploy/
│   │   └── verify/
│   └── test/                     # Contract tests
│       ├── unit/
│       └── integration/
├── frontend/                      # Frontend application
│   ├── src/
│   │   ├── assets/              
│   │   │   ├── images/
│   │   │   └── styles/
│   │   ├── components/           # React components
│   │   │   ├── common/          
│   │   │   ├── layout/           
│   │   │   └── features/       
│   │   ├── config/            
│   │   ├── hooks/               
│   │   ├── pages/              
│   │   ├── services/           
│   │   ├── types/               
│   │   └── utils/             
│   ├── public/                  
│   └── test/                   
├── packages/                    
│   ├── types/                
│   └── utils/                   
├── docs/                      
│   ├── api/                     
│   ├── contracts/               
│   └── guides/                  
└── tools/                       
    ├── scripts/                 
    └── config/                  
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

