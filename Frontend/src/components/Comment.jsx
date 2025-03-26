// import { Avatar, Box, Divider, Flex, Text } from '@chakra-ui/react';
// import React, { useState } from 'react'
// import { BsThreeDots } from 'react-icons/bs';
// import Actions from './Actions';

// const Comment = ({ reply, lastReply }) => {
//     // const [liked , setLiked] = useState(false);
    
//   return (
//     <>
//     <Flex gap={4} my={2} py={2} w={'full'}>
//         <Avatar src={reply.userProfilePic} size={'sm'} name={reply.username}/>
//         <Flex gap={1} w={'full'} flexDirection={'column'}>
//         <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
//                 <Text fontSize={'sm'} fontWeight={'bold'}>{reply.username}</Text>
//                 <Flex gap={2} alignItems={'center'}>
//                     {/* <Text fontSize={'sm'} color={'gray.light'}>created At</Text> */}
//                     {/* <BsThreeDots/> */}
//                 </Flex>
//         </Flex>

//         <Text fontWeight={'lighter'}>{reply.text}</Text> 
//         {/* <Actions post = {post}/>  */}
//         {/* <Flex gap={2} alignItems={"Center"}>
//         <Text color={'gray.light'} fontSize={'sm'}> replies</Text>
//         <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
//         <Text color={'gray.light'} fontSize={'sm'}>
//           likes
//         </Text>
//       </Flex>
//         <Text color={'gray.light'} fontSize={'sm'}>
//                   10 likes
//                 </Text>      */}
//         </Flex>
//     </Flex>
//            {!lastReply ? <Divider/>:null}
     
//     </>
//   )
// }

// export default Comment


