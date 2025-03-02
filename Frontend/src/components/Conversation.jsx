import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { SelectedConversationContext } from '../App';
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";

const Conversation = ({ conversation ,isOnline }) => {
    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;
    const currentUser = JSON.parse(localStorage.getItem('user-threads'))
    const [selectedConversation, setSelectedConversation] = useContext(SelectedConversationContext);
    const colorMode = useColorMode();
    const [userData , setUserData] = useState("");
    const [isverified , setisverified] = useState(false)

    useEffect(() => {
            const getUser = async () => {
                try {
                    const res = await fetch(`/api/users/search`);
                    const data = await res.json();
                    if (data.error) {

                        return;
                    }
                    setUserData(data);
                } catch (error) {
                    console.log(error);
                    
                }
            };
            getUser();
        });
       
        
        
        


    

    // if (!user) return null;
    // console.log(conversation.participants.length);
    
  return (
    <Flex
    gap={4}
    alignItems={"center"}
    p={"1"}
    _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
    }}
    onClick={() =>
        setSelectedConversation({
            _id: conversation._id,
            userId: user._id,
            userProfilePic: user.profilePic,
            username: user.username,
            mock: conversation.mock,
        })
    }
    bg={
        selectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.400" : "gray.dark") : ""
    }
    borderRadius={"md"}
>
    <WrapItem>
        <Avatar
            size={{
                base: "xs",
                sm: "sm",
                md: "md",
            }}
            src={user.profilePic || 'https://bit.ly/broken-link'}
            
        >
            {isOnline ? <AvatarBadge boxSize='1em' bg='green.500' /> : ""}
            {/* <AvatarBadge boxSize='1em' bg='green.500' /> */}
        </Avatar>
    </WrapItem>

    <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight='700' display={"flex"} alignItems={"center"}>
            {user.username}  <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {currentUser._id === lastMessage.sender ? (
                <Box color={lastMessage.seen ? "blue.400" : ""}>
                    <BsCheck2All size={16} />
                </Box>
            ) : (
                ""
            )}
            {lastMessage.text.length > 18
                ? lastMessage.text.substring(0, 18) + "..."
                : lastMessage.text || <BsFillImageFill size={16} />}
               
        </Text>
    </Stack>
</Flex>
  )
}

export default Conversation
