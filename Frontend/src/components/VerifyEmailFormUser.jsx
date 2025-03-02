'use client'

import { Center, Heading } from '@chakra-ui/react'
import {
  Button,
  FormControl,
  Flex,
  Input,
  Stack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
import { PinInput, PinInputField } from '@chakra-ui/react'
import { useRef, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailFormUser() {
    const inputRef1 = useRef();
    const inputRef2 = useRef();
    const inputRef3 = useRef();
    const inputRef4 = useRef();
    const user = JSON.parse(localStorage.getItem('Authentaction-FA'));
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

     setTimeout(() => {
       localStorage.removeItem("Authentaction-FA");
       console.log('localStorage item cleared');
     }, 90000);
    
    const handlePinChange = async () => {
        const code1 = inputRef1.current.value + inputRef2.current.value + inputRef3.current.value + inputRef4.current.value;
        const username1= user.username;
        const requestData = {
          code: code1,
          username: username1
        };
        const inputs ={
            username: user.username,
            password: user.password,
        }
        console.log(requestData); // Proceed with form submission or further processing   

          setLoading(true);
          try {
            const res = await fetch(`/api/users/Velidate`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            });
            const data = await res.json();
            if (data.error) {
              showToast("Error", data.error, "error");
              return;
            }
            showToast("Success", "Sucess ", "success");
            try {
                const res = await fetch("/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputs),
                });
                const data = await res.json();
                localStorage.setItem("user-threads", JSON.stringify(data));
                localStorage.removeItem("Authentaction-FA");
            }catch (e){
                showToast("Error", e, "error"); 
            }

            navigate('/');
          } catch (error) {
            showToast("Error", error, "error");
          }finally{
            setLoading(false);
            // setTimeout(window.location.href = '/',8000);
          }
        
    };
  return (
    <Flex
      minH={'70vh'}
      align={'center'}
      justify={'center'}
      >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'sm'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={10}>
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Verify your Email
          </Heading>
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}>
          We have sent code to your email
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          fontWeight="bold"
          color={useColorModeValue('gray.800', 'gray.400')}>
          {user.username || null}
        </Center>
        <FormControl>
          <Center>
            <HStack>
              <PinInput>
                <PinInputField ref={inputRef1} />
                <PinInputField ref={inputRef2} />
                <PinInputField ref={inputRef3} />
                <PinInputField ref={inputRef4} />
              </PinInput>
            </HStack>
          </Center>
        </FormControl>
        <Stack spacing={6}>
        <Button
            loadingText="Verifying"
            size={'lg'}
            bg={useColorModeValue("gray.600", "gray.700")}
            color={'white'}
            _hover={{
              bg: useColorModeValue("gray.700", "gray.800"),
            }} onClick={handlePinChange}
            isLoading={loading}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}