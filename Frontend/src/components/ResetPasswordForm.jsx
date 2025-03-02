'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

export default function ResetPasswordForm() {
  const passwordRef = useRef();
  const passwordRef2 = useRef();
  const { token } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    password:"",
    confirmPassword:"",
  });

  const handlePinChange = async (e) => {
    if (passwordRef.current.value === passwordRef2.current.value) {
      // console.log(passwordRef.current.value); // Proceed with form submission or further processing
      const pass = passwordRef.current.value;
      if (pass.length < 6) {
        showToast("Error", "Password must be at least 6 characters long", "error");
        return;
      }
      const hasUppercase = /[A-Z]/.test(pass);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

      if (!hasUppercase || !hasSpecialChar) {
        showToast("Error", "Password must contain at least one uppercase letter and one special character", "error");
        return;
      }

      // console.log(inputs);
      // e.preventDefault();
      setLoading(true);
      try {
        const res = await fetch(`/api/users/password/reset/${token}`, {
          method: "PUT",
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
        showToast("Success", "Password reset successfully", "success");
        setTimeout(window.location.href = '/auth',5000);
        
      } catch (error) {
        showToast("Error", error, "error");
      }finally{
        setLoading(false);
      }
    } else {

      showToast("error", "Password didn't match", "error");
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
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Enter new password
        </Heading>
        <FormControl id="password" isRequired>
          <FormLabel>Enter Password</FormLabel>
          <Input
            _placeholder={{ color: 'gray.500' }}
            type="password"
            ref={passwordRef}
            onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
          />
        </FormControl>
        <FormControl id="password1" isRequired>
          <FormLabel>Re-Type Password</FormLabel>
          <Input type="password"
            ref={passwordRef2}
            onChange={(e) => setInputs((inputs) => ({ ...inputs, confirmPassword: e.target.value }))}
          />
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