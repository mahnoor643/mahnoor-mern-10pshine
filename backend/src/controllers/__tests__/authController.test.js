import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerUser, loginUser, getAllRegisteredUsers } from "../authController.js";
import * as userModel from "../../models/userModel.js";
import logger from "../../utils/logger.js";

// Mock dependencies
vi.mock("../../models/userModel.js");
vi.mock("../../utils/logger.js");
vi.mock("bcrypt");
vi.mock("jsonwebtoken");

// helper function to create mock req/res
const mockReqRes = (body = {}, user = {}) => {
  const req = { body, user };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
  const next = vi.fn();
  return { req, res, next };
};

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------
  // 🧩 TEST 1 — Register User
  // ---------------------------
  it("should register a new user successfully", async () => {
    const { req, res, next } = mockReqRes({
      username: "mahnoor",
      email: "mano@example.com",
      password: "password123",
    });

    // mock database + bcrypt
    userModel.findUserByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed123");
    userModel.createUser.mockResolvedValue(1);

    await registerUser(req, res, next);

    expect(userModel.findUserByEmail).toHaveBeenCalledWith("mano@example.com");
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User registered successfully",
        userId: 1,
      })
    );
  });

  // ---------------------------
  // 🧩 TEST 2 — Register (email already exists)
  // ---------------------------
  it("should return 409 if user already exists", async () => {
    const { req, res, next } = mockReqRes({
      username: "mahnoor",
      email: "mano@example.com",
      password: "password123",
    });

    userModel.findUserByEmail.mockResolvedValue({ email: "mano@example.com" });

    await registerUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "User with this email already exists",
    });
  });

  // ---------------------------
  // 🧩 TEST 3 — Login success
  // ---------------------------
  it("should login successfully with correct credentials", async () => {
    const { req, res, next } = mockReqRes({
      email: "mano@example.com",
      password: "password123",
    });

    userModel.findUserByEmail.mockResolvedValue({
      userID: 1,
      email: "mano@example.com",
      password: "hashed123",
      isAdmin: false,
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-jwt-token");

    await loginUser(req, res, next);

    expect(userModel.findUserByEmail).toHaveBeenCalledWith("mano@example.com");
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Login successful",
        token: "fake-jwt-token",
      })
    );
  });

  // ---------------------------
  // 🧩 TEST 4 — Login invalid user
  // ---------------------------
  it("should return 400 if user not found", async () => {
    const { req, res, next } = mockReqRes({
      email: "notfound@example.com",
      password: "password123",
    });

    userModel.findUserByEmail.mockResolvedValue(null);

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid credentials",
    });
  });

  // ---------------------------
  // 🧩 TEST 5 — Get All Users (admin only)
  // ---------------------------
  it("should return all users for admin", async () => {
    const { req, res, next } = mockReqRes({}, { id: 1 });
    userModel.findUserById.mockResolvedValue({ isAdmin: true });
    userModel.getAllUsers.mockResolvedValue([{ userID: 1, username: "Mahnoor" }]);

    await getAllRegisteredUsers(req, res, next);

    expect(userModel.findUserById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ userID: 1, username: "Mahnoor" }]);
  });
});
