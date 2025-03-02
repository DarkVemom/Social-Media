import { Box, Flex, Spinner } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import Post from '../components/Post';
import axiox from 'axios'
import { Context } from '../App';
import SuggestedUsers from '../components/SuggestedUsers';
// import { useCont } from '../context/Postcontext';

const Homepage = () => {
	const [posts, setPosts] = useContext(Context);
	// const [posts, setPosts] = useCont();
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();
	const API = '/api/posts/feed'
	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				// const res = await fetch("/api/posts/feed");
				// const data = await res.json();
                const res = await axiox.get(API);
				if (res.data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				// console.log(res.data);
				setPosts(res.data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);
  return (
    <Flex gap='10' alignItems={"flex-start"}>
			<Box flex={70}>
				{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

				{loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
				)}

				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Box>
			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<SuggestedUsers />
			
			</Box>
		</Flex>
  )
}

export default Homepage;
