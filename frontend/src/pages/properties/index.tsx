import { Container, Text, Box } from '@chakra-ui/react';
import { PropertyGrid } from '../../components/PropertyGrid';
import Head from 'next/head';

export default function PropertiesPage() {
  return (
    <>
      <Head>
        <title>Properties | EstateChain</title>
        <meta name="description" content="Browse and purchase real estate properties on EstateChain" />
      </Head>
      
      <Container maxW="container.xl">
        <PropertyGrid />
      </Container>
    </>
  );
} 