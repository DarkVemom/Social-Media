import {
    Button,
    FormControl,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    Link,
  } from '@chakra-ui/react'
import { useRef, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
  
  const ForgotPasswordFormInputs = {
    email: String
  }

;
  
  
  export default function ForgotPasswordForm() {

    const inputRef = useRef();
    const [inputs, setInputs] = useState({
      email:"",
    });
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };
  
    const handleSubmit = async () => {
      const email = inputRef.current.value;
      if (validateEmail(email)) {
        // Proceed with form submission or further processing
        setLoading(true);
          try {
            const res = await fetch("/api/users/password/forgot", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(inputs),
            });
            const data = await res.json();
            if (data.error) {
              showToast("Error", data.error, "error");
              return;
            }
            showToast("Success", "Reset email is sent successfully", "success");
           setTimeout( window.location.href = '/auth',5000);
            
          } catch (error) {
            showToast("Error", error, "error");
            
          }
          finally{
            setLoading(false);
          }


      } else {
       
        showToast("Error","Please enter a valid email address. ", "error");
        
        
        // Show an error message to the user
      }
    };

    
    return (
      <Flex
        minH={'70vh'}
        align={'center'}
        justify={'center'}
        // bg={useColorModeValue('gray.50', 'gray.800')}
        >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Forgot your password?
          </Heading>
          <Text
            fontSize={{ base: 'sm', sm: 'md' }}
            color={useColorModeValue('gray.800', 'gray.400')}>
            You&apos;ll get an email with a reset code
          </Text>
          <FormControl id="email">
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
              ref={inputRef}
              onChange={(e) => setInputs((inputs) => ({ ...inputs, email: e.target.value }))}
            />
          </FormControl>
          <Stack spacing={6}>

           
           
           <Link  >
            <Button
            loadingText='Sending Reset Email'
            size={'lg'}
            bg={useColorModeValue("gray.600", "gray.700")}
            color={'white'}
              w={'full'}
              _hover={{
                bg: useColorModeValue("gray.700", "gray.800"),
              }} onClick={() => handleSubmit()
              }
              isLoading={loading}>
              Request Reset
            </Button>
            </Link>
            
          </Stack>
        </Stack>
      </Flex>
    )
  }



 
