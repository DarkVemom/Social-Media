import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";


const SocketContext = createContext();


export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [typing, setTyping] = useState(false);
	const user = JSON.parse(localStorage.getItem('user-threads'))

	useEffect(() => {
		const socket = io("https://social-media-1-b6ia.onrender.com", {
			query: {
				userId: user?._id,
			},
		});

		setSocket(socket);

		socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});

		// socket.on("Typing",()=>{
		// 	setTyping(true);
		// });
		// socket.on("Stop-Typing",()=>{
		// 	setTyping(false);
		// });
		
		
		return () => socket && socket.close();
	}, [user?._id]);
	console.log("The Online Users "+onlineUsers);
	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

