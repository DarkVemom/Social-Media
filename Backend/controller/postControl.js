import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2 as cloudinary} from 'cloudinary'

const createPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}
          
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};


const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id; //post replies id
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const replyToReply = async (req,res)=>{
	try {
		const { commenterToReplyId , commentertext , postToReplyId } = req.body;  // Replies body
		const postId = req.params.id; // post id
		const commenteruserId = req.user._id; //Comment replies id
		const commenteruserProfilePic = req.user.profilePic;
		const commenterusername = req.user.username;
		// const commenterToReplyId = req.body.commenterToReplyId; // body
		// const postToReplyId = req.body.postToReplyId; // body

		if (!commentertext) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		// to check weather the comment is comment on the exesting comment or not
		const repl = post.replies.map((r) => r.userId.toString());
		
		if(!repl.includes(commenterToReplyId) ){
			return res.status(404).json({ error: "This Id is not in this post replyies" });
		}

		if(!commenterToReplyId){
			return res.status(404).json({error: "Whom to reply is required"});
		}
		if(!postToReplyId){
			return res.status(404).json({error: "Whom to reply id is required"});
		}
		
		
		const reply = { commenteruserId, commentertext, commenteruserProfilePic, commenterusername, commenterToReplyId, postToReplyId };
		post.commentsOnReply.push(reply);
		await post.save();

		
		
		res.status(200).json(reply);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const replyToLikeUnlike = async (req , res) => {
	try {
		const { id: postId } = req.params;
		const  { replyId } = req.body;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = post.replies.id(replyId);
		if (!reply) {
            return res.status(404).json({ error: "Reply not found" });
        }

		const userLikedReply = reply.likes.includes(userId);
		
		if (userLikedReply) {
			// Unlike post
			reply.likes.pull(userId);
            await post.save();
			res.status(200).json({ message: "Reply unliked successfully" });
		} else {
			// Like post
			reply.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Reply liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
// const repliesToLikeUnlike = async (req , res) => {
// 	try {
// 		const { id: postId } = req.params;
// 		const  { replyId } = req.body;
// 		const userId = req.user._id;

// 		const post = await Post.findById(postId);

// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

		
// 		const reply =  post.commentsOnReply.id(replyId);  // Find the specific reply by replyId
// 		if (!reply) {
//             return res.status(404).json({ error: "Reply not found" });
//         }

// 		const userLikedReply = reply.commenterlikes.includes(userId);
		
// 		if (userLikedReply) {
// 			// Unlike post
// 			reply.commenterlikes.pull(userId);
//             await post.save();
// 			res.status(200).json({ message: "Reply unliked successfully" });
// 		} else {
// 			// Like post
// 			reply.commenterlikes.push(userId);
// 			await post.save();
// 			res.status(200).json({ message: "Reply liked successfully" });
// 		}
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };
const deleteReply = async (req, res) => {
	try {
		const { replyDelId } = req.body;
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}


		// const replyIndex = post.commentsOnReply.findIndex((reply) => reply._id.toString() === replyDelId);
		
        // if (replyIndex === -1) {
        //     return res.status(404).json({ error: "Reply not found" });
        // }

        // // Check if the user is authorized to delete the reply
        // if (post.commentsOnReply[replyIndex].commenteruserId.toString() !== req.user._id.toString()) {
        //     return res.status(401).json({ error: "Unauthorized to delete this reply" });
        // }

        // // Remove the reply from the replies array
        // post.commentsOnReply.splice(replyIndex, 1);
        // await post.save();
		// res.status(200).json({ message: "Reply deleted successfully" });




		const replyIndex = post.replies.findIndex((reply) => reply._id.toString() === replyDelId);
		const replyIndex1 = post.commentsOnReply.findIndex((reply) => reply.postToReplyId.toString() === replyDelId);

		// console.log(replyIndex);
		// console.log(replyIndex1);
		
        if (replyIndex === -1 && replyIndex1 === -1) {
            return res.status(404).json({ error: "Reply not found" });
        }

        // Check if the user is authorized to delete the reply
        // if (post.replies[replyIndex].userId.toString() !== req.user._id.toString() || post.commentsOnReply[replyIndex].postToReplyId.toString() !== replyDelId) {
        //     return res.status(401).json({ error: "Unauthorized to delete this reply" });
        // }


        // Remove the reply from the replies array
        post.replies.splice(replyIndex, 1);
		post.commentsOnReply.splice(replyIndex1, 1);

        await post.save();
		res.status(200).json({ message: "Reply deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
const deleteReplies = async (req, res) => {
	try {
		const { replyDelId } = req.body;
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}


		const replyIndex = post.commentsOnReply.findIndex((reply) => reply._id.toString() === replyDelId);
		
        if (replyIndex === -1) {
            return res.status(404).json({ error: "Reply not found" });
        }

        // Check if the user is authorized to delete the reply
        if (post.commentsOnReply[replyIndex].commenteruserId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to delete this reply" });
        }

        // Remove the reply from the replies array
        post.commentsOnReply.splice(replyIndex, 1);
        await post.save();
		res.status(200).json({ message: "Reply deleted successfully" });





		
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};



export {createPost, getPost ,deletePost ,likeUnlikePost ,replyToPost ,getFeedPosts ,getUserPosts ,replyToReply ,replyToLikeUnlike,deleteReply ,deleteReplies };