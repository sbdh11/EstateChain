// TypeScript interface for the Escrow contract

import { ethers } from 'ethers';

// ABI definition for the Escrow contract - based on Escrow.json
export const EscrowABI = [
  // View functions
  "function approval(uint256, address) view returns (bool)",
  "function buyer(uint256) view returns (address)",
  "function escrowAmount(uint256) view returns (uint256)",
  "function getBalance() view returns (uint256)",
  "function inspectionPassed(uint256) view returns (bool)",
  "function inspector() view returns (address)",
  "function isListed(uint256) view returns (bool)",
  "function lender() view returns (address)",
  "function nftAddress() view returns (address)",
  "function purchasePrice(uint256) view returns (uint256)",
  "function seller() view returns (address payable)",
  
  // State-changing functions
  "function approveSale(uint256 _nftID)",
  "function cancelSale(uint256 _nftID)",
  "function depositEarnest(uint256 _nftID) payable",
  "function finalizeSale(uint256 _nftID)",
  "function list(uint256 _nftID, address _buyer, uint256 _purchasePrice, uint256 _escrowAmount) payable",
  "function updateInspectionStatus(uint256 _nftID, bool _passed)"
];

export default EscrowABI; 