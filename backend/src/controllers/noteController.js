import bcrypt from "bcrypt";
import {
  createNote,
  getUserNotes,
  updateNote,
  deleteNote,
  getNoteByIdModel
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
    const updateData = { ...req.body };

    // 🔒 If a password is included, hash it before saving
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }

    const updated = await updateNote(noteId, userId, updateData);

    if (!updated)
      return res.status(404).json({ message: "Note not found or not authorized" });

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


// GET NOTE BY ID
export const getNoteById = async (req, res, next) => {
  try {
    const userId = req.user.userID;
    const noteId = req.params.id;

    // 🔹 Import a new helper in noteModel.js (we’ll add it below)
    const note = await getNoteByIdModel(noteId, userId);

    if (!note) {
      return res.status(404).json({ message: "Note not found or not authorized" });
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

//Unlock Note
export const unlockNote = async (req, res) => {
  try {
    const userId = req.user.userID;
    const noteId = req.params.id;
    const { password } = req.body;

    // ✅ Use model function (correct)
    const note = await getNoteByIdModel(noteId, userId);

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    // ✅ Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, note.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // ✅ Return note (unlocked)
    res.status(200).json({ message: "Note unlocked successfully", note });
  } catch (error) {
    console.error("Unlock error:", error);
    res.status(500).json({ message: "Error unlocking note" });
  }
};
