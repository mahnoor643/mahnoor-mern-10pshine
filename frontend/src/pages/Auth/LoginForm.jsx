import React, { useState } from 'react'

const loginForm = ({
    loginEmail,
    setloginEmail,
    loginPassword,
    setloginPassword,
    loginErrors,
    setloginErrors,
    handleSubmit,
    setShowForgotModal,
    handleStateChange,
}) => {

      const [showPassword, setShowPassword] = useState(false);

    return (

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
             {/* Password Field */}
      <div className="mb-3 position-relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className={`form-control text-center text-md-start py-2 ${
            loginErrors.password ? 'is-invalid' : ''
          }`}
          value={loginPassword}
          onChange={(e) => {
            setloginPassword(e.target.value);
            // remove pwd error while typing
            if (loginErrors.password) {
              setloginErrors((prev) => ({ ...prev, password: '' }));
            }
          }}
        />

        {/* 👁️ Eye Toggle Icon */}
        <i
          className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute`}
          onClick={() => setShowPassword(!showPassword)}
          style={{
            top: '50%',
            right: '12px',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#6c757d',
          }}
          title={showPassword ? 'Hide password' : 'Show password'}
        ></i>

        {loginErrors.password && (
          <div className="invalid-feedback text-start text-small">
            {loginErrors.password}
          </div>
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
                <a href="#" style={{ cursor: "pointer" }}
                    onClick={() => setShowForgotModal(true)} className="text-decoration-none fw-semibold small">
                    Forgot your password?
                </a>
            </div>
            <div className="d-flex justify-content-center mb-3">
                <button
                    type="submit"
                    className="green-btn fw-semibold"
                    style={{ fontSize: "0.9rem" }}
                >
                    Log in
                </button>
            </div>

            <div className="or-divider text-muted">
                <small>Don't have an account?</small>
            </div>

            <div className="d-flex gap-2 mt-2 justify-content-center">

                <button className="inactive-state" type="button" onClick={() => handleStateChange("signup")}>Sign Up</button>

            </div>
        </form>
    )
}

export default loginForm