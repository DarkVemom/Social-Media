import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import { atom, useSetRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import { Link as RouterLink ,useNavigate } from 'react-router-dom'
// import authScreenAtom from "../atoms/authAtom";
// import { Link } from "react-router-dom";
// import useShowToast from "../hooks/useShowToast";
// import userAtom from "../atoms/userAtom";

export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const showToast = useShowToast();
	const navigate = useNavigate();



	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			// console.log(data.isFA);
		
			
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			//if 2FA is on 
			if(data.isFA === true){
			    localStorage.setItem("Authentaction-FA", JSON.stringify(inputs));
				
				try {
					const res = await fetch("/api/users/TwoFactorAuthentaction/code/request", {
					  method: "PUT",
					  headers: {
						"Content-Type": "application/json",
					  },
					  body: JSON.stringify(inputs),
					});
					const dataaa = await res.json();
					if (dataaa.error) {
					  showToast("Error", dataaa.error, "error");
					  return;
					}
				   
					showToast("Success", "Reset email is sent successfully", "success");
					navigate('/auth/VerifyEmailForm/2FA');
					
		
				  }catch (e){
					showToast("Error", e, "error");
				  }
		
			
			}else{
				localStorage.setItem("user-threads", JSON.stringify(data));
				setTimeout(window.location.href ='/',5000)
			}
			
			
			// setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}

	};
	



	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Login
					</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.dark")}
					boxShadow={"lg"}
					p={8}
					w={{
						base: "full",
						sm: "400px",
					}}
				>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type='text'
								value={inputs.username}
								onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
							/>
						</FormControl>
						
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
					
						<Link href="/forgot password">Forgot Password</Link>
						<Stack spacing={10} pt={2}>
							{
							<Button
								loadingText='Logging in'
								size='lg'
								bg={useColorModeValue("gray.600", "gray.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("gray.700", "gray.800"),
								}}
								onClick={handleLogin}
								isLoading={loading}
							>
								Login
							</Button> }
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Don&apos;t have an account?{" "}
								
								<Link   as={RouterLink} color={"blue.400"} to="/auth/signup"  >
                                {/*  onClick={() => setAuthScreen("signup")}  */}
									Sign up
								</Link>
								
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}