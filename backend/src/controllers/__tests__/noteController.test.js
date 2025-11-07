// src/controllers/__tests__/noteController.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as noteModel from "../../models/noteModel.js";
import bcrypt from "bcrypt";
import {
  createUserNote,
  getMyNotes,
  updateUserNote,
  deleteUserNote,
  getNoteById,
  unlockNote
} from "../noteController.js";

// ✅ Mock all imported modules
vi.mock("../../models/noteModel.js");
vi.mock("bcrypt");

let mockReq, mockRes, next;

beforeEach(() => {
  mockReq = {
    user: { userID: 1 },
    body: {},
    params: {}
  };
  mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };
  next = vi.fn();
  vi.clearAllMocks();
});

//
// 🧩 CREATE NOTE
//
describe("createUserNote", () => {
  it("should create a note successfully", async () => {
    mockReq.body = { title: "Test Note", note: "Hello", secured: false };
    noteModel.createNote.mockResolvedValue(5);

    await createUserNote(mockReq, mockRes, next);

    expect(noteModel.createNote).toHaveBeenCalledWith(
      1,
      "Test Note",
      "Hello",
      false,
      false,
      null,
      false,
      null
    );
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Note created successfully",
      noteId: 5
    });
  });

  it("should hash password if secured note", async () => {
    mockReq.body = {
      title: "Secret Note",
      note: "Top Secret",
      secured: true,
      password: "1234"
    };
    bcrypt.hash.mockResolvedValue("hashed_pwd");
    noteModel.createNote.mockResolvedValue(10);

    await createUserNote(mockReq, mockRes, next);

    expect(bcrypt.hash).toHaveBeenCalledWith("1234", 10);
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });
});

//
// 🧩 GET ALL NOTES
//
describe("getMyNotes", () => {
  it("should return all user notes", async () => {
    const fakeNotes = [{ id: 1, title: "Note 1" }];
    noteModel.getUserNotes.mockResolvedValue(fakeNotes);

    await getMyNotes(mockReq, mockRes, next);

    expect(noteModel.getUserNotes).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(fakeNotes);
  });
});

//
// 🧩 UPDATE NOTE
//
describe("updateUserNote", () => {
  it("should update note successfully", async () => {
    mockReq.params.id = 3;
    mockReq.body = { title: "Updated Note" };
    noteModel.updateNote.mockResolvedValue(true);

    await updateUserNote(mockReq, mockRes, next);

    expect(noteModel.updateNote).toHaveBeenCalledWith(3, 1, { title: "Updated Note" });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Note updated successfully" });
  });

  it("should return 404 if note not found", async () => {
    mockReq.params.id = 5;
    mockReq.body = { title: "Not found note" };
    noteModel.updateNote.mockResolvedValue(false);

    await updateUserNote(mockReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Note not found or not authorized"
    });
  });
});

//
// 🧩 DELETE NOTE
//
describe("deleteUserNote", () => {
  it("should delete a note successfully", async () => {
    mockReq.params.id = 1;
    noteModel.deleteNote.mockResolvedValue(true);

    await deleteUserNote(mockReq, mockRes, next);

    expect(noteModel.deleteNote).toHaveBeenCalledWith(1, 1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Note deleted successfully"
    });
  });

  it("should return 404 if note not found", async () => {
    mockReq.params.id = 2;
    noteModel.deleteNote.mockResolvedValue(false);

    await deleteUserNote(mockReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Note not found or not authorized"
    });
  });
});

//
// 🧩 GET NOTE BY ID
//
describe("getNoteById", () => {
  it("should return a specific note", async () => {
    mockReq.params.id = 7;
    const fakeNote = { id: 7, title: "Test Note" };
    noteModel.getNoteByIdModel.mockResolvedValue(fakeNote);

    await getNoteById(mockReq, mockRes, next);

    expect(noteModel.getNoteByIdModel).toHaveBeenCalledWith(7, 1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(fakeNote);
  });

  it("should return 404 if note not found", async () => {
    mockReq.params.id = 9;
    noteModel.getNoteByIdModel.mockResolvedValue(null);

    await getNoteById(mockReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });
});

//
// 🧩 UNLOCK NOTE
//
describe("unlockNote", () => {
  it("should unlock note successfully with correct password", async () => {
    mockReq.params.id = 11;
    mockReq.body = { password: "1234" };
    const fakeNote = { id: 11, password: "hashed" };

    noteModel.getNoteByIdModel.mockResolvedValue(fakeNote);
    bcrypt.compare.mockResolvedValue(true);

    await unlockNote(mockReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Note unlocked successfully",
      note: fakeNote
    });
  });

  it("should return 401 if incorrect password", async () => {
    mockReq.params.id = 12;
    mockReq.body = { password: "wrong" };
    const fakeNote = { id: 12, password: "hashed" };

    noteModel.getNoteByIdModel.mockResolvedValue(fakeNote);
    bcrypt.compare.mockResolvedValue(false);

    await unlockNote(mockReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Incorrect password" });
  });

  it("should return 404 if note not found", async () => {
    mockReq.params.id = 13;
    noteModel.getNoteByIdModel.mockResolvedValue(null);

    await unlockNote(mockReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });
});
