import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import Archive from "./Archive";

// 🧩 Mock child components to avoid full UI rendering
vi.mock("../Dashboard/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../Dashboard/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("../Notes/NotesCard", () => ({
  default: (props) => <div data-testid="note-card">{props.title}</div>,
}));
vi.mock("../Locked/SecretNoteCard", () => ({
  default: (props) => <div data-testid="secret-card">{props.title}</div>,
}));
vi.mock("../CreateNotes/RichNoteEditor", () => ({
  default: () => <div data-testid="editor">Editor</div>,
}));

// 🧠 Mock bootstrap modals
vi.mock("bootstrap", () => ({
  Modal: vi.fn().mockImplementation(() => ({
    show: vi.fn(),
    hide: vi.fn(),
  })),
}));

// 🧠 Mock SweetAlert2
vi.mock("sweetalert2", () => ({
  fire: vi.fn().mockResolvedValue({ isConfirmed: false }),
}));

// 🧠 Global fetch mock
global.fetch = vi.fn();

describe("Archive Page - Basic Tests", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    fetch.mockReset();
  });

  test("renders loading message initially", () => {
    fetch.mockImplementation(() => new Promise(() => {})); // pending
    render(<Archive />);
    expect(screen.getByText(/Loading notes/i)).toBeInTheDocument();
  });

  test("renders archived notes after successful fetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Archived Note",
          archived: 1,
          pinned: 0,
          secured: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          title: "Locked Note",
          archived: 1,
          pinned: 0,
          secured: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
    });

    render(<Archive />);

    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });

    expect(screen.getAllByTestId(/card/i).length).toBe(2);
  });

  test("handles fetch error gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(<Archive />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading notes/i)).not.toBeInTheDocument();
    });
  });
});
