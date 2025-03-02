import User from '../models/userModel.js'
import Post from '../models/postModel.js'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import mongoose from 'mongoose';
import {v2 as cloudinary} from 'cloudinary'
import { sendEmail } from '../utils/helpers/sendEmail.js';
import crypto from "crypto";


const getUserProfile = async (req, res) => {
	// We will fetch user profile either with username or userId
	// query is either username or userId
	const { query } = req.params;

	try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
};

const signupUser = async (req, res) => {
    try {

        //check user is already there or not 
		const { name, email, username, password } = req.body;
		const user = await User.findOne({ $or: [{ email }, { username }] });

		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}
        //hasing the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);		
		// Username Validation
		if (username.length <=4) {
		return res.status(422).json({ error: "Username is too short." });
	     }
		 if (username.length > 16) {
			return res.status(421).json({ error: "Username is too long." });
		}
		if (username.startsWith('.') || username.startsWith('_')) {
			return res.status(424).json({ error: "Username cannot start with a dot or underscore." });
		}
		const pattern = /^[a-zA-Z0-9._]+$/;
	if (!pattern.test(username)) {
		return res.status(423).json({ error: "Username contains invalid characters. Only letters, numbers, dots, and underscores are allowed." });
	}
	if (username.endsWith('.') || username.endsWith('_')) {
		return res.status(425).json({ error: "Username cannot end with a dot or underscore." });
	}
		
		

        //creating new user
		const newUser = new User({
			name,
			email,
			username,
			password: hashedPassword,

		});
		await newUser.save();

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);

			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
				// password: newUser.password,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}

};


const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid username or password" });

		if (user.isFrozen) {
			user.isFrozen = false;
			await user.save();
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			bio: user.bio,
			profilePic: user.profilePic,
			isFA: user.isFA,
			// password: user.password,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in loginUser: ", error.message);
	}
};

const logoutUser = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};


const followUnFollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);
		const hasTag = userToModify.blockedUser.includes(currentUser._id);
		const hasTag1 = userToModify.blockedByUser.includes(currentUser._id);
		//Checking user is blocked or not
		if (hasTag === true || hasTag1 === true) {
			return res.status(400).json({ error: "You can't follow this user" });
		  }
		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });
		
	

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			//Logic (Suppose two person was there A & B so A wants to unfollow 
			// B so Remove Id from A's Following list and remove Id from B's Follower list )
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully"});
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
};

const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;
	
	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		// const isPasswordCorrect = await bcrypt.compare(user.password, user?.password || "");
		

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}


		if (username.length <=4) {
			return res.status(422).json({ error: "Username is too short." });
			 }
			 if (username.length > 16) {
				return res.status(421).json({ error: "Username is too long." });
			}
			if (username.startsWith('.') || username.startsWith('_')) {
				return res.status(424).json({ error: "Username cannot start with a dot or underscore." });
			}
			const pattern = /^[a-zA-Z0-9._]+$/;
		if (!pattern.test(username)) {
			return res.status(423).json({ error: "Username contains invalid characters. Only letters, numbers, dots, and underscores are allowed." });
		}
		if (username.endsWith('.') || username.endsWith('_')) {
			return res.status(425).json({ error: "Username cannot end with a dot or underscore." });
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;
		// user.password = isPasswordCorrect || user.password;
		
		

		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields
		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

		//  password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const forgotPassword = async (req, res) => {

	let user = await User.findOne({email: req.body.email});
	
	try {
		
		if (!user) return res.status(400).json({ error: "User not found" });

		const resetToken  = await user.generateVerificationCode();
		

		await user.save({ validateBeforeSave: false });
		const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
         const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

		sendEmail({ email: user.email,
			subject: "MERN AUTHENTICATION APP RESET PASSWORD",
			message,
		  });
		  res.status(200).json({
			success: true,
			message: `Email sent to ${user.email} successfully. ${resetToken} `,

		  });

		


		
	} catch (error) {
	user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ error: error.message });

		
	}

};


const resetPassword = async (req, res) => {
	let { token } = req.params;
	let {password, confirmPassword} = req.body;
	const d = new Date();
  let resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpireAt: { $gt: Date.now() },
  });

	

  try {
	if (!user) {
		return res.status(400).json({ error: "Invalid token or token expired" });
	}
	if (password !== confirmPassword) {
		return res.status(400).json({ error: "Passwords do not match" });
	}
	
	if(password === confirmPassword){
	let salt = await bcrypt.genSalt(10);
	let hashedPassword = await bcrypt.hash(password, salt);
	user.password = hashedPassword;
	}

	const message = `Your id's ${user.username} password has been reseted successfully. On ${d}`;
	sendEmail({ email: user.email,
		subject: "MERN AUTHENTICATION APP RESET PASSWORD SUCCESSFULLY",
		message,
	  });


	
	// Clear the resetPasswordToken and resetPasswordExpireAt fields
	user.resetPasswordToken = undefined;
	user.resetPasswordExpireAt = undefined;
	user = await user.save();
	res.status(200).json(user);
	
  } catch (err) {
	res.status(500).json({ error: err.message });
		console.log("Error in password reset: ", err.message);
  }

  	
};

