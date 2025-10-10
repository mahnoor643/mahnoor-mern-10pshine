import express from "express";
import {
  registerUser,
  loginUser,
  getAllRegisteredUsers,
  validateSignup,
  validateLogin,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/getall", authenticateToken, getAllRegisteredUsers);

export default router;
