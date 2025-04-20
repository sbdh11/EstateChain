import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { usePropertyOperations } from '../hooks/usePropertyOperations';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ListPropertyModal({ isOpen, onClose }: ListPropertyModalProps) {
  const { listProperty, transactionStatus: txStatus = { isError: false, hash: null } } = usePropertyOperations();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    escrowAmount: '',
    squareFootage: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    buyer: '',
  });

  const handleListProperty = async () => {
    const success = await listProperty({
      name: formData.name,
      location: formData.location,
      price: formData.price,
      escrowAmount: formData.escrowAmount,
      squareFootage: Number(formData.squareFootage),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      yearBuilt: Number(formData.yearBuilt),
      buyer: formData.buyer || '0x0000000000000000000000000000000000000000',
    });
    if (success) {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>List New Property</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {txStatus.isError && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              Transaction failed
            </Alert>
          )}
          <FormControl>
            <FormLabel>Property Name</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Location</FormLabel>
            <Input name="location" value={formData.location} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Price (ETH)</FormLabel>
            <Input name="price" value={formData.price} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Escrow Amount (ETH)</FormLabel>
            <Input name="escrowAmount" value={formData.escrowAmount} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Square Footage</FormLabel>
            <Input name="squareFootage" value={formData.squareFootage} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Bedrooms</FormLabel>
            <Input name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Bathrooms</FormLabel>
            <Input name="bathrooms" value={formData.bathrooms} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Year Built</FormLabel>
            <Input name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Buyer Address (Optional)</FormLabel>
            <Input name="buyer" value={formData.buyer} onChange={handleChange} placeholder="0x..." />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleListProperty}>
            List Property
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 