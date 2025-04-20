import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorModeValue,
  Badge,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { useContract } from '../../hooks/useContract';

// Mock data for user's portfolio
const MOCK_PORTFOLIO = {
  totalValue: 487500,
  totalReturn: 3.6,
  portfolioHistory: [
    { date: '2023-01-01', value: 450000 },
    { date: '2023-02-01', value: 455000 },
    { date: '2023-03-01', value: 462000 },
    { date: '2023-04-01', value: 470000 },
    { date: '2023-05-01', value: 487500 },
  ],
  properties: [
    {
      id: '1',
      tokenId: '1',
      name: 'Modern Downtown Apartment',
      location: 'New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
      purchaseDate: '2023-01-15',
      sharesOwned: 250,
      totalShares: 1000,
      sharePrice: 250,
      currentSharePrice: 267.5,
      return: 7.0,
    },
    {
      id: '2',
      tokenId: '2',
      name: 'Suburban Family Home',
      location: 'Austin, TX',
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      purchaseDate: '2023-02-10',
      sharesOwned: 400,
      totalShares: 1000,
      sharePrice: 450,
      currentSharePrice: 459,
      return: 2.0,
    },
    {
      id: '3',
      tokenId: '3',
      name: 'Beachfront Condo',
      location: 'Miami, FL',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      purchaseDate: '2023-03-05',
      sharesOwned: 100,
      totalShares: 1000,
      sharePrice: 350,
      currentSharePrice: 352.5,
      return: 0.7,
    }
  ],
  transactions: [
    {
      id: '1',
      propertyId: '1',
      propertyName: 'Modern Downtown Apartment',
      date: '2023-01-15',
      type: 'purchase',
      shares: 250,
      pricePerShare: 250,
      total: 62500,
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    },
    {
      id: '2',
      propertyId: '2',
      propertyName: 'Suburban Family Home',
      date: '2023-02-10',
      type: 'purchase',
      shares: 400,
      pricePerShare: 450,
      total: 180000,
      txHash: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef'
    },
    {
      id: '3',
      propertyId: '3',
      propertyName: 'Beachfront Condo',
      date: '2023-03-05',
      type: 'purchase',
      shares: 100,
      pricePerShare: 350,
      total: 35000,
      txHash: '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef'
    }
  ]
};

interface OwnedProperty {
  id: string;
  tokenId: string;
  name: string;
  location: string;
  imageUrl: string;
  purchaseDate: string;
  sharesOwned: number;
  totalShares: number;
  sharePrice: number;
  currentSharePrice: number;
  return: number;
}

interface Transaction {
  id: string;
  propertyId: string;
  propertyName: string;
  date: string;
  type: 'purchase' | 'sale';
  shares: number;
  pricePerShare: number;
  total: number;
  txHash: string;
}

const PropertyCard: React.FC<{
  property: OwnedProperty;
  onSell: (property: OwnedProperty) => void;
}> = ({ property, onSell }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
    >
      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
        <Image 
          src={property.imageUrl} 
          alt={property.name} 
          borderRadius="md"
          objectFit="cover"
          width={{ base: '100%', md: '150px' }}
          height={{ base: '150px', md: '150px' }}
        />
        
        <Box flex="1">
          <Heading size="md" mb={1}>{property.name}</Heading>
          <Text fontSize="sm" color="gray.600" mb={2}>{property.location}</Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
            <Stat size="sm">
              <StatLabel>Shares Owned</StatLabel>
              <StatNumber>
                {property.sharesOwned} 
                <Text as="span" fontSize="sm" fontWeight="normal">
                  /{property.totalShares}
                </Text>
              </StatNumber>
              <StatHelpText>
                {((property.sharesOwned / property.totalShares) * 100).toFixed(1)}% ownership
              </StatHelpText>
            </Stat>
            
            <Stat size="sm">
              <StatLabel>Current Value</StatLabel>
              <StatNumber>${(property.sharesOwned * property.currentSharePrice).toLocaleString()}</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  {property.return >= 0 ? (
                    <>
                      <ArrowUpIcon color="green.400" mr={1} />
                      <Text color="green.400">{property.return}%</Text>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon color="red.400" mr={1} />
                      <Text color="red.400">{Math.abs(property.return)}%</Text>
                    </>
                  )}
                </Flex>
              </StatHelpText>
            </Stat>
          </SimpleGrid>
          
          <Flex justify="space-between" align="center">
            <Text fontSize="sm">Purchased: {new Date(property.purchaseDate).toLocaleDateString()}</Text>
            <Button size="sm" colorScheme="teal" onClick={() => onSell(property)}>
              Sell Shares
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg={bgColor}
      borderColor={borderColor}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="sm">{transaction.propertyName}</Heading>
        <Badge colorScheme={transaction.type === 'purchase' ? 'green' : 'purple'}>
          {transaction.type === 'purchase' ? 'Purchase' : 'Sale'}
        </Badge>
      </Flex>
      
      <Text fontSize="sm" color="gray.600" mb={3}>
        {new Date(transaction.date).toLocaleDateString()} • 
        {transaction.shares} shares @ ${transaction.pricePerShare}
      </Text>
      
      <Flex justify="space-between" align="center">
        <Text fontWeight="bold">Total: ${transaction.total.toLocaleString()}</Text>
        <Button
          size="xs"
          variant="outline"
          onClick={() => window.open(`https://etherscan.io/tx/${transaction.txHash}`, '_blank')}
        >
          View Transaction
        </Button>
      </Flex>
    </Box>
  );
};

