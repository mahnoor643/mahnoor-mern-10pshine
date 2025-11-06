import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import LockedPage from "./Locked.jsx";

// 🧱 Mock dependencies
vi.mock("../Dashboard/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../Dashboard/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("../Locked/SecretNoteCard", () => ({
  default: (props) => (
    <div data-testid="secret-card">SecretNoteCard - {props.title}</div>
  ),
}));
vi.mock("../CreateNotes/RichNoteEditor", () => ({
  default: (props) => <div data-testid="editor">Editor Mode: {props.mode}</div>,
}));

// 🧩 Mock external libs
vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) },
}));
vi.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: { success: vi.fn(), error: vi.fn() },
}));

// 🧪 Mock localStorage token
vi.spyOn(Storage.prototype, "getItem").mockReturnValue("fake-token");

// 🧪 Mock fetch (locked notes)
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: 1,
          title: "Locked Note",
          note: "This is a test locked note.",
          secured: 1,
          archived: 0,
          pinned: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]),
  })
);

describe("LockedPage Component", () => {
  test("renders Navbar, Sidebar, and locked notes correctly", async () => {
    render(<LockedPage />);

    // 🔹 First: loader should appear
    expect(screen.getByText(/Loading locked notes/i)).toBeInTheDocument();

    // 🔹 Then: wait for Navbar, Sidebar & notes to load
    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("secret-card")).toBeInTheDocument();
    });

    expect(screen.getByText(/Locked Note/i)).toBeInTheDocument();
    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
  });

  test("renders 'No locked notes found' when there are none", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<LockedPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/No locked notes found/i)
      ).toBeInTheDocument();
    });
  });
});
