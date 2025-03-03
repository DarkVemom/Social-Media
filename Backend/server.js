import express from 'express';
import path from "path";
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js'
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import {v2 as cloudinary} from 'cloudinary';
import {io, server, app} from './socket/socket.js'


dotenv.config();
connectDB();
// const app = express();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//middleware
app.use(express.json({limit:"50mb"})); // To parse JESIN data in the req.body
app.use(express.urlencoded({extended: true})); // to parse from data in the req.body if the body have an object it will parse without problem 
app.use(cookieParser());


//Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// http://localhost:7777 =>frontend convert in to one
//// http://localhost:5002 =>backend


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/Frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
	});
}

server.listen(PORT ,() => console.log(`Server Started ${PORT}`));

