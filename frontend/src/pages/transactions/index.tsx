import React from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Link as ChakraLink,
  Select,
  HStack,
  Input,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaSearch } from 'react-icons/fa';
import { useContract } from '../../hooks/useContract';
import { formatETH } from '../../utils/format';

// Mock transaction data - replace with real data from blockchain
const mockTransactions = [
  {
    hash: '0x123...abc',
    type: 'Purchase',
    amount: '1.5',
    status: 'completed',
    date: '2024-03-10T10:30:00',
    property: 'Luxury Villa #123',
  },
  {
    hash: '0x456...def',
    type: 'Sale',
    amount: '2.0',
    status: 'completed',
    date: '2024-03-09T15:45:00',
    property: 'Apartment #456',
  },
  {
    hash: '0x789...ghi',
    type: 'Rental Payment',
    amount: '0.5',
    status: 'pending',
    date: '2024-03-08T09:15:00',
    property: 'Office Space #789',
  },
];

const TransactionHistory = () => {
  const { isConnected, chainId } = useContract();

  const getExplorerUrl = (hash: string) => {
    if (!chainId) return 'https://etherscan.io/tx/' + hash;
    
    // Convert chainId to number and handle the conversion
    const chainIdNum = parseInt(chainId);
    switch (chainIdNum) {
      case 1:
        return `https://etherscan.io/tx/${hash}`;
      case 5:
        return `https://goerli.etherscan.io/tx/${hash}`;
      case 11155111:
        return `https://sepolia.etherscan.io/tx/${hash}`;
      default:
        return `https://etherscan.io/tx/${hash}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Transaction History</Heading>

        {!isConnected ? (
          <Box bg="orange.100" p={4} borderRadius="md">
            <Text color="orange.800">
              Please connect your wallet to view your transaction history.
            </Text>
          </Box>
        ) : (
          <>
            <HStack spacing={4}>
              <Select placeholder="Filter by type" maxW="200px">
                <option value="all">All Transactions</option>
                <option value="purchase">Purchases</option>
                <option value="sale">Sales</option>
                <option value="rental">Rental Payments</option>
              </Select>
              <Input
                placeholder="Search transactions..."
                maxW="300px"
              />
              <Tooltip label="Search">
                <IconButton
                  aria-label="Search transactions"
                  icon={<FaSearch />}
                  colorScheme="teal"
                />
              </Tooltip>
            </HStack>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Type</Th>
                    <Th>Property</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                    <Th>Transaction Hash</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mockTransactions.map((tx, index) => (
                    <Tr key={index}>
                      <Td>{new Date(tx.date).toLocaleString()}</Td>
                      <Td>{tx.type}</Td>
                      <Td>{tx.property}</Td>
                      <Td>{formatETH(tx.amount)}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Text>{tx.hash}</Text>
                          <ChakraLink href={getExplorerUrl(tx.hash)} isExternal>
                            <IconButton
                              aria-label="View on Etherscan"
                              icon={<FaExternalLinkAlt />}
                              size="sm"
                              variant="ghost"
                            />
                          </ChakraLink>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default TransactionHistory; 