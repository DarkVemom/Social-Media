import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getMessages, sendMessage, getConversations } from "../controller/messageControl.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);

export default router;