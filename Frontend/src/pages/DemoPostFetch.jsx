import React, { useEffect, useState } from 'react'
import axiox from 'axios'
import { Box, Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useShowToast from '../hooks/useShowToast';
const DemoPostFetch = () => {
    const [posts, setPost] = useState([]);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();
    const API = '/api/posts/feed'
    const getPosts = async() =>{
         setLoading(true);
			setPost([]);
            try {
                const res = await axiox.get(API);
                console.log(res.data);
                setPost(res.data);
                
            } catch (error) {
                console.log(error);
            }finally {
				setLoading(false);
			}
    }


    useEffect(()=>{
        getPosts();
    },[setPost,showToast]);

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
				{/* <SuggestedUsers /> */}
			</Box>
		</Flex>
  )
}

export default DemoPostFetch

