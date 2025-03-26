import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react'
import { Avatar, Box, Button, Divider, Flex, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteIcon } from '@chakra-ui/icons';


const ReplysInComment = ({id,reply,post}) => {
    // const [liked, setLiked] = useState();
    const { pid } = useParams();
      const [isOpen, setIsOpen] = useState(false);
      const [currentUsername, setCurrentUsername] = useState('');
      const user = JSON.parse(localStorage.getItem('user-threads'));
      const showToast = useShowToast();
      const [isReplying, setIsReplying] = useState(false);
      //  const [isLiking, setIsLiking] = useState(false);
      const navigate = useNavigate();
      const openDialog = (username , userID) => {
        setValue((prevValue) => ({...prevValue ,commenterToReplyId: userID }));
        setValue((prevValue) => ({...prevValue ,postToReplyId: id }));
        setCurrentUsername(username);
        setIsOpen(true);
    };
      const closeDialog = () => setIsOpen(false);
        const [value , setValue] = useState({
          commentertext : "",
          commenterToReplyId :"",
          postToReplyId :"",
        });


    
    function findByPostToReplyId(commentsArray, inputPostToReplyId) {
    const matchingComments = [];
    // Iterate through the outer array
    commentsArray.forEach(innerArray => {
        // Filter objects with the given postToReplyId
        innerArray.forEach(comment => {
            if (comment.postToReplyId === inputPostToReplyId) {
                matchingComments.push(comment);
            }
        });
    });

    return matchingComments;
}
const replynon1 = findByPostToReplyId(reply, id);
const [replynon , steReplynon] = useState(replynon1);

if(!replynon) return null;


// const handleLikeAndUnlike = async (replyId) => {
//   if (!user) return showToast("Error", "You must be logged in to like a post", "error");
//   if (isLiking) return;
//   setIsLiking(true);
//   try {
//     const res = await fetch("/api/posts/likereply/" + pid, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({replyId}),
//     });
//     const data = await res.json();
//     // if (data.error) return showToast("Error", data.error, "error");
//     // if (!liked) { 
//     //   if(reply._id === replyId){
//     //     setIds({...reply , likes:[...reply.likes ,user._id]}); 
//     //   }
//     // } else {
//     // setIds({...reply , likes:reply.likes.filter((id)=> id !== user._id)});
//     // }
//     // setLiked(!liked);


    
// 		if (!liked) {
// 			// add the id of the current user to post.likes array
// 			const updatedPosts = replynon.map((p) => {
// 				if (p._id === replyId) {
// 					return { ...p, commenterlikes: [...p.commenterlikes, user._id] };
// 				}
// 				return p;
// 			});
// 			steReplynon(updatedPosts);
// 		} else {
// 			// remove the id of the current user from post.likes array
// 			const updatedPosts = replynon.map((p) => {
// 				if (p._id === post._id) {
// 					return { ...p, commenterlikes: p.commenterlikes.filter((id) => id !== user._id) };
// 				}
// 				return p;
// 			});
// 			steReplynon(updatedPosts);
// 		}

// 		setLiked(!liked);
//   } catch (error) {
//     showToast("Error", error.message, "error");
//   } finally {
//     setIsLiking(false);
//   }
// };





const handleReplys = async () => {
  console.log(value);
  
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
    
        // const updatedPosts = post.map((p) => {
        //   if (p._id === pid ) {
        //     return { ...p, commentsOnReply: [...p.commentsOnReply, data] };   
        //   }
        //   return p;
        // });
        
        steReplynon([...replynon , data]);
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

    const res = await fetch(`/api/posts/replyiesdelete/${pid}`, {
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
   <Flex key ={id}direction={"column"} gap={1} mt={1}>
    {replynon.map((i)=>
   <Flex  key={i._id}gap={4} my={2} py={2} marginLeft={20} w={'full'}>
            <Avatar src={i.commenteruserProfilePic} size={'sm'} name={i.commenterusername} />
            <Flex gap={1} w={'full'} flexDirection={'column'}>
              <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize={'sm'} fontWeight={'bold'}>{i.commenterusername}</Text>
                <Flex alignItems={'center'}>
                  <Text fontSize={'sm'} color={'gray.light'}>
                    {i.commenterCommentsOn ? formatDistanceToNow(new Date(i.commenterCommentsOn)) + ' ago' : 'now'}
                  </Text>
                  {i?.commenteruserId === user?._id && (
                                <DeleteIcon
                                size={20}
                                cursor={"pointer"}
                                onClick={()=>handleDeletePost(i._id)}
                                /> )}
                </Flex>
              </Flex>
              <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                <Text fontWeight={'lighter'}>{i.commentertext}</Text>
                {/* <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
                  <svg
                    aria-label='Like'
                    color={liked ? "rgb(237, 73, 86)" : ""}
                    fill={liked ? "rgb(237, 73, 86)" : "transparent"}
                    height='19'
                    role='img'
                    viewBox='0 0 24 22'
                    width='15'
                    cursor={'pointer'}
                    onClick={()=>handleLikeAndUnlike(i._id)}
                  >
                    <path
                      d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
                      stroke='currentColor'
                      strokeWidth='2'
                    ></path>
                  </svg>
                  <Text color={'gray.light'} fontSize={'sm'}>{i.commenterlikes.length}</Text>
                </Flex> */}
              </Flex>
              <Flex>
                <Text fontSize={'sm'} color={'gray.light'} cursor={'pointer'} onClick={() => openDialog(i.commenterusername ,i.commenteruserId)} >Reply</Text>
              </Flex>
            </Flex>

            {isOpen && (
          <Modal isOpen={openDialog}
            onClose={closeDialog}>
            {/* <Modal> */}
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Replying to @{currentUsername}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <Input
                    placeholder='Reply goes here..'
                    onChange={(e) => setValue({ ...value, commentertext: e.target.value })}
										value={value.commentertext || `@${currentUsername}`}
                    style={{ color: value.commentertext ? 'inherit' : 'blue' }}

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

          </Flex> 
)}

</Flex>
          </>
  )
}

export default ReplysInComment
