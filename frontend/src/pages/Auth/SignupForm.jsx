import React, { useState } from 'react'

const SignupForm = ({
    signupName,
    signupEmail,
    signupPassword,
    signupErrors,
    setSignupName,
    setSignupEmail,
    setSignupPassword,
    setSignupErrors,
    setSignupFile,
    handleSignupSubmit,
    handleStateChange
}) => {
      const [showPassword, setShowPassword] = useState(false);

    return (
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

            {/* Profile Picture */}
            <div className="mb-3">
                <input
                    type="file"
                    accept="image/*"
                    className={`form-control text-center text-md-start py-2 ${signupErrors.file ? "is-invalid" : ""}`}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            // validate file type
                            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
                            if (!validTypes.includes(file.type)) {
                                setSignupErrors((prev) => ({
                                    ...prev,
                                    file: "Only image files (JPG, PNG, GIF) are allowed.",
                                }));
                                e.target.value = ""; // reset the input
                                return;
                            }

                            // validate file size (e.g., max 2MB)
                            const maxSize = 2 * 1024 * 1024; // 2MB
                            if (file.size > maxSize) {
                                setSignupErrors((prev) => ({
                                    ...prev,
                                    file: "File size should not exceed 2MB.",
                                }));
                                e.target.value = "";
                                return;
                            }

                            // if valid
                            setSignupErrors((prev) => ({ ...prev, file: "" }));
                            setSignupFile(file); // ✅ THIS IS REQUIRED
                        } else {
                            setSignupErrors((prev) => ({ ...prev, file: "Please select a file." }));
                        }
                    }}
                />
                {signupErrors.file && (
                    <div className="invalid-feedback text-start text-small">
                        {signupErrors.file}
                    </div>
                )}
            </div>

            {/* Password */}
      <div className="mb-3 position-relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className={`form-control text-center text-md-start py-2 ${signupErrors.password ? "is-invalid" : ""}`}
          value={signupPassword}
          onChange={(e) => {
            setSignupPassword(e.target.value);
            if (signupErrors.password) {
              setSignupErrors((prev) => ({ ...prev, password: "" }));
            }
          }}
        />

        {/* 👁️ Eye Toggle Icon */}
        <i
          className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
          onClick={() => setShowPassword(!showPassword)}
          style={{
            top: "50%",
            right: "12px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#6c757d",
          }}
          title={showPassword ? "Hide password" : "Show password"}
        ></i>

        {signupErrors.password && (
          <div className="invalid-feedback text-start text-small">
            {signupErrors.password}
          </div>
        )}
      </div>

            <div className="d-flex justify-content-center">
                <button
                    type="submit"
                    className="green-btn fw-semibold"
                    style={{ fontSize: "0.9rem" }}
                >
                    Create Account
                </button>
            </div>
            <div className="or-divider text-muted">
                <small>Already have an account!</small>
            </div>

            <div className="d-flex gap-2 mt-2 justify-content-center">

                <button className="inactive-state" type="button" onClick={() => handleStateChange("login")}>Sign In</button>

            </div>
        </form>
    )
}

export default SignupForm