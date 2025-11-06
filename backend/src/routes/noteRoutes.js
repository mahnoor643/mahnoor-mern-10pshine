import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createUserNote,
  getMyNotes,
  updateUserNote,
  deleteUserNote,
  getNoteById,
  unlockNote
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/create", authenticateToken, createUserNote);
router.get("/my", authenticateToken, getMyNotes);
router.put("/update/:id", authenticateToken, updateUserNote);
router.delete("/delete/:id", authenticateToken, deleteUserNote);
router.post("/unlock/:id", authenticateToken, unlockNote);
router.get("/:id", authenticateToken, getNoteById);

export default router;
