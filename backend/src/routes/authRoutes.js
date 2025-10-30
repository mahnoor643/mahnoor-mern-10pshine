import express from "express";
import {
  registerUser,
  loginUser,
  getAllRegisteredUsers,
  validateSignup,
  validateLogin,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/signup", upload.single("profileImage"), validateSignup, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/getall", authenticateToken, getAllRegisteredUsers);

export default router;
