import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import CreateNotesPage from "./CreateNotes.jsx";

// ✅ Mock child components to isolate CreateNotes
vi.mock("../Dashboard/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock("../Dashboard/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("./RichNoteEditor", () => ({
  default: (props) => (
    <div data-testid="editor">RichNoteEditor - Mode: {props.mode}</div>
  ),
}));

describe("CreateNotes Component", () => {
  test("renders Navbar, Sidebar, and AdvancedNoteEditor correctly", () => {
    render(<CreateNotesPage />);

    // Check for mocked child components
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("editor")).toHaveTextContent("Mode: create");
  });
});
