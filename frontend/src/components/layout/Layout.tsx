import React, { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Flex
      direction="column"
      minHeight="100vh"
      bg="gray.50"
    >
      <Header />
      <Box flex="1" p={4}>
        {children}
      </Box>
      <Footer />
    </Flex>
  );
} 