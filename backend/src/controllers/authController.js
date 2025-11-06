import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import {
  findUserByEmail,
  createUser,
  getAllUsers,
  updateUser,
  findUserById,
} from "../models/userModel.js";

dotenv.config();

// VALIDATION RULES
export const validateSignup = [
  body("username")
    .isString()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

// SIGNUP
export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }
    console.log("📸 Uploaded file:", req.file); // <--- ADD THIS LINE
    console.log("📩 Body:", req.body);
    // get uploaded image filename (if any)
    const profileImage = req.file ? req.file.filename : null;

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(username, email, hashedPassword, profileImage);

    logger.info(`New user registered: ${email}`);
    return res.status(201).json({
      message: "User registered successfully",
      userId,
      profileImage: profileImage ? `/uploads/${profileImage}` : null,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    console.log("📩 Login Request Body:", req.body);
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userID: user.userID, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(`User logged in: ${email}`);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

// ADMIN — GET ALL USERS
export const getAllRegisteredUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isAdmin)
      return res.status(403).json({ message: "Not authorized to perform this action" });

    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userID; // ✅ from JWT payload
    const { username, email, password } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // find current user
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // update password only if provided
    let hashedPassword = user.password;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // keep old image if not updated
    const finalProfileImage = profileImage || user.profile_image;

    // update in DB
    await updateUser(
      userId,
      username || user.username,
      email || user.email,
      hashedPassword,
      finalProfileImage
    );

    logger.info(`User updated profile: ${email || user.email}`);
    res.status(200).json({
      message: "Profile updated successfully",
      profileImage: finalProfileImage ? `/uploads/${finalProfileImage}` : null,
    });
  } catch (error) {
    next(error);
  }
};

// Get current logged-in user
export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.userID; // from JWT payload
    const user = await findUserById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      userID: user.userID,
      username: user.username,
      email: user.email,
      profileImage: user.profile_image ? `/uploads/${user.profile_image}` : null,
    });
  } catch (error) {
    next(error);
  }
};
