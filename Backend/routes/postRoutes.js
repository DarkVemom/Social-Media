import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createPost, deletePost, deleteReplies, deleteReply, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToLikeUnlike, replyToPost, replyToReply } from "../controller/postControl.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.delete("/replydelete/:id", protectRoute, deleteReply);
router.delete("/replyiesdelete/:id", protectRoute, deleteReplies);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/likereply/:id", protectRoute, replyToLikeUnlike);
// router.put("/likereplies/:id", protectRoute, repliesToLikeUnlike); //Not using
router.put("/reply/:id", protectRoute, replyToPost);
router.put("/replytoCommenter/:id", protectRoute, replyToReply);
export default router;