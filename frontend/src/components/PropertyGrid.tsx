import React, { useState, useEffect } from 'react';
import { 
  SimpleGrid, 
  Box, 
  Text, 
  Heading, 
  Button,
  useDisclosure,
  VStack,
  HStack,
  Badge,
  Spinner
} from '@chakra-ui/react';
import { PropertyCard } from './PropertyCard';
import { usePropertyOperations } from '../hooks/usePropertyOperations';
import { useContract } from '../hooks/useContract';
import ListPropertyModal from './ListPropertyModal';
import { FaEthereum } from 'react-icons/fa';
import { ethers } from 'ethers';
import { formatEther } from 'ethers';

interface PropertyData {
  id: string;
  name: string;
  location: string;
  price: string;
  owner: string;
  imageUrl: string;
  description: string;
  features: string[];
  saleStatus?: 'available' | 'pending' | 'sold';
  availableShares: number;
}

type PropertyCardProps = PropertyData & {
  onBuy: (id: string, price: string) => Promise<void>;
  isLoading: boolean;
}

export const PropertyGrid: React.FC = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [myProperties, setMyProperties] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingPropertyId, setLoadingPropertyId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const { isConnected, account, provider, propertyToken } = useContract();
  const { 
    buyProperty, 
    listProperty,
    transactionStatus, 
    resetStatus 
  } = usePropertyOperations();
  
  // Modal for listing a new property
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Load properties and balance when component mounts
  useEffect(() => {
    fetchProperties();
    fetchBalance();
  }, [account, provider]);

  // Fetch user's ETH balance
  const fetchBalance = async () => {
    if (provider && account) {
      try {
        const balance = await provider.getBalance(account);
        setBalance(formatEther(balance));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };
  
  // Filter properties to find ones owned by the current user
  useEffect(() => {
    if (account && properties.length > 0) {
      const userProperties = properties.filter(
        prop => prop.owner.toLowerCase() === account.toLowerCase()
      );
      setMyProperties(userProperties);
    } else {
      setMyProperties([]);
    }
  }, [properties, account]);

  // Use the getProperties function to fetch properties
  const fetchProperties = async () => {
    setIsLoading(true);
    
    try {
      if (!propertyToken || !account) {
        // Use mock data if contract is not initialized or user is not connected
        const mockProperties: PropertyData[] = createMockProperties();
        setProperties(mockProperties);
        setIsLoading(false);
        return;
      }

      // Try to get properties from the contract, but handle errors gracefully
      try {
        // Get contract owner to check if connected
        await propertyToken.name();
        
        // Mock data for now - replace with real data when contract functions are available
        const mockProperties: PropertyData[] = createMockProperties();
        setProperties(mockProperties);
      } catch (error) {
        console.error('Contract error:', error);
        // Fallback to mock data
        const mockProperties: PropertyData[] = createMockProperties();
        setProperties(mockProperties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      // If all else fails, use simple mock data
      const mockProperties: PropertyData[] = createMockProperties();
      setProperties(mockProperties);
    } finally {
      setIsLoading(false);
    }
  };

  // Create consistent mock data
  const createMockProperties = (): PropertyData[] => {
    // Generate different mock addresses to ensure user doesn't own all properties
    const mockOwners = [
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // First test account in Hardhat
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Second test account in Hardhat
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'  // Third test account in Hardhat
    ];
    
    return [
      {
        id: '0',
        name: 'Luxury Villa',
        location: '123 Ocean Drive',
        price: '2.5',
        owner: mockOwners[0], // Use a different address, not the user's
        imageUrl: 'https://placehold.co/300x200',
        description: 'A beautiful luxury villa with ocean views',
        features: ['Pool', 'Garden', '5 Bedrooms'],
        saleStatus: 'available',
        availableShares: 100
      },
      {
        id: '1',
        name: 'Downtown Apartment',
        location: '456 Main Street',
        price: '1.2',
        owner: mockOwners[1], // Use a different address, not the user's
        imageUrl: 'https://placehold.co/300x200',
        description: 'Modern apartment in the heart of downtown',
        features: ['Balcony', '2 Bedrooms', 'Parking'],
        saleStatus: 'available',
        availableShares: 50
      }
    ];
  };

  // Handle property purchase
  const handleBuyProperty = async (id: string, price: string) => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setLoadingPropertyId(id);
    
    try {
      const txHash = await buyProperty(id, price);
      if (txHash) {
        // Update the UI to reflect the change - update the owner and status
        setProperties(prevProperties => 
          prevProperties.map(prop => 
            prop.id === id ? { 
              ...prop, 
              saleStatus: 'pending',
              owner: account,  // Set current user as the new owner
              availableShares: 0 // Mark as fully purchased
            } : prop
          )
        );
        
        // Refresh properties and balance
        await Promise.all([fetchBalance()]);
      }
    } finally {
      setLoadingPropertyId(null);
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    resetStatus();
    onClose();
  };

  return (
    <VStack spacing={6} width="100%" align="stretch">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h1" size="xl">EstateChain Properties</Heading>
        <HStack spacing={4}>
          {isConnected && (
            <Badge colorScheme="green" p={2} borderRadius="md">
              <HStack>
                <FaEthereum />
                <Text>{parseFloat(balance).toFixed(4)} ETH</Text>
              </HStack>
            </Badge>
          )}
          <Button 
            colorScheme="blue" 
            onClick={onOpen}
            isDisabled={!isConnected}
          >
            List New Property
          </Button>
        </HStack>
      </Box>
      
      {/* My Properties Section */}
      {isConnected && myProperties.length > 0 && (
        <Box mb={8}>
          <Heading as="h2" size="lg" mb={4}>My Properties</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {myProperties.map((property) => (
              <PropertyCard
                key={`my-${property.id}`}
                id={property.id}
                name={property.name}
                location={property.location}
                price={property.price}
                owner={property.owner}
                imageUrl={property.imageUrl}
                description={property.description}
                features={property.features}
                onBuy={handleBuyProperty}
                isLoading={loadingPropertyId === property.id}
                saleStatus={property.saleStatus}
                availableShares={property.availableShares}
              />
            ))}
          </SimpleGrid>
        </Box>
      )}
      
      {/* All Properties Section */}
      <Box>
        <Heading as="h2" size="lg" mb={4}>All Available Properties</Heading>
        {properties.length === 0 && !isLoading ? (
          <Text textAlign="center" fontSize="lg" py={10}>
            No properties found. Be the first to list a property!
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {properties
              .filter(property => property.owner.toLowerCase() !== (account || '').toLowerCase())
              .map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  name={property.name}
                  location={property.location}
                  price={property.price}
                  owner={property.owner}
                  imageUrl={property.imageUrl}
                  description={property.description}
                  features={property.features}
                  onBuy={handleBuyProperty}
                  isLoading={loadingPropertyId === property.id}
                  saleStatus={property.saleStatus}
                  availableShares={property.availableShares}
                />
              ))}
          </SimpleGrid>
        )}
      </Box>
      
      <ListPropertyModal 
        isOpen={isOpen} 
        onClose={handleCloseModal}
      />
    </VStack>
  );
}; 