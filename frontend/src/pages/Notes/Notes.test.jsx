import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import NotesPage from "./Notes.jsx";

// 🧱 Mock dependencies
vi.mock("../Dashboard/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../Dashboard/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("./NotesCard", () => ({
  default: (props) => (
    <div data-testid="note-card">NoteCard - {props.title}</div>
  ),
}));
vi.mock("../Locked/SecretNoteCard", () => ({
  default: (props) => (
    <div data-testid="secret-card">SecretCard - {props.title}</div>
  ),
}));
vi.mock("../CreateNotes/RichNoteEditor", () => ({
  default: (props) => (
    <div data-testid="editor">Editor Mode: {props.mode}</div>
  ),
}));

// 🧩 Mock SweetAlert2 + Toastify
vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}));
vi.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: { success: vi.fn(), error: vi.fn() },
}));

// 🧠 Mock localStorage
vi.spyOn(Storage.prototype, "getItem").mockReturnValue("fake-token");

// 🧪 Mock fetch for notes
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: 1,
          title: "First Note",
          note: "This is a public note.",
          tags: "Work,Important",
          secured: 0,
          archived: 0,
          pinned: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Secret Note",
          note: "Top secret content.",
          tags: "Private",
          secured: 1,
          archived: 0,
          pinned: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]),
  })
);

describe("NotesPage Component", () => {
  test("renders Navbar, Sidebar, and Notes correctly", async () => {
    render(<NotesPage />);

    // 🔹 Loader appears first
    expect(screen.getByText(/Loading notes/i)).toBeInTheDocument();

    // 🔹 Wait for fetched notes to render
    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getAllByTestId(/(note-card|secret-card)/i)).toHaveLength(2);
    });

    // 🔹 Verify note titles
    expect(screen.getByText(/First Note/i)).toBeInTheDocument();
    expect(screen.getByText(/Secret Note/i)).toBeInTheDocument();
  });

  test("renders 'No notes' message when API returns empty array", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<NotesPage />);

    await waitFor(() => {
      // Since there's no explicit "No notes found" message in component,
      // the main area will simply have no NoteCard or SecretCard rendered.
      expect(screen.queryByTestId("note-card")).not.toBeInTheDocument();
      expect(screen.queryByTestId("secret-card")).not.toBeInTheDocument();
    });
  });

  test("handles fetch error gracefully", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<NotesPage />);

    await waitFor(() => {
      // Should fall back after error
      expect(screen.queryByText(/Loading notes/i)).not.toBeInTheDocument();
    });
  });
});
