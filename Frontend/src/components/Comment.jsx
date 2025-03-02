import { Avatar, Box, Divider, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';

const Comment = ({ reply, lastReply }) => {
    // const [liked , setLiked] = useState(false);
    
  return (
    <>
    <Flex gap={4} my={2} py={2} w={'full'}>
        <Avatar src={reply.userProfilePic} size={'sm'} name={reply.username}/>
        <Flex gap={1} w={'full'} flexDirection={'column'}>
        <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize={'sm'} fontWeight={'bold'}>{reply.username}</Text>
                <Flex gap={2} alignItems={'center'}>
                    {/* <Text fontSize={'sm'} color={'gray.light'}>created At</Text> */}
                    {/* <BsThreeDots/> */}
                </Flex>
        </Flex>

        <Text fontWeight={'lighter'}>{reply.text}</Text> 
        {/* <Actions post = {post}/>  */}
        {/* <Flex gap={2} alignItems={"Center"}>
        <Text color={'gray.light'} fontSize={'sm'}> replies</Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={'gray.light'} fontSize={'sm'}>
          likes
        </Text>
      </Flex>
        <Text color={'gray.light'} fontSize={'sm'}>
                  10 likes
                </Text>      */}
        </Flex>
    </Flex>
           {!lastReply ? <Divider/>:null}
     
    </>
  )
}

export default Comment
