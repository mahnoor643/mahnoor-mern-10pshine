import { pool } from "../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const createUser = async (username, email, hashedPassword, profileImage) => {
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password, isAdmin, profile_image) VALUES (?, ?, ?, ?, ?)",
    [username, email, hashedPassword, false, profileImage]
  );
  return result.insertId;
};

export const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT id, username, email, isAdmin FROM users");
  return rows;
};

export const findUserById = async (userID) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE userID = ?", [userID]);
  return rows[0];
};
