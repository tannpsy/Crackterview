import express from "express";
import { loginUser, registerUser, googleOAuthLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleOAuthLogin);

export default router;