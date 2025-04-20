import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers';
import { useToast } from '@chakra-ui/react';
import { PropertyTokenABI, PropertyValuationABI } from '../services/contracts/abis';
import { CONTRACT_ADDRESSES, NetworkId } from '../config/contracts';

export const useContract = () => {
  const toast = useToast();
  const [state, setState] = useState({
    isConnected: false,
    account: null as string | null,
    chainId: null as string | null,
    provider: null as BrowserProvider | null,
    signer: null as JsonRpcSigner | null,
    propertyToken: null as Contract | null,
    propertyValuation: null as Contract | null,
    escrow: null as Contract | null,
  });

  const initializeContracts = useCallback(async (
    provider: BrowserProvider,
    signer: JsonRpcSigner,
    chainId: string
  ) => {
    try {
      const addresses = CONTRACT_ADDRESSES[chainId as NetworkId];
      
      if (!addresses) {
        throw new Error('Please connect to a supported network (Hardhat local or Sepolia testnet)');
      }

      console.log('Initializing contracts with addresses:', addresses);

      const propertyToken = new Contract(
        addresses.propertyToken,
        PropertyTokenABI,
        signer
      );

      const propertyValuation = new Contract(
        addresses.propertyValuation,
        PropertyValuationABI,
        signer
      );

      return { propertyToken, propertyValuation };
    } catch (error) {
      console.error('Error initializing contracts:', error);
      throw error;
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'Error',
        description: 'Please install MetaMask',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = network.chainId.toString();
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      const contracts = await initializeContracts(provider, signer, chainId);

      setState({
        isConnected: true,
        account,
        chainId,
        provider,
        signer,
        ...contracts,
        escrow: null,
      });

      console.log('Wallet connected successfully:', { account, chainId });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast, initializeContracts]);

  const disconnect = useCallback(async () => {
    setState({
      isConnected: false,
      account: null,
      chainId: null,
      provider: null,
      signer: null,
      propertyToken: null,
      propertyValuation: null,
      escrow: null,
    });
  }, []);

  // Combined useEffect for initialization and event handling
  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum === 'undefined') {
        toast({
          title: 'Error',
          description: 'Please install MetaMask',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const chainId = network.chainId.toString();
        const signer = await provider.getSigner();
        const accounts = await provider.listAccounts();
        const account = accounts.length > 0 ? accounts[0].address : null;

        if (account) {
          const contracts = await initializeContracts(provider, signer, chainId);
          setState({
            isConnected: true,
            account,
            chainId,
            provider,
            signer,
            ...contracts,
            escrow: null,
          });
        }
      } catch (error: any) {
        console.error('Error in initialization:', error);
      }
    };

    // Handle account changes
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          const chainId = network.chainId.toString();
          const contracts = await initializeContracts(provider, signer, chainId);

          setState(prev => ({
            ...prev,
            isConnected: true,
            account: accounts[0],
            provider,
            signer,
            ...contracts,
          }));
        } catch (error: any) {
          console.error('Error updating contracts:', error);
        }
      } else {
        setState(prev => ({
          ...prev,
          isConnected: false,
          account: null,
          propertyToken: null,
          propertyValuation: null,
          escrow: null,
        }));
      }
    };

    // Handle chain changes
    const handleChainChanged = async (chainId: string) => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contracts = await initializeContracts(provider, signer, parseInt(chainId, 16).toString());

        setState(prev => ({
          ...prev,
          chainId: parseInt(chainId, 16).toString(),
          provider,
          signer,
          ...contracts,
        }));
      } catch (error: any) {
        console.error('Error updating contracts after chain change:', error);
        toast({
          title: 'Network Error',
          description: error.message || 'Please connect to a supported network',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    // Initialize and set up event listeners
    init();

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup event listeners
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [toast, initializeContracts]); // Dependencies for the effect

  return {
    ...state,
    connectWallet,
    disconnect,
  };
};

// Extend the window interface to include ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
} 