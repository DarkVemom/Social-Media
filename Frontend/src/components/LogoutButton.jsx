import { Button } from '@chakra-ui/react'
import React from 'react'
import { FiLogOut } from "react-icons/fi";
import useShowToast from '../hooks/useShowToast';
const LogoutButton = () => {
  const showToast = useShowToast();
    const handleLogout = async () => {
		try {
			const res = await fetch("/api/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user-threads");
			// setUser(null);
         window.location.href = '/auth';
		} catch (error) {
			showToast("Error", error, "error");
		}
	};
  return (
    <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
            <FiLogOut size={20}/>
    </Button>
  )
}

export default LogoutButton
