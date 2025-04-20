import React from 'react';
import {
  Box,
  Flex,
  Button,
  Heading,
  HStack,
  useColorModeValue,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tag,
  Tooltip,
  useToast,
  Link as ChakraLink
} from '@chakra-ui/react';
import { FaWallet, FaUser, FaMoon, FaSun, FaChevronDown, FaHistory, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useContract } from '../hooks/useContract';
import { shortenAddress } from '../utils/format';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export const Navigation: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const router = useRouter();
  const toast = useToast();
  
  const { isConnected, connectWallet, account, chainId, disconnect } = useContract();

  // Format network name based on chainId
  const getNetworkName = (chainId: number | null): string => {
    if (!chainId) return 'Unknown Network';
    
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 31337:
        return 'Hardhat Local';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: 'Disconnected',
        description: 'Your wallet has been disconnected.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect wallet.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Box 
      as="nav" 
      position="sticky" 
      top="0" 
      zIndex="sticky"
      bg={bgColor} 
      borderBottom="1px" 
      borderColor={borderColor} 
      py={3} 
      px={4}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
        <HStack spacing={4}>
          <NextLink href="/" passHref legacyBehavior>
            <ChakraLink _hover={{ textDecoration: 'none' }}>
              <Heading 
                size="md" 
                bgGradient="linear(to-r, teal.500, blue.500)"
                bgClip="text"
                fontWeight="extrabold"
                cursor="pointer"
              >
                EstateChain
              </Heading>
            </ChakraLink>
          </NextLink>
          {chainId && (
            <Tag size="sm" colorScheme={Number(chainId) === 1 ? 'green' : 'orange'}>
              {getNetworkName(Number(chainId))}
            </Tag>
          )}
        </HStack>

        <HStack spacing={4}>
          {isConnected && (
            <HStack spacing={2}>
              <NextLink href="/properties" passHref legacyBehavior>
                <Button as={ChakraLink} variant="ghost" size="sm">
                  Properties
                </Button>
              </NextLink>
              <NextLink href="/portfolio" passHref legacyBehavior>
                <Button as={ChakraLink} variant="ghost" size="sm">
                  Portfolio
                </Button>
              </NextLink>
              <NextLink href="/valuation" passHref legacyBehavior>
                <Button as={ChakraLink} variant="ghost" size="sm">
                  Valuation
                </Button>
              </NextLink>
            </HStack>
          )}
          
          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
          />
          
          {isConnected ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaChevronDown />}
                leftIcon={<FaUser />}
                colorScheme="teal"
                variant="outline"
              >
                {account ? shortenAddress(account) : 'Connected'}
              </MenuButton>
              <MenuList>
                <NextLink href="/portfolio" passHref legacyBehavior>
                  <MenuItem as={ChakraLink} icon={<FaHome />}>
                    My Properties
                  </MenuItem>
                </NextLink>
                <NextLink href="/transactions" passHref legacyBehavior>
                  <MenuItem as={ChakraLink} icon={<FaHistory />}>
                    Transaction History
                  </MenuItem>
                </NextLink>
                <NextLink href="/settings" passHref legacyBehavior>
                  <MenuItem as={ChakraLink} icon={<FaCog />}>
                    Settings
                  </MenuItem>
                </NextLink>
                <MenuItem 
                  icon={<FaSignOutAlt />} 
                  onClick={handleDisconnect}
                  color="red.500"
                >
                  Disconnect
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Tooltip label="Connect MetaMask or other Ethereum wallet">
              <Button
                onClick={connectWallet}
                leftIcon={<FaWallet />}
                colorScheme="teal"
              >
                Connect Wallet
              </Button>
            </Tooltip>
          )}
        </HStack>
      </Flex>
    </Box>
  );
} 