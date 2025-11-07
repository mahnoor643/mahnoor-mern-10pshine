import { pool } from "../config/db.js";

// CREATE NOTE
export const createNote = async (userId, title, note, pinned, secured, password, archived, tags) => {
  const [result] = await pool.query(
    `INSERT INTO notes (user_id, title, note, pinned, secured, password, archived, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, title, note, pinned, secured, password, archived, tags]
  );
  return result.insertId;
};

// GET NOTES OF SPECIFIC USER
export const getUserNotes = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM notes WHERE user_id = ?", [userId]);
  return rows;
};

// UPDATE NOTE
export const updateNote = async (noteId, userId, fieldsToUpdate) => {
  const updates = [];
  const values = [];

  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    updates.push(`${key} = ?`);
    values.push(value);
  }

  values.push(noteId, userId);

  const [result] = await pool.query(
    `UPDATE notes SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    values
  );
  return result.affectedRows > 0;
};

// DELETE NOTE
export const deleteNote = async (noteId, userId) => {
  const [result] = await pool.query("DELETE FROM notes WHERE id = ? AND user_id = ?", [
    noteId,
    userId,
  ]);
  return result.affectedRows > 0;
};

// GET NOTE BY ID
export const getNoteByIdModel = async (noteId, userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM notes WHERE id = ? AND user_id = ?",
    [noteId, userId]
  );
  return rows.length > 0 ? rows[0] : null;
};

