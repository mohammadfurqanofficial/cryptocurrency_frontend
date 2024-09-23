import React,{useState} from 'react';
import toast from 'react-hot-toast';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Input, VStack,
  Button,Box,
  Text } from '@chakra-ui/react';

interface AlertPopupProps {
  isOpen: boolean;
  onClose: () => void;
  element:any;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ isOpen, onClose ,element}) => {
  const [formData, setFormData] = useState({
    price: element.alert_data?element.alert_data.price:'',
    valume_24h: element.alert_data?element.alert_data.valume_24h:'',
    coinsId:element.id_coin
  });
  
  
  const [errors, setErrors] = useState({
    price: '',
    valume_24h: '',
    
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const validateForm = () => {
    let isValid = true;
    let errors = {
      price: '',
      valume_24h: '',
    };
    
    if (!formData.price) {
      errors.price = 'Price is required';
      isValid = false;
    }
   
    setErrors(errors);
    return isValid;
  };
  
  const handleSubmit =async () => {
    if (validateForm()) {
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/alertform`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        toast.success('Alert submitted successfully!'); 
        console.log('Alert submitted successfully:', result);
      
        onClose(); 
      } catch (error) {
        toast.error('Error submitting Alert');
        console.error('Error submitting form:', error);
      }
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Alert for {element.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
          <Box>
              <Input
                name="price"
                placeholder="Enter Price"
                value={formData.price}
                onChange={handleChange}
                isInvalid={!!errors.price}
              />
              {errors.price && <Text color="red.500">{errors.price}</Text>}
            </Box>
            <Box>
              <Input
                name="valume_24h"
                placeholder="Enter valume_24h"
                value={formData.valume_24h}
                onChange={handleChange}
                
              />
              {errors.valume_24h && <Text color="red.500">{errors.valume_24h}</Text>}
            </Box>
            <Button  bgColor="#90cdf4" 
              color="black"    
              _hover={{ bgColor: "#90cdf4" }}  
              _active={{ bgColor: "#90cdf4" }} onClick={handleSubmit}>
              Submit
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AlertPopup;
