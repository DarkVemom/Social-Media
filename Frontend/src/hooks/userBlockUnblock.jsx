import React, { useState } from 'react'
import useShowToast from './useShowToast';

const userBlockUnblock = (user) => {
    // const currentUser = useRecoilValue(userAtom);
    const currentUser = JSON.parse(localStorage.getItem('user-threads'));
	const [blocking, setBlocking] = useState(user.blockedByUser.includes(currentUser?._id));
	const [updating, setUpdating] = useState(false);
	const showToast = useShowToast();

    const handleBlockUnblock = async () => {
		if (!currentUser) {
			showToast("Error", "Please login to Block", "error");
			return;
		}
		if (updating) return;

		setUpdating(true);
		try {
			const res = await fetch(`/api/users/blockuser/${user._id}`, {
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

			if (blocking) {
				showToast("Success", `Unblocked ${user.name}`, "success");
				user.blockedByUser.pop(); // simulate removing from followers
			} else {
				showToast("Success", `Blocked ${user.name}`, "success");
				user.blockedByUser.push(currentUser?._id); // simulate adding to followers
			}
			setBlocking(!blocking);

			// console.log(data);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setUpdating(false);
		}
	};

  return { handleBlockUnblock, blocking, updating };
}

export default userBlockUnblock
