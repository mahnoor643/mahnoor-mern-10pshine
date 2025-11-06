import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../Auth/Auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordModal from "./ForgotPasswordModal";
import axios from "axios"

const Auth = () => {
    const navigate = useNavigate();
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [SignupFile, setSignupFile] = useState();
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
        if (!loginEmail.trim()) {
            formErrors.email = "Email is required.";
        } else if (!emailRegex.test(loginEmail)) {
            formErrors.email = "Please enter a valid email address.";
        }

        // Password validation (8 chars, 1 uppercase, 1 special)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!loginPassword.trim()) {
            formErrors.password = "Password is required.";
        } else if (!passwordRegex.test(loginPassword)) {
            formErrors.password = "Password must be at least 8 characters long, include one uppercase letter and one symbol.";
        }

        setloginErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    //Validate Signup
    const validateSignup = () => {
        let formErrors = {};

        // Name validation
        if (!signupName.trim()) {
            formErrors.name = "Full name is required.";
        } else if (signupName.trim().length <= 5) {
            formErrors.name = "Full name must be at least 5 characters.";
        }


        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!signupEmail.trim()) {
            formErrors.email = "Email is required.";
        } else if (!emailRegex.test(signupEmail)) {
            formErrors.email = "Please enter a valid email address.";
        }


        // Password validation (8 chars, 1 uppercase, 1 special)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!signupPassword.trim()) {
            formErrors.password = "Password is required.";
        } else if (!passwordRegex.test(signupPassword)) {
            formErrors.password = "Password must be at least 8 characters long, include one capital letter and one symbol.";
        }


        setSignupErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };


    // handle login submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // ✅ Step 1: Validate form before submit

    if (!validateForm()) {
        console.log("⚠️ Validation failed. Please correct the errors.");
        return; 
    }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email: loginEmail,
                password: loginPassword,
            });

            // console.log("✅ Login Successful:", res.data);
            // Save token in localStorage
            localStorage.setItem("token", res.data.token);
            toast.success("Login successful!", {
                position: "top-center",
                autoClose: 2500,
                style: {
                    background: "#09585f",
                    color: "#fff",
                    borderRadius: "10px",
                },
            });
            // Optionally redirect user to dashboard or notes page
            navigate("/dashboard");
        } catch (error) {
            console.error("❌ Login failed:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Login failed!", {
                position: "top-center",
                autoClose: 2500,
                style: {
                    background: "#09585f",
                    color: "#fff",
                    borderRadius: "10px",
                },
            });
        }
    };

    //handle signup user
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        if (validateSignup()) {
            try {
                const formData = new FormData();
                formData.append("username", signupName);
                formData.append("email", signupEmail);
                formData.append("password", signupPassword);
                formData.append("profileImage", SignupFile);

                // console.log("🧾 SignupFile before sending:", SignupFile);


                const res = await axios.post(
                    "http://localhost:5000/api/auth/signup",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                // console.log("✅ Signup Successful:", res.data);
                // alert("Signup successful!");
                toast.success("Signup successful!", {
                    position: "top-center",
                    autoClose: 2500,
                    style: {
                        background: "#09585f",
                        color: "#fff",
                        borderRadius: "10px",
                    },
                });
                setState("login");
            } catch (error) {
                toast.error("❌ Something went wrong!", {
                    position: "top-center",
                    autoClose: 2500,
                    style: {
                        background: "#09585f",
                        color: "#fff",
                        borderRadius: "10px",
                    },
                });
                console.error("Signup failed ❌:", error.response?.data || error.message);
            }
        }
    };

    const handleStateChange = (newState) => {
        setState(newState);
        setloginErrors({});
        setSignupErrors({});

        // Clear all input fields when switching
        setloginEmail("");
        setloginPassword("");
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
    };

    return (
        <>
            <div className="auth-container row m-0 p-0">
                {/* Illustration Section */}
                <div className="illustration-sec col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start justify-content-center p-4 text-center text-md-start">
                    <div className="text-content" style={{ letterSpacing: "-1px" }}>
                        <h1 className="brand fw-bolder display-3 display-md-4">NoteVerse</h1>
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
                <div className="auth-section col-12 col-md-6 bg-light d-flex flex-column justify-content-center align-items-center p-4">
                    <div className="auth-box w-100 px-4 px-md-5 py-3">


                        <div className="text-center">
                            <h1 className="fw-bold text-green mobile-title">NoteVerse</h1>
                            <p>NoteVerse — Because every idea deserves a space.</p>
                        </div>

                        <div className="form-wrapper  position-relative" style={{ minHeight: "380px" }}>
                            {/* Login Form */}
                            {state === "login" ? (



                                <LoginForm
                                    loginEmail={loginEmail}
                                    loginPassword={loginPassword}
                                    loginErrors={loginErrors}
                                    setloginEmail={setloginEmail}
                                    setloginPassword={setloginPassword}
                                    setloginErrors={setloginErrors}
                                    handleSubmit={handleSubmit}
                                    setShowForgotModal={setShowForgotModal}
                                    handleStateChange={handleStateChange}
                                />
                            ) : (
                                /* Signup Form */


                                <SignupForm
                                    signupName={signupName}
                                    signupEmail={signupEmail}
                                    signupPassword={signupPassword}
                                    signupErrors={signupErrors}
                                    setSignupName={setSignupName}
                                    setSignupEmail={setSignupEmail}
                                    setSignupPassword={setSignupPassword}
                                    setSignupErrors={setSignupErrors}
                                    setSignupFile={setSignupFile}
                                    handleSignupSubmit={handleSignupSubmit}
                                    handleStateChange={handleStateChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                show={showForgotModal}
                onClose={() => setShowForgotModal(false)}
            />

            <ToastContainer position="top-center" autoClose={3000} />

        </>
    );
};

export default Auth;
