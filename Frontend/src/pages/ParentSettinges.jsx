import React, { useState } from 'react'
import { Flex, Link, Button, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ExternalLinkIcon } from '@chakra-ui/icons'
import useShowToast from '../hooks/useShowToast';

const ParentSettinges = () => {
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user-threads'))
  const showToast = useShowToast();
  const navigate = useNavigate();
  const handleSubmit = async () => {

    // Proceed with form submission or further processing
    setLoading(true);
    try {
      const res = await fetch("/api/users/TwoFactorAuthentaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Reset email is sent successfully", "success");
      navigate('/settings/TwoFactorAuthentaction');


    } catch (error) {
      showToast("Error", error, "error");
    }
    finally {
      setLoading(false);

    }
    // Show an error message to the user  
  };
  const handleSubmit1 = async () => {

    if (!window.confirm("Are you sure you want to deactivate 2FA?")) return;
    try {
      const res = await fetch("/api/users/deactivate2FA", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      if (data.success) {
        showToast("Success", "Two factor authentaction is removed ", "success");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }

  };
  return (
    <Flex direction="column" justify="center" align="flex-start" gap={4}>
      <Link as={RouterLink} to={'/settings/frozeAccount'}>
        Go For Freeze Account Page <ExternalLinkIcon mx='2px' />
      </Link>


      {user.isFA ?
        <Button
          size={'lg'}
          bg={useColorModeValue("gray.600", "gray.700")}
          color={'white'}
          _hover={{
            bg: useColorModeValue("gray.700", "gray.800"),
          }}
          onClick={() => handleSubmit1()}

        >
          Request Code to disable 2FA
        </Button>:
        <Button
        loadingText='Sending Verification Email'
        size={'lg'}
        bg={useColorModeValue("gray.600", "gray.700")}
        color={'white'}
        w={'100'}
        _hover={{
          bg: useColorModeValue("gray.700", "gray.800"),
        }} onClick={() => handleSubmit()
        }
        isLoading={loading}>
        Request Code to enable 2FA
      </Button> 
}

    </Flex>
  )
}

export default ParentSettinges
