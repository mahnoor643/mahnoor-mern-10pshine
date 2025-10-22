import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../Auth/Auth.css";

const Auth = () => {

    const [state, setState] = useState("login");

    // login form states
    const [loginEmail, setloginEmail] = useState("");
    const [loginPassword, setloginPassword] = useState("");
    const [loginErrors, setloginErrors] = useState({});

    // SIGNUP FORM STATES
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupErrors, setSignupErrors] = useState({});



    // Validate login
    const validateForm = () => {
        let formErrors = {};

        // Email validation (simple regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(loginEmail)) {
            formErrors.email = "Please enter a valid email address.";
        }

        // Password validation (8 chars, 1 uppercase, 1 special)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(loginPassword)) {
            formErrors.password =
                "Password must be at least 8 characters long, with one capital letter and one symbol.";
        }

        setloginErrors(formErrors);

        return Object.keys(formErrors).length === 0; // returns true if no error
    };


    //Validate Signup
    const validateSignup = () => {
        let formErrors = {};

        // Name validation
        if (signupName.trim().length < 3) {
            formErrors.name = "Full name must be at least 3 characters.";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signupEmail)) {
            formErrors.email = "Please enter a valid email address.";
        }

        // Password validation (8 chars, 1 uppercase, 1 special)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(signupPassword)) {
            formErrors.password =
                "Password must be at least 8 characters long, include one capital letter and one symbol.";
        }

        setSignupErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };


    // handle login submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form Submitted ✅");
        }
    };

    //handle signup user
    const handleSignupSubmit = (e) => {
        e.preventDefault();
        if (validateSignup()) {
            console.log("✅ Signup Successful!");
        }
    };

    return (
        <div className="auth-container row m-0 p-0 min-vh-100">
            {/* Illustration Section */}
            <div className="illustration-sec col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start justify-content-center p-4 text-center text-md-start">
                <div className="text-content" style={{ letterSpacing: "-1px" }}>
                    <h1 className="brand fw-bolder display-4 display-md-3">NoteVerse</h1>
                    <div className="text-yellow py-2">
                        <h2 className="fw-bold mb-1 fs-3 fs-md-2">Capture ideas.</h2>
                        <h2 className="fw-bold mb-1 fs-3 fs-md-2">Connect thoughts.</h2>
                        <h2 className="fw-bold mb-0 fs-3 fs-md-2">Create magic.</h2>
                    </div>
                    <h6 className="pt-2 text-muted fs-6">
                        The professional space for your thoughts.
                    </h6>
                </div>

                {/* Hidden on small screens */}
                <img
                    src="Images/globe.png"
                    alt="Globe Network"
                    className="globe-illustration d-none d-md-block mt-4"
                />
            </div>

            {/* Login / Signup Section */}
            <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center p-4">
                <div className="auth-box w-100 px-4 px-md-5 py-3">
                    {/* Navigation Tabs */}
                    <ul className="nav navigation d-flex flex-column flex-md-row justify-content-center align-items-center text-center mb-3">
                        <li className="nav-item">
                            <button
                                className={`active-auth ${state === "signup" ? "inactive-state" : ""
                                    }`}
                                onClick={() => setState("login")}
                            >
                                Login
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`active-auth ${state === "login" ? "inactive-state" : ""
                                    }`}
                                onClick={() => setState("signup")}
                            >
                                Sign Up
                            </button>
                        </li>
                    </ul>

                    <div className="form-wrapper  position-relative" style={{ minHeight: "380px" }}>
                        {/* Login Form */}
                        {state === "login" ? (
                            <form id="loginForm" className="mx-auto position-absolute w-100"
                                style={{ maxWidth: "350px" }}
                                onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className={`form-control text-center text-md-start py-2 ${loginErrors.email ? "is-invalid" : ""
                                            }`}
                                        value={loginEmail}
                                        onChange={(e) => {
                                            setloginEmail(e.target.value)
                                            // remove email error while typing
                                            if (loginErrors.email) {
                                                setloginErrors((prev) => ({ ...prev, email: "" }));
                                            }
                                        }}
                                    />
                                    {loginErrors.email && (
                                        <div className="invalid-feedback text-start text-small">{loginErrors.email}</div>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className={`form-control text-center text-md-start py-2 ${loginErrors.password ? "is-invalid" : ""
                                            }`}
                                        value={loginPassword}
                                        onChange={(e) => {
                                            setloginPassword(e.target.value)
                                            // remove pwd error while typing
                                            if (loginErrors.password) {
                                                setloginErrors((prev) => ({ ...prev, password: "" }));
                                            }
                                        }}
                                    />
                                    {loginErrors.password && (
                                        <div className="invalid-feedback text-start text-small">{loginErrors.password}</div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3 small">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="remember"
                                        />
                                        <label className="form-check-label" htmlFor="remember">
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="#" className="text-decoration-none small">
                                        Forgot?
                                    </a>
                                </div>
                                <div className="d-flex justify-content-center mb-3">
                                    <button
                                        type="submit"
                                        className="submit-btn fw-semibold"
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        Log in
                                    </button>
                                </div>

                                <div className="or-divider text-muted">
                                    <small>Or continue with</small>
                                </div>

                                <div className="d-flex gap-2 mt-2 justify-content-center">
                                    <button className="other-auth">
                                        <img src="Images/google.png" className="img-fluid" alt="" />
                                    </button>
                                    <button className="other-auth">
                                        <img src="Images/github.png" className="img-fluid" alt="" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Signup Form */
                            <form id="signupForm" className="mx-auto position-absolute w-100"
                                style={{ maxWidth: "350px" }}
                                onSubmit={handleSignupSubmit}>
                                {/* Full Name */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className={`form-control text-center text-md-start py-2 ${signupErrors.name ? "is-invalid" : ""
                                            }`}
                                        value={signupName}
                                        onChange={(e) => {
                                            setSignupName(e.target.value)
                                            // remove name error while typing
                                            if (signupErrors.name) {
                                                setSignupErrors((prev) => ({ ...prev, name: "" }));
                                            }
                                        }}

                                    />
                                    {signupErrors.name && (
                                        <div className="invalid-feedback text-start text-small">{signupErrors.name}</div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className={`form-control text-center text-md-start py-2 ${signupErrors.email ? "is-invalid" : ""
                                            }`}
                                        value={signupEmail}
                                        onChange={(e) => {
                                            setSignupEmail(e.target.value)
                                            // remove email error while typing
                                            if (signupErrors.email) {
                                                setSignupErrors((prev) => ({ ...prev, email: "" }));
                                            }
                                        }}

                                    />
                                    {signupErrors.email && (
                                        <div className="invalid-feedback text-start text-small">{signupErrors.email}</div>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className={`form-control text-center text-md-start py-2 ${signupErrors.password ? "is-invalid" : ""
                                            }`}
                                        value={signupPassword}
                                        onChange={(e) => {
                                            setSignupPassword(e.target.value)
                                            // remove pwd error while typing
                                            if (signupErrors.password) {
                                                setSignupErrors((prev) => ({ ...prev, password: "" }));
                                            }
                                        }}

                                    />
                                    {signupErrors.password && (
                                        <div className="invalid-feedback text-start text-small">{signupErrors.password}</div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button
                                        type="submit"
                                        className="submit-btn fw-semibold"
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        Create Account
                                    </button>
                                </div>
                                <div className="text-center mt-3 small text-muted">
                                    By creating an account, you agree to our{" "}
                                    <a href="#" className="text-decoration-none">
                                        terms
                                    </a>
                                    .
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