import { Avatar, Box, Button, Divider, Flex, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react'
// import { BsThreeDots } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import useShowToast from '../hooks/useShowToast';
import ReplysInComment from './ReplysInComment';
import { DeleteIcon } from '@chakra-ui/icons';

const Comment = ({ reply, lastReply }) => {
  const user = JSON.parse(localStorage.getItem('user-threads'));
  
  const { pid } = useParams();
  const [posts, setPosts] = useState([]);
  // used For parent reply to reply of the post 
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  // used for prent reply to reply of the reply
  const [isOpen1, setIsOpen1] = useState(false);
  const openDialog1 = () => setIsOpen1(true);
  const closeDialog1 = () => setIsOpen1(false);
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(false);
  const [value , setValue] = useState({
    commentertext : "",
    commenterToReplyId :"",
    postToReplyId :"",
  });
  
  const [isReplying, setIsReplying] = useState(false);
  const showToast = useShowToast();
  const [isLiking, setIsLiking] = useState(false);
  const [ids,setIds] = useState(reply);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          return;
        }
        setPosts([data]);
      } catch (error) {
        console.log(error);

      }
    };
    getPost();
  }, [setPosts, pid]);

  // const commentreplylen = posts.map(post => post.commentsOnReply.map((reply)=> reply.postToReplyId).filter((id)=> id === reply._id).length);
  const commentreplylen = posts
  .flatMap((post) => post.commentsOnReply) // Flatten all commentsOnReply arrays
  .filter((replyItem) => replyItem.postToReplyId === reply._id).length; // Filter replies for the current reply
  const trial  = posts.map(post => post.commentsOnReply.map((reply) => reply));
  
  
  
  const handleShow = () => {
    setHide(true);
    openDialog1();
    setShow(true);
  }
  const handleShow1 = () => {
    setHide(false);
    closeDialog1();
    setShow(false);
  }

  useEffect(() => {
    setValue((prevValue) => ({...prevValue ,commenterToReplyId: reply.userId }));
    setValue((prevValue) => ({...prevValue ,postToReplyId: reply._id }));
    

  }, [reply.userId , reply._id]);

  const [liked, setLiked] = useState(Array.isArray(reply.likes) && reply.likes.includes(user?._id));
  const handleLikeAndUnlike = async (replyId) => {
    if (!user) return showToast("Error", "You must be logged in to like a post", "error");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/posts/likereply/" + pid, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({replyId}),
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");
      if (!liked) { 
        if(reply._id === replyId){
          setIds({...reply , likes:[...reply.likes ,user._id] || [] }); 
        }
      } else {
      setIds({...reply , likes:reply.likes.filter((id)=> id !== user._id) || [] });
      }
      setLiked(!liked);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false);
    }
  }; 

  

  const handleReplys = async () => {
    // console.log(value);
       if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
       if (isReplying) return;
       setIsReplying(true);
       try {
        const res = await fetch("/api/posts/replytoCommenter/" + pid, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");

        
        const updatedPosts = posts.map((p) => {
          if (p._id === pid ) {
            return { ...p, commentsOnReply: [...p.commentsOnReply, data] };   
          }
          return p;
        });
        
        setPosts(updatedPosts);
        showToast("Success", "Reply posted successfully", "success");
        closeDialog();
        setValue("");
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsReplying(false);
      }
      
  };



  const handleDeletePost = async (replyDelId) => {
    try {
      // if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/replydelete/${pid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({replyDelId}),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Reply deleted successfully", "success");
      navigate(0); // Refresh the screen by reloading the current route


      
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };



  
  


  
  
  

  return (
    <>
      <Flex gap={4} my={2} py={2} w={'full'}>
        <Avatar src={reply.userProfilePic} size={'sm'} name={reply.username} />
        <Flex gap={1} w={'full'} flexDirection={'column'}>
          <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
            <Text fontSize={'sm'} fontWeight={'bold'}>{reply.username}</Text>
            <Flex gap={2} alignItems={'center'}>
              {/* <Text fontSize={'sm'} color={'gray.light'}>{formatDistanceToNow(new Date(reply.commentsOn))} ago</Text> */}
              <Text fontSize={'sm'} color={'gray.light'}>
              {reply.commentsOn ? formatDistanceToNow(new Date(reply.commentsOn)) + ' ago' : 'now'}
              </Text>
              {reply?.userId === user?._id && (
              <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={()=>handleDeletePost(reply._id)}
              /> )}

            </Flex>
          </Flex>

          <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
            <Text fontWeight={'lighter'}>{reply.text}</Text>
            <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
          
              <svg
                aria-label='Like'
                color={liked ? "rgb(237, 73, 86)" : ""}
                fill={liked ? "rgb(237, 73, 86)" : "transparent"}
                height='19'
                role='img'
                viewBox='0 0 24 22'
                width='15'
                onClick={()=>handleLikeAndUnlike(reply._id)}
                cursor={'pointer'}
              >
                <path
                  d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
                  stroke='currentColor'
                  strokeWidth='2'
                ></path>
              </svg>
              {/* <Text color={'gray.light'} fontSize={'sm'} m>{reply.likes.length}</Text> */}
              <Text color={'gray.light'} fontSize={'sm'} m>{Array.isArray(ids.likes) ? ids.likes.length : 0}</Text>
            </Flex>
          </Flex>
         

          <Flex>
            <Text fontSize={'sm'} color={'gray.light'} cursor={'pointer'} onClick={openDialog}>Reply</Text>
          </Flex>

<Flex gap={2} alignItems={"center"}>
  {commentreplylen !== 0 && !hide ? (
    <>
      <Box w="30px" h="1px" bg="gray.light" my={2}></Box>
      <Text
        color={"gray.light"}
        fontSize={"sm"}
        cursor={"pointer"}
        onClick={handleShow}
      >
        View {commentreplylen} more replies
      </Text>
    </>
  ) : null}
  {isOpen1 && <ReplysInComment id={reply._id} reply={trial} post={posts} />}
</Flex>
        </Flex>
      </Flex>
      {show ? <Flex gap={2} my={2} marginLeft={20}>
        <Box w='30px' h={"1px"} bg='gray.light' my={2} ></Box>
        <Text color={'gray.light'} fontSize={'sm'} cursor={'pointer'} onClick={handleShow1}> hide replies</Text>
      </Flex>
        : null}

{isOpen && (
          <Modal isOpen={openDialog}
            onClose={closeDialog}>
            {/* <Modal> */}
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Replying to @{reply.username} </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <Input
                    placeholder='Reply goes here..'
                    onChange={(e) => setValue({ ...value, commentertext: e.target.value })}
										value={value.commentertext}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' size={"sm"} mr={3} isLoading ={isReplying} onClick={handleReplys}>
                  Reply
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>)}

      {!lastReply ? <Divider /> : null}

    </>
  )
}

export default Comment
{/* <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
   */}
{/* <Text color={'gray.light'} fontSize={'sm'}>
          likes
        </Text> */}





// // Output: Apple occurs 3 times.

