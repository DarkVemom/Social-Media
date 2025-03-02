import express from "express";
import { allUsers, blockUsers, followUnFollowUser, forgotPassword, freezeAccount, getSuggestedUsers, getUserProfile, loginUser, logoutUser, resetPassword, signupUser, twoAuthDeactivate, twoFactorAuth, twoFactorAuthUser, updateUser, verificationUser } from "../controller/userControl.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();



router.get("/profile/:query", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute ,followUnFollowUser);
router.put("/update/:id", protectRoute ,updateUser);
router.post("/password/forgot" ,forgotPassword);
router.put("/Velidate" ,verificationUser);
router.post("/TwoFactorAuthentaction" ,protectRoute,twoFactorAuth);
router.put("/TwoFactorAuthentaction/code/request" ,twoFactorAuthUser);
router.put("/password/reset/:token" ,resetPassword);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.put("/freeze", protectRoute, freezeAccount);
router.put("/deactivate2FA", protectRoute, twoAuthDeactivate);
router.get("/search", allUsers);
router.post("/blockuser/:id", protectRoute ,blockUsers);

export default router;
