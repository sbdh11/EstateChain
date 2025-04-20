import { Box, Button, Container, Flex, Heading, SimpleGrid, Stack, Text, Image, Icon } from '@chakra-ui/react';
import { FaBuilding, FaHandshake, FaChartLine, FaLock } from 'react-icons/fa';
import { useContract } from '../hooks/useContract';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const { connectWallet, isConnected } = useContract();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (!isConnected) {
      const connected = await connectWallet();
      if (connected) {
        router.push('/properties');
      }
    } else {
      router.push('/properties');
    }
  };

  return (
    <>
      <Head>
        <title>EstateChain - Next-Gen Real Estate Platform</title>
        <meta name="description" content="EstateChain is a cutting-edge decentralized real estate platform built on Ethereum blockchain." />
      </Head>
      
      <Box>
        {/* Hero Section */}
        <Box bg="brand.600" color="white" py={16}>
          <Container maxW="container.xl">
            <Flex direction={{ base: 'column', md: 'row' }} align="center">
              <Box flex={1} pr={{ base: 0, md: 8 }} pb={{ base: 8, md: 0 }}>
                <Heading as="h1" size="2xl" mb={4}>
                  Revolutionizing Real Estate with Blockchain
                </Heading>
                <Text fontSize="xl" mb={6}>
                  EstateChain is a cutting-edge platform that transforms property transactions through smart contracts, 
                  NFTs, and advanced features for a seamless real estate experience.
                </Text>
                <Button 
                  size="lg" 
                  colorScheme="blue" 
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </Box>
              <Box flex={1}>
                <Image 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80" 
                  alt="Modern building" 
                  borderRadius="lg"
                  shadow="2xl"
                />
              </Box>
            </Flex>
          </Container>
        </Box>

        {/* Features Section */}
        <Box py={16}>
          <Container maxW="container.xl">
            <Heading as="h2" size="xl" mb={12} textAlign="center">
              Core Features
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
              <FeatureCard 
                icon={FaBuilding} 
                title="NFT-based Property Ownership" 
                description="Each property is represented as a unique NFT with detailed metadata"
              />
              <FeatureCard 
                icon={FaHandshake} 
                title="Property Tokenization" 
                description="Fractional ownership of real estate properties"
              />
              <FeatureCard 
                icon={FaLock} 
                title="Secure Escrow System" 
                description="Built-in escrow mechanism with multi-signature support"
              />
              <FeatureCard 
                icon={FaChartLine} 
                title="Property Valuation" 
                description="AI-powered property valuation system"
              />
            </SimpleGrid>
          </Container>
        </Box>

        {/* Call to Action */}
        <Box bg="gray.100" py={16}>
          <Container maxW="container.xl" textAlign="center">
            <Heading as="h2" size="xl" mb={4}>
              Ready to Transform Your Real Estate Experience?
            </Heading>
            <Text fontSize="lg" mb={8} maxW="2xl" mx="auto">
              Join EstateChain today and discover a new way to buy, sell, and manage properties with the security and transparency of blockchain technology.
            </Text>
            <Button 
              size="lg" 
              colorScheme="blue"
              onClick={handleGetStarted}
            >
              {isConnected ? 'Explore Properties' : 'Connect Wallet'}
            </Button>
          </Container>
        </Box>
      </Box>
    </>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Stack align="center" textAlign="center">
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        rounded="full"
        bg="brand.500"
        color="white"
        mb={4}
      >
        <Icon as={icon} w={8} h={8} />
      </Flex>
      <Text fontWeight={600} fontSize="lg" mb={2}>{title}</Text>
      <Text color="gray.600">{description}</Text>
    </Stack>
  );
} 