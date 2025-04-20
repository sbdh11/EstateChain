import React, { useState, useEffect } from 'react';
import {
  Box,
  Image,
  Text,
  Heading,
  Stack,
  Badge,
  Button,
  Flex,
  useColorModeValue,
  Divider,
  Tooltip
} from '@chakra-ui/react';
import { FaEthereum, FaMapMarkerAlt } from 'react-icons/fa';
import { usePropertyOperations } from '../hooks/usePropertyOperations';

interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  price: string;
  owner: string;
  imageUrl: string;
  description: string;
  features: string[];
  onBuy: (id: string, price: string) => void;
  onFinalize?: (id: string) => void;
  isLoading?: boolean;
  saleStatus?: 'available' | 'pending' | 'sold';
  availableShares: number;
}

// Define inline version instead of importing from separate module
const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  if (address.length < 10) return address;
  
  const prefix = address.slice(0, chars + 2); // +2 for "0x"
  const suffix = address.slice(-chars);
  
  return `${prefix}...${suffix}`;
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  name,
  location,
  price,
  owner,
  imageUrl,
  description,
  features,
  onBuy,
  onFinalize,
  isLoading = false,
  saleStatus = 'available',
  availableShares
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { isConnected, account } = usePropertyOperations();
  
  // Check if the current account is a shareholder (simplified check)
  const isOwner = account && owner && account.toLowerCase() === owner.toLowerCase();
  
  // Toggle details visibility
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const ownerBorderColor = useColorModeValue('teal.300', 'teal.600');
  
  // Use a placeholder image if none is provided
  const propertyImage = imageUrl || 'https://placehold.co/400x300';

  return (
    <Box
      maxW="sm"
      overflow="hidden"
      boxShadow="md"
      bg={cardBg}
      borderColor={isOwner ? ownerBorderColor : borderColor}
      borderWidth={isOwner ? "2px" : "1px"}
      borderRadius="lg"
      position="relative"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    >
      {isOwner && (
        <Badge 
          position="absolute" 
          top="0" 
          right="0" 
          m={2} 
          colorScheme="teal" 
          fontSize="sm"
          zIndex="1"
          borderRadius="md"
          px={2}
          py={1}
        >
          Owned by You
        </Badge>
      )}
      
      <Image
        src={propertyImage}
        alt={name}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <Box p={4}>
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            NFT #{id}
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml={2}
          >
            TokenID: {id}
          </Box>
        </Box>

        <Heading
          mt={1}
          fontSize="xl"
          fontWeight="semibold"
          lineHeight="tight"
          isTruncated
        >
          {name}
        </Heading>

        <Flex align="center" mt={2}>
          <FaMapMarkerAlt color="#718096" />
          <Text ml={2} color="gray.600" fontSize="sm">
            {location}
          </Text>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center" mt={3}>
          <Flex align="center">
            <FaEthereum color="#3182CE" />
            <Text ml={1} fontSize="xl" fontWeight="bold" color="blue.600">
              {price} ETH
            </Text>
          </Flex>
          {!isOwner && (
            <Tooltip label={owner}>
              <Text fontSize="sm" color="gray.500">
                Owner: {shortenAddress(owner)}
              </Text>
            </Tooltip>
          )}
        </Flex>

        <Divider my={3} />

        <Box>
          <Text color={textColor} noOfLines={2} mb={2}>
            {description}
          </Text>

          <Flex justifyContent="space-between" alignItems="center" mt={2}>
            <Badge colorScheme={isOwner ? "teal" : "purple"}>
              {isOwner ? 'Shares: ' + availableShares : availableShares + ' shares available'}
            </Badge>
            {features.length > 0 && (
              <Stack direction="row" flexWrap="wrap">
                {features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} colorScheme="blue" variant="subtle" mr={1} mb={1}>
                    {feature}
                  </Badge>
                ))}
                {features.length > 3 && (
                  <Badge colorScheme="gray" variant="outline">
                    +{features.length - 3} more
                  </Badge>
                )}
              </Stack>
            )}
          </Flex>
        </Box>

        <Button
          mt={4}
          w="100%"
          variant="outline"
          colorScheme="blue"
          onClick={toggleDetails}
        >
          {showDetails ? 'Show Less' : 'Show More'}
        </Button>

        {isOwner ? (
          <Button
            mt={4}
            w="100%"
            colorScheme="teal"
            leftIcon={<FaEthereum />}
          >
            Manage Property
          </Button>
        ) : saleStatus === 'pending' && onFinalize ? (
          <Button
            mt={4}
            w="100%"
            colorScheme="orange"
            onClick={() => onFinalize(id)}
            isLoading={isLoading}
            loadingText="Finalizing..."
          >
            Finalize Purchase
          </Button>
        ) : (
          <Button
            mt={4}
            w="100%"
            colorScheme="teal"
            onClick={() => onBuy(id, price)}
            isLoading={isLoading}
            loadingText="Processing..."
            isDisabled={availableShares === 0}
          >
            {availableShares > 0 ? 'Buy Property' : 'Sold Out'}
          </Button>
        )}
      </Box>
    </Box>
  );
}; 