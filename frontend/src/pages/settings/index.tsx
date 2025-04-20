import React from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Divider,
  useColorMode,
  Card,
  CardBody,
  SimpleGrid,
  Button,
  useToast
} from '@chakra-ui/react';
import { useContract } from '../../hooks/useContract';

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isConnected } = useContract();
  const toast = useToast();

  const handleNotificationToggle = (enabled: boolean) => {
    toast({
      title: `Notifications ${enabled ? 'enabled' : 'disabled'}`,
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Settings</Heading>
        
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Appearance</Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="dark-mode" mb="0">
                  Dark Mode
                </FormLabel>
                <Switch
                  id="dark-mode"
                  isChecked={colorMode === 'dark'}
                  onChange={toggleColorMode}
                />
              </FormControl>
              <Divider />
              
              <Heading size="md">Notifications</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="price-alerts" mb="0">
                    Price Alerts
                  </FormLabel>
                  <Switch
                    id="price-alerts"
                    onChange={(e) => handleNotificationToggle(e.target.checked)}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="transaction-alerts" mb="0">
                    Transaction Alerts
                  </FormLabel>
                  <Switch
                    id="transaction-alerts"
                    onChange={(e) => handleNotificationToggle(e.target.checked)}
                  />
                </FormControl>
              </SimpleGrid>
              <Divider />

              <Heading size="md">Privacy</Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="public-portfolio" mb="0">
                  Public Portfolio
                </FormLabel>
                <Switch
                  id="public-portfolio"
                  onChange={(e) => {
                    toast({
                      title: `Portfolio visibility ${e.target.checked ? 'public' : 'private'}`,
                      status: 'success',
                      duration: 2000,
                    });
                  }}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {!isConnected && (
          <Box bg="orange.100" p={4} borderRadius="md">
            <Text color="orange.800">
              Please connect your wallet to access all settings.
            </Text>
          </Box>
        )}

        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => {
            toast({
              title: 'Settings reset',
              description: 'All settings have been reset to default.',
              status: 'info',
              duration: 3000,
            });
          }}
        >
          Reset All Settings
        </Button>
      </VStack>
    </Container>
  );
};

export default Settings; 