const Portfolio: React.FC = () => {
  const { isConnected, connectWallet, propertyToken } = useContract();
  const [portfolio, setPortfolio] = useState<typeof MOCK_PORTFOLIO | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!isConnected) {
        setLoading(false);
        return;
      }
      
      try {
        // In a real app, we would fetch portfolio data from the blockchain
        // For now, we'll use mock data with a simulated delay
        setTimeout(() => {
          setPortfolio(MOCK_PORTFOLIO);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setLoading(false);
        toast({
          title: 'Error fetching portfolio',
          description: 'There was an error retrieving your portfolio data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    fetchPortfolio();
  }, [isConnected, toast]);
  
  const handleSellShares = (property: OwnedProperty) => {
    // In a real application, this would open a modal to select
    // the number of shares to sell and execute the transaction
    alert(`You selected to sell shares of ${property.name}. In a complete app, this would open a sell shares modal.`);
  };
  
  if (!isConnected) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Heading>Connect Your Wallet</Heading>
          <Text textAlign="center">
            Connect your wallet to view and manage your property portfolio
          </Text>
          <Button colorScheme="teal" size="lg" onClick={connectWallet}>
            Connect Wallet
          </Button>
        </VStack>
      </Container>
    );
  }
  
  if (loading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" thickness="4px" color="teal.500" />
        </Flex>
      </Container>
    );
  }
  
  if (!portfolio) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Heading>No Portfolio Found</Heading>
          <Text textAlign="center">
            You don't have any property investments yet.
          </Text>
          <Button colorScheme="teal" size="lg" onClick={() => window.location.href = '/listings'}>
            Browse Properties
          </Button>
        </VStack>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={8}>
        My Property Portfolio
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat
          p={5}
          shadow="md"
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          borderRadius="lg"
        >
          <StatLabel fontSize="md">Total Portfolio Value</StatLabel>
          <StatNumber fontSize="2xl">${portfolio.totalValue.toLocaleString()}</StatNumber>
          <StatHelpText>
            <Flex align="center">
              {portfolio.totalReturn >= 0 ? (
                <>
                  <ArrowUpIcon color="green.400" mr={1} />
                  <Text color="green.400">{portfolio.totalReturn}% overall</Text>
                </>
              ) : (
                <>
                  <ArrowDownIcon color="red.400" mr={1} />
                  <Text color="red.400">{Math.abs(portfolio.totalReturn)}% overall</Text>
                </>
              )}
            </Flex>
          </StatHelpText>
        </Stat>
        
        <Stat
          p={5}
          shadow="md"
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          borderRadius="lg"
        >
          <StatLabel fontSize="md">Properties Owned</StatLabel>
          <StatNumber fontSize="2xl">{portfolio.properties.length}</StatNumber>
          <StatHelpText>Across different locations</StatHelpText>
        </Stat>
        
        <Stat
          p={5}
          shadow="md"
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          borderRadius="lg"
        >
          <StatLabel fontSize="md">Total Transactions</StatLabel>
          <StatNumber fontSize="2xl">{portfolio.transactions.length}</StatNumber>
          <StatHelpText>Since you started investing</StatHelpText>
        </Stat>
      </SimpleGrid>
      
      <Tabs colorScheme="teal" mb={8}>
        <TabList>
          <Tab>My Properties</Tab>
          <Tab>Transaction History</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel px={0}>
            <VStack spacing={4} align="stretch">
              {portfolio.properties.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text fontSize="lg">You don't own any properties yet.</Text>
                  <Button mt={4} colorScheme="teal" onClick={() => window.location.href = '/listings'}>
                    Browse Properties
                  </Button>
                </Box>
              ) : (
                portfolio.properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSell={handleSellShares}
                  />
                ))
              )}
            </VStack>
          </TabPanel>
          
          <TabPanel px={0}>
            <VStack spacing={4} align="stretch">
              {portfolio.transactions.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text fontSize="lg">No transactions found.</Text>
                </Box>
              ) : (
                portfolio.transactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Portfolio; 