const getSuggestedUsers = async (req, res) => {
	try {
		// exclude the current user from suggested users array and exclude users that current user is already following
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const freezeAccount = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		user.isFrozen = true;
		await user.save();

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const twoFactorAuth = async (req, res) => {

	const user = await User.findById(req.user._id);
	
	try {
		
		
		if (!user) return res.status(400).json({ error: "User not found" });

		if(user.isFA != true){

		const resetToken  = await user.generateVerificationCodes();
		

		await user.save({ validateBeforeSave: false });
         const message = `Your Verification Code is:- \n\n ${resetToken} \n\n If you have not requested this email then please ignore it.`;

		sendEmail({ email: user.email,
			subject: "MERN REQUEST FOR ENABLE TWO FACTOR AUTHENTICATION ...",
			message,
		  });
		  res.status(200).json({
			success: true,
			message: `Email sent to ${user.email} successfully. ${resetToken} `,

		  });

		}
		else{
			return res.status(400).json({ error: "You already enabled this funcation" });
		}
		
	} catch (error) {
	user.isTwoFatoor = undefined;
	user.isFA = false;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ error: error.message });
		
	}

};

const verificationUser = async (req, res) => {
	const {code, username} = req.body;
	try{
	let currentUser = await User.findOne({username:username});
	if(!currentUser){		
	   return res.status(400).json({ error: "User not found" });
	}

	const match = currentUser.isTwoFatoor.split('').map(digit => (parseInt(digit) + 7) % 10).join('');
	if(code === match){
	currentUser.isTwoFatoor = undefined;
	currentUser.isFA = true;
	currentUser = await currentUser.save();
	res.status(200).json(currentUser);
	}else{
		return res.status(400).json({ error: "Incorrect Code" });
	}

	}
	catch (error){
		res.status(500).json({ error: error.message });
	}
};

const twoAuthDeactivate = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}
		if(user.isFA === false){
			return res.status(400).json({ error: "You are not enable your 2FA" });
		}

		user.isFA = false;
		await user.save();

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


const twoFactorAuthUser = async (req, res) => {
	const {username , password} = req.body;
	const user = await User.findOne({ username });
	
	
	
	try {
		
		
		if (!user) return res.status(400).json({ error: "User not found" });
	
		if(user.isFA === true){

		const resetToken  = await user.generateVerificationCodes();
		

		await user.save({ validateBeforeSave: false });
         const message = `Your Verification Code is:- \n\n ${resetToken} \n\n If you have not requested this email then please ignore it.`;

		sendEmail({ email: user.email,
			subject: "MERN VERIFICATION OF TWO FACTOR AUTHENTICATION ...",
			message,
		  });
		  res.status(200).json({
			success: true,
			message: `Email sent to ${user.email} successfully. ${resetToken} `,

		  });

		}
		else{
			return res.status(400).json({ error: "You already are not enabled this funcation" });
		}
		
	} catch (error) {
	user.isTwoFatoor = undefined;
	user.isFA = true;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ error: error.message });
		
	}

};

const allUsers = async (req,res)=>{

	try {
		const users = await User.find({}).select("-password");
		res.send(users)
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
	

}

const blockUsers = async (req,res)=>{

	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);
		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot block/unblock yourself" });
		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });
		const isBlocking = currentUser.blockedUser.includes(id);
		const isFollowing = currentUser.following.includes(id);
		if (isBlocking) {
			// unblock user
			//Logic (Suppose two person was there A & B so A wants to unblock 
			// B so Remove Id from A's blocked  list and remove Id from B's blockedby user list )
			await User.findByIdAndUpdate(id, { $pull: { blockedByUser: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { blockedUser: id } });
			res.status(200).json({ message: "User unblocked successfully" });
		}else {
			//if user follow each other then remove from following and follower list 

			if(isFollowing){
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			}
			// block user
			await User.findByIdAndUpdate(id, { $push: { blockedByUser: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { blockedUser: id } });
			res.status(200).json({ message: "User blocked successfully" });
		}
		
	} catch (error) {
		res.status(500).json({ error: err.message });
		console.log("Error in block and unblock: ", err.message);
	}

}
	


export {signupUser , loginUser , logoutUser ,followUnFollowUser,updateUser ,getUserProfile ,forgotPassword, resetPassword ,getSuggestedUsers , freezeAccount ,twoFactorAuth ,verificationUser ,twoAuthDeactivate , twoFactorAuthUser ,allUsers, blockUsers};