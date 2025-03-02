import React, { useContext, useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
// import UserPost from '../components/UserPost'
import useShowToast from '../hooks/useShowToast';
import { useParams } from 'react-router-dom';
import { AbsoluteCenter, Box, Flex, Spinner, Text } from '@chakra-ui/react';
import useGetUserProfile from "../hooks/useGetUserProfile";
import Post from "../components/Post";
import axiox from 'axios'
import { Context } from '../App';
// import { useCont } from '../context/Postcontext';
const UserPage = () => {

//   const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const currentUser = JSON.parse(localStorage.getItem('user-threads'))
	const showToast = useShowToast();
	const [posts, setPosts] = useContext(Context);
	// const [posts, setPosts] = useCont();
	const [fetchingPosts, setFetchingPosts] = useState(true);
	// const API = '/api/posts/user/${username}';

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

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

		const getPost = async ()=>{
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				// console.log(data);
				
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			}finally {
			setFetchingPosts(false);
			}

		}



		getUser();
		getPost();
	}, [username, showToast,setPosts]);

	// console.log("Context ",posts);
	
//   useEffect(() => {
// 		const getPosts = async () => {
// 			if (!user) return;
// 			setFetchingPosts(true);
// 			try {
// 				// const res = await fetch(`/api/posts/user/${username}`);
// 				const res = await axiox.get(API);
// 				// const data = await res.json();
// 				console.log(res.data);
// 				setPosts(res.data);
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 				setPosts([]);
// 			} finally {
// 				setFetchingPosts(false);
// 			}
// 		};

// 		getPosts();
// 	}, [username, showToast, setPosts, user]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) return <h1>User not found</h1>;

	Object.values(user.blockedUser).map((u)=>{
		if(u === currentUser._id) {
			console.log("hide");
			setUser(null);
		}
		
	})



  return (
   <>
   {/* <UserHeader/>
   <UserPost postImg={"./Post4.jpg"} likes={"22k"} replies={"100"}/>
   <UserPost postTitle ={"Hi this is the trail project for threads ....."} likes={"22M"} /> */}


<UserHeader user={user} />

{!fetchingPosts && posts.length === 0 &&  <Box position="relative" h="300px">
      <AbsoluteCenter axis="both">
        No Posts Found
      </AbsoluteCenter>
    </Box>}
{fetchingPosts && (
  <Flex justifyContent={"center"} my={12}>
    <Spinner size={"xl"} />
  </Flex>
)}

{posts.map((post) => (
  <Post key={post._id} post={post} postedBy={post.postedBy} /*setPost={setPosts}*/ />
))}
   </>
  )
}

export default UserPage
