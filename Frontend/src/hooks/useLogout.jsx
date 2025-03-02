import React from 'react'
import useShowToast from './useShowToast';

const useLogout = () => {
    const user = JSON.parse(localStorage.getItem('user-threads'))
	const showToast = useShowToast();
    const logout = async () => {
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

	return logout;
}

export default useLogout
