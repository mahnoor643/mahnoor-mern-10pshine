import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import DashboardPage from "./Dashboard.jsx";

// 🧱 Mock dependencies
vi.mock("../Dashboard/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../Dashboard/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("../Notes/NotesCard", () => ({
  default: (props) => (
    <div data-testid="notes-card">
      NotesCard - {props.title || "Untitled"}
    </div>
  ),
}));
vi.mock("../Locked/SecretNoteCard", () => ({
  default: (props) => (
    <div data-testid="secret-card">
      SecretNoteCard - {props.title || "Secret"}
    </div>
  ),
}));
vi.mock("../CreateNotes/RichNoteEditor", () => ({
  default: (props) => (
    <div data-testid="rich-editor">Editor Mode: {props.mode}</div>
  ),
}));

// 🚫 Mock heavy external libs
vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}));
vi.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch + token
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: 1,
          title: "Sample Note",
          note: "This is a test note.",
          secured: 0,
          archived: 0,
          pinned: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]),
  })
);
vi.spyOn(Storage.prototype, "getItem").mockReturnValue("fake-token");

describe("Dashboard Component", () => {
  test("renders stats correctly", async () => {
    render(<MemoryRouter>
        <DashboardPage />
    </MemoryRouter>);

    // Wait for notes to load
    await waitFor(() => {
      expect(screen.getByText(/Total Notes/i)).toBeInTheDocument();
    });

    // Verify sections
    expect(screen.getByText(/Welcome to Noteverse/i)).toBeInTheDocument();
    expect(screen.getByText(/Create New Note/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Notes/i)).toBeInTheDocument();

    // Check mock note card
    expect(screen.getByTestId("notes-card")).toBeInTheDocument();
  });

  test("displays loader when notes are loading", () => {
    global.fetch.mockImplementationOnce(
      () => new Promise(() => {}) // never resolves
    );

    render(<MemoryRouter>
        <DashboardPage />
    </MemoryRouter>);
    expect(screen.getByText(/Loading notes.../i)).toBeInTheDocument();
  });
});
