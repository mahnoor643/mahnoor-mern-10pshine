import bcrypt from "bcrypt";
import {
  createNote,
  getUserNotes,
  updateNote,
  deleteNote,
} from "../models/noteModel.js";

// CREATE NOTE
export const createUserNote = async (req, res, next) => {
  try {
    const userId = req.user.userID;
    const { title, note, pinned, secured, password, archived, tags } = req.body;

    let hashedPassword = null;
    if (secured && password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const noteId = await createNote(
      userId,
      title,
      note,
      pinned || false,
      secured || false,
      hashedPassword,
      archived || false,
      tags || null
    );

    res.status(201).json({ message: "Note created successfully", noteId });
  } catch (error) {
    next(error);
  }
};

// GET ALL NOTES OF USER
export const getMyNotes = async (req, res, next) => {
  try {
    const userId = req.user.userID;
    const notes = await getUserNotes(userId);
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// UPDATE NOTE
export const updateUserNote = async (req, res, next) => {
  try {
    const userId = req.user.userID;
    const noteId = req.params.id;
    const updated = await updateNote(noteId, userId, req.body);

    if (!updated) return res.status(404).json({ message: "Note not found or not authorized" });
    res.status(200).json({ message: "Note updated successfully" });
  } catch (error) {
    next(error);
  }
};

// DELETE NOTE
export const deleteUserNote = async (req, res, next) => {
  try {
    const userId = req.user.userID;
    const noteId = req.params.id;
    const deleted = await deleteNote(noteId, userId);

    if (!deleted) return res.status(404).json({ message: "Note not found or not authorized" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};
