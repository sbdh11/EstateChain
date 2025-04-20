import React, { useState } from 'react';
import {
  Container,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  HStack,
  Text,
  Divider,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Flex,
  Icon,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { FaCalculator, FaInfoCircle, FaChartLine } from 'react-icons/fa';
import Head from 'next/head';
import { useContract } from '../../hooks/useContract';
import { formatETH, formatNumber } from '../../utils/format';

export default function ValuationPage() {
  const { isConnected } = useContract();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Form state
  const [property, setProperty] = useState({
    location: '',
    propertyType: 'residential',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    yearBuilt: 2010,
    hasGarage: true,
    hasParkingSpace: true,
    hasGarden: false,
    hasPool: false,
    hasView: false,
    isBeachfront: false,
    isCityCenter: false
  });

  // Valuation results state
  const [valuation, setValuation] = useState<null | {
    estimatedValue: number;
    pricePerSqFt: number;
    confidence: number;
    comparison: number;
  }>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setProperty({ ...property, [name]: checked });
    } else {
      setProperty({ ...property, [name]: value });
    }
  };

  const handleNumberChange = (name: string, value: string) => {
    setProperty({ ...property, [name]: parseFloat(value) });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setProperty({ ...property, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulated AI-powered valuation calculation
      // In a real app, you would call the blockchain or an API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Base value calculation - simplified version of what an AI model might do
      let baseValue = property.squareFeet * 250; // Base price per sq ft
      
      // Adjustments based on property features
      baseValue *= property.propertyType === 'luxury' ? 1.5 : 
                  property.propertyType === 'commercial' ? 1.3 : 1;
      
      baseValue *= 1 + (property.bedrooms * 0.05); // Each bedroom adds 5%
      baseValue *= 1 + (property.bathrooms * 0.03); // Each bathroom adds 3%
      
      // Age reduction factor
      const currentYear = new Date().getFullYear();
      const age = currentYear - property.yearBuilt;
      const ageFactor = Math.max(0.7, 1 - (age * 0.005)); // Max 30% reduction for old properties
      baseValue *= ageFactor;
      
      // Amenities bonuses
      if (property.hasGarage) baseValue *= 1.1;
      if (property.hasPool) baseValue *= 1.15;
      if (property.hasView) baseValue *= 1.2;
      if (property.isBeachfront) baseValue *= 1.4;
      if (property.isCityCenter) baseValue *= 1.25;
      
      // Random market fluctuation for demo purposes
      const marketFactor = 0.9 + (Math.random() * 0.2); // ±10% random variation
      baseValue *= marketFactor;
      
      setValuation({
        estimatedValue: baseValue,
        pricePerSqFt: baseValue / property.squareFeet,
        confidence: 85 + (Math.random() * 10), // 85-95% confidence
        comparison: Math.random() > 0.5 ? 5 + (Math.random() * 10) : -(5 + (Math.random() * 10)) // Random comparison
      });
      
      toast({
        title: 'Valuation Complete',
        description: 'Property valuation has been successfully calculated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Valuation error:', error);
      toast({
        title: 'Valuation Error',
        description: 'There was an error calculating your property valuation.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Property Valuation | EstateChain</title>
        <meta name="description" content="Get AI-powered property valuation with EstateChain" />
      </Head>
      
      <Container maxW="container.xl" py={8}>
        <Heading as="h1" mb={6} display="flex" alignItems="center">
          <Icon as={FaCalculator} mr={3} />
          Property Valuation
        </Heading>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          <Box 
            as="form"
            onSubmit={handleSubmit}
            bg={bgColor}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="md"
          >
            <VStack spacing={5} align="start">
              <Heading as="h3" size="md" mb={2}>Property Details</Heading>
              
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input 
                  name="location" 
                  value={property.location} 
                  onChange={handleChange} 
                  placeholder="City, State or Full Address"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Property Type</FormLabel>
                <Select name="propertyType" value={property.propertyType} onChange={handleChange}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="luxury">Luxury</option>
                  <option value="industrial">Industrial</option>
                </Select>
              </FormControl>
              
              <SimpleGrid columns={2} spacing={5} width="100%">
                <FormControl>
                  <FormLabel>Bedrooms</FormLabel>
                  <NumberInput 
                    min={0} 
                    max={20} 
                    value={property.bedrooms}
                    onChange={(value) => handleNumberChange('bedrooms', value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Bathrooms</FormLabel>
                  <NumberInput 
                    min={0} 
                    max={20}
                    step={0.5}
                    value={property.bathrooms}
                    onChange={(value) => handleNumberChange('bathrooms', value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
              
              <SimpleGrid columns={2} spacing={5} width="100%">
                <FormControl isRequired>
                  <FormLabel>Square Feet</FormLabel>
                  <NumberInput 
                    min={100}
                    value={property.squareFeet}
                    onChange={(value) => handleNumberChange('squareFeet', value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Year Built</FormLabel>
                  <NumberInput 
                    min={1800}
                    max={new Date().getFullYear()}
                    value={property.yearBuilt}
                    onChange={(value) => handleNumberChange('yearBuilt', value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
              
              <Divider my={2} />
              
              <Heading as="h3" size="md" mb={2}>Property Features</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                <Box>
                  <FormControl display="flex" alignItems="center">
                    <Input 
                      type="checkbox" 
                      id="hasGarage"
                      checked={property.hasGarage}
                      onChange={(e) => handleCheckboxChange('hasGarage', e.target.checked)}
                      mr={2}
                    />
                    <FormLabel htmlFor="hasGarage" mb={0}>Has Garage</FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <Input 
                      type="checkbox" 
                      id="hasParkingSpace"
                      checked={property.hasParkingSpace}
                      onChange={(e) => handleCheckboxChange('hasParkingSpace', e.target.checked)}
                      mr={2}
                    />
                    <FormLabel htmlFor="hasParkingSpace" mb={0}>Has Parking Space</FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <Input 
                      type="checkbox" 
                      id="hasGarden"
                      checked={property.hasGarden}
                      onChange={(e) => handleCheckboxChange('hasGarden', e.target.checked)}
                      mr={2}
                    />
                    <FormLabel htmlFor="hasGarden" mb={0}>Has Garden</FormLabel>
                  </FormControl>
                </Box>
                
                <Box>
                  <FormControl display="flex" alignItems="center">
                    <Input 
                      type="checkbox" 
                      id="hasPool"
                      checked={property.hasPool}
                      onChange={(e) => handleCheckboxChange('hasPool', e.target.checked)}
                      mr={2}
                    />
                    <FormLabel htmlFor="hasPool" mb={0}>Has Pool</FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <Input 
                      type="checkbox" 
                      id="hasView"
                      checked={property.hasView}
                      onChange={(e) => handleCheckboxChange('hasView', e.target.checked)}
                      mr={2}
                    />
                    <FormLabel htmlFor="hasView" mb={0}>Has View</FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <Input 
                      type="checkbox" 
                      id="isBeachfront"
                      checked={property.isBeachfront}
                      onChange={(e) => handleCheckboxChange('isBeachfront', e.target.checked)}
                      mr={2}
                    />
                    <FormLabel htmlFor="isBeachfront" mb={0}>Beachfront Property</FormLabel>
                  </FormControl>
                </Box>
              </SimpleGrid>
              
              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                width="full" 
                mt={4}
                isLoading={isLoading}
                loadingText="Calculating"
                leftIcon={<FaChartLine />}
                isDisabled={!isConnected}
              >
                Calculate Valuation
              </Button>
              
              {!isConnected && (
                <Text color="red.500" fontSize="sm">
                  Please connect your wallet to use the valuation tool.
                </Text>
              )}
            </VStack>
          </Box>
          
          {valuation ? (
            <Box 
              bg={bgColor}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="md"
            >
              <Heading as="h3" size="md" mb={6}>Valuation Results</Heading>
              
              <VStack spacing={6} align="stretch">
                <Stat>
                  <StatLabel fontSize="lg">Estimated Property Value</StatLabel>
                  <StatNumber fontSize="3xl" color="blue.500">
                    {formatETH(valuation.estimatedValue.toFixed(2))}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type={valuation.comparison > 0 ? 'increase' : 'decrease'} />
                    {Math.abs(valuation.comparison).toFixed(1)}% compared to similar properties
                  </StatHelpText>
                </Stat>
                
                <SimpleGrid columns={2} spacing={5}>
                  <Stat>
                    <StatLabel>Price per Sq Ft</StatLabel>
                    <StatNumber>
                      {formatETH(valuation.pricePerSqFt.toFixed(2))}
                    </StatNumber>
                  </Stat>
                  
                  <Stat>
                    <StatLabel>
                      Confidence
                      <Tooltip label="How confident our AI model is about this valuation">
                        <span>
                          <Icon as={FaInfoCircle} ml={1} />
                        </span>
                      </Tooltip>
                    </StatLabel>
                    <StatNumber>
                      {valuation.confidence.toFixed(1)}%
                    </StatNumber>
                  </Stat>
                </SimpleGrid>
                
                <Divider />
                
                <Box>
                  <Heading as="h4" size="sm" mb={3}>Property Details Summary</Heading>
                  <Text>
                    {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} property
                    with {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''} and {property.bathrooms} 
                    bathroom{property.bathrooms !== 1 ? 's' : ''}, {formatNumber(property.squareFeet)} sq ft, 
                    built in {property.yearBuilt}.
                  </Text>
                  
                  <HStack wrap="wrap" mt={3}>
                    {property.hasGarage && <Badge colorScheme="blue">Garage</Badge>}
                    {property.hasParkingSpace && <Badge colorScheme="blue">Parking</Badge>}
                    {property.hasGarden && <Badge colorScheme="green">Garden</Badge>}
                    {property.hasPool && <Badge colorScheme="cyan">Pool</Badge>}
                    {property.hasView && <Badge colorScheme="purple">View</Badge>}
                    {property.isBeachfront && <Badge colorScheme="orange">Beachfront</Badge>}
                    {property.isCityCenter && <Badge colorScheme="yellow">City Center</Badge>}
                  </HStack>
                </Box>
                
                <Flex justify="space-between">
                  <Button colorScheme="gray" onClick={() => setValuation(null)}>
                    Reset
                  </Button>
                  
                  <Button colorScheme="teal">
                    Save to Blockchain
                  </Button>
                </Flex>
              </VStack>
            </Box>
          ) : (
            <Box 
              bg={bgColor}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="md"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Icon as={FaCalculator} boxSize={16} color="gray.300" mb={6} />
              <Heading as="h3" size="md" color="gray.500" textAlign="center">
                Fill out the form and calculate your property's blockchain-backed valuation
              </Heading>
              <Text mt={4} color="gray.500" textAlign="center">
                Our AI-powered model analyzes property features and market data to provide accurate valuations
              </Text>
            </Box>
          )}
        </SimpleGrid>
      </Container>
    </>
  );
} 