import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { Context } from "../App";
import { CgMoreO } from "react-icons/cg";

// import { useCont } from '../context/Postcontext'

const PostPage = () => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const { pid } = useParams();
  // const [posts, setPosts] = useCont();
  const [posts, setPosts] = useContext(Context);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user-threads"));
  const currentPost = posts[0];
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => {setIsOpen(false);
    setSelectedValues([]);
  }
  const [selectedValues, setSelectedValues] = useState([]);
  const handleOnchangeValue = useCallback((event) => {
      const { value, checked } = event.target;
      setSelectedValues((prevValues) =>
        checked
          ? [...prevValues, value] // Add value if checked
          : prevValues.filter((item) => item !== value) // Remove value if unchecked
      );
    },
    [] // No dependencies, so the function stays stable
  );

const getValues = ()=>{
    if(selectedValues.length !=0){
      console.log(selectedValues);
      console.log("Go to Hell Then" , currentUser.name , "😂😂😂😂😂😂");
      
      showToast("Success", "Reported", "success");
      closeDialog();
    }
    else{
      showToast("Error","Please select a reson","error");
    }
  }

  
  


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        if (data.isFrozen) {
          setUser(null);
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
        // console.log(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    getUser();
    getPost();
  }, [pid, showToast, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  Object.values(user.blockedUser).map((u) => {
    if (u === currentUser._id) {
      console.log("hide");
      setUser(null);
    }
  });
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            {user.followers.length >= 10 ? (
              <Image src="/verified.png" w={4} h={4} ml={1} />
            ) : null}
            {/* <Image src='/verified.png' w='4' h={4} ml={4} /> */}
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={handleDeletePost}
            />
          )}
          {/* Changed */}
          {currentUser?._id != user._id && (
            <Menu>
              <MenuButton>
                <BsThreeDots size={20} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={openDialog}>
                    Report
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>
      {/* <Flex gap={2} alignItems={"Center"}>
        <Text color={'gray.light'} fontSize={'sm'}>{post.replies.length} replies</Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={'gray.light'} fontSize={'sm'}>
         {post.likes.length}  likes
        </Text>
      </Flex> */}

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get app to like ,replies and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
      {/* <Comment
        // comment = "This is the commnet one"
        // createdAt = "4"
        // likes = "20"
        // username = "MONODEEP"
        // avatar = 'https://bit.ly/dan-abramov'

        /> */}

      {/* 
        
        <Comment
        comment = "This is the commnet Two"
        createdAt = "4"
        likes = "10"
        username = "Dodds"
        avatar = 'https://bit.ly/kent-c-dodds'

        />
        <Comment
        comment = "This is the commnet Three"
        createdAt = "4"
        likes = "200"
        username = "Florence"
        avatar = 'https://bit.ly/ryan-florence'

        />
        <Comment
        comment = "This is the commnet Four"
        createdAt = "4"
        likes = "20"
        username = "MonoDeep"

        /> */}

      {isOpen && (
        <Modal
          closeOnOverlayClick={false}
          isOpen={openDialog}
          onClose={closeDialog}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton onClick={closeDialog}/>
            <ModalBody pb={6}>
              <Text fontWeight='bold' mb='1rem'>
              Why are you reporting this post ?
            </Text>
              <Stack spacing={5} direction="column">
                <Checkbox colorScheme="red" value={"I just don't like it"} onChange={handleOnchangeValue}>
                  I just don't like it
                </Checkbox>
                <Checkbox colorScheme="red" value={'False information'} onChange={handleOnchangeValue}>
                 False information
                </Checkbox>
                <Checkbox colorScheme="red" value={'Bullying and unwanted contact'} onChange={handleOnchangeValue}>
                 Bullying and unwanted contact
                </Checkbox>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={getValues}>
                Done
              </Button>
              <Button onClick={closeDialog}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default PostPage;
