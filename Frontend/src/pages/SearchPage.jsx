import { SearchIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import { Link } from 'react-router-dom'
import SuggestedUser from '../components/SuggestedUser';
const SearchPage = () => {
    // const [input, setInput] = useState("");
    const input = useRef();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const showToast = useShowToast();
    const [called , setCalled] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/search`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, [ showToast]);
    
    

    const handleSearch = () => {
        setCalled(true);
        const getInput = input.current.value;
        const filteredResults = user.filter(users => users.name.includes(getInput) || users.username.includes(getInput));
        setResults(filteredResults);
    };
    
    


    return (
       
        <>
            <Flex alignItems={"center"} gap={2}>
                <Input placeholder='Search for a user' variant='flushed' ref={input} />
                <Button size={"md"} onClick={handleSearch} >
                    <SearchIcon />
                </Button>
            </Flex>

            <Flex direction={"column"} gap={4} my={5}>
                {called == false ? !loading && user.map((user) => <SuggestedUser key={user._id} user={user} />) : results.map((user) => <SuggestedUser key={user._id} user={user} />) }

                {loading &&
                    [0, 1, 2, 3, 4].map((_, idx) => (
                        <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"lg"}>
                            {/* avatar skeleton */}
                            <Box>
                                <SkeletonCircle size={"10"} />
                            </Box>
                            {/* username and fullname skeleton */}
                            <Flex w={"full"} flexDirection={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"80px"} />
                                <Skeleton h={"8px"} w={"90px"} />
                            </Flex>
                            {/* follow button skeleton */}
                            <Flex>
                                <Skeleton h={"20px"} w={"60px"} />
                            </Flex>
                        </Flex>
                    ))}



            </Flex>
        </>
       

    )
}

export default SearchPage
