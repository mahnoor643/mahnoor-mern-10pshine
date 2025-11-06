import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ProfilePage from "./Profile";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// ✅ Mock modules (Vitest way)
vi.mock("axios");
vi.mock("../Dashboard/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../Dashboard/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe("ProfilePage Component", () => {
  const mockUser = {
    username: "TestUser",
    email: "testuser@example.com",
    profileImage: "/uploads/test.jpg",
  };

  beforeEach(() => {
    // reset mocks completely before each test (important!)
    vi.resetAllMocks();
  });

  test("renders Navbar, Sidebar, and user info correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: mockUser });

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    // Navbar & Sidebar exist
    expect(await screen.findByTestId("navbar")).toBeInTheDocument();
    expect(await screen.findByTestId("sidebar")).toBeInTheDocument();

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("TestUser")).toBeInTheDocument();
      expect(screen.getByText("testuser@example.com")).toBeInTheDocument();
    });
  });

  test("handles Edit Profile and Save Changes", async () => {
    axios.get.mockResolvedValueOnce({ data: mockUser });
    axios.put.mockResolvedValueOnce({ status: 200 });

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("TestUser"));

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    const usernameInput = await screen.findByDisplayValue("TestUser");
    const passwordInput = screen.getByTestId("new-pwd");

    fireEvent.change(usernameInput, { target: { value: "UpdatedUser" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });

    const saveBtn = screen.getByText(/save changes/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
  });

  test("displays default image if profile image is missing", async () => {
    // ✅ Ensure the fallback logic runs (no profileImage)
    axios.get.mockResolvedValueOnce({
      data: {
        username: "NoPicUser",
        email: "nopicture@example.com",
        profileImage: "", // ensures fallback triggers
      },
    });

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    // Wait until new user data renders
    await waitFor(() => {
      expect(screen.getByText("NoPicUser")).toBeInTheDocument();
    });

    const img = screen.getByAltText("Profile");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("Images/profile.jpg")
    );
  });
});
