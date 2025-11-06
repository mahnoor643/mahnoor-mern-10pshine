import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AuthPage from "./Auth";

// 🧩 Mock child components
vi.mock("./LoginForm", () => ({
  default: ({
    loginEmail,
    setloginEmail,
    loginPassword,
    setloginPassword,
    handleSubmit,
    handleStateChange,
  }) => (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <input
        placeholder="Email"
        value={loginEmail}
        onChange={(e) => setloginEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        value={loginPassword}
        onChange={(e) => setloginPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      <button type="button" onClick={() => handleStateChange("signup")}>
        Go to Signup
      </button>
    </form>
  ),
}));

vi.mock("./SignupForm", () => ({
  default: ({
    signupName,
    setSignupName,
    signupEmail,
    setSignupEmail,
    signupPassword,
    setSignupPassword,
    handleSignupSubmit,
    handleStateChange,
  }) => (
    <form onSubmit={handleSignupSubmit} data-testid="signup-form">
      <input
        placeholder="Full Name"
        value={signupName}
        onChange={(e) => setSignupName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={signupEmail}
        onChange={(e) => setSignupEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        value={signupPassword}
        onChange={(e) => setSignupPassword(e.target.value)}
      />
      <button type="submit">Signup</button>
      <button type="button" onClick={() => handleStateChange("login")}>
        Go to Login
      </button>
    </form>
  ),
}));

vi.mock("./ForgotPasswordModal", () => ({
  default: ({ show }) =>
    show ? <div data-testid="forgot-modal">Forgot Password</div> : null,
}));

// 🧠 Mock axios & navigation
import axios from "axios";
vi.mock("axios");
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// 🧠 Mock toast
import { toast } from "react-toastify";
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => <div data-testid="toast" />,
}));

describe("Auth Component Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders login form by default", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  test("switches to signup form", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Go to Signup"));
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });

  test("validates login form with invalid inputs", async () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    // Expect error toast not called since validation fails before axios
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("successful login should navigate to dashboard", async () => {
    axios.post.mockResolvedValueOnce({ data: { token: "abc123" } });

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Test@1234" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/auth/login",
        {
          email: "test@example.com",
          password: "Test@1234",
        }
      );
    });

    expect(localStorage.getItem("token")).toBe("abc123");
    expect(toast.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });


  test("validates signup form with missing data", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Go to Signup"));
    fireEvent.click(screen.getByText("Signup"));
    expect(axios.post).not.toHaveBeenCalled();
  });
});
