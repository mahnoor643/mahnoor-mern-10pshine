import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPasswordModal = ({ show, onClose }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }
    alert("If this email exists, a reset link has been sent!");
    setEmail("");
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="custom-modal-overlay"
      onClick={onClose}
    >
      <div
        className="custom-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-4 p-4">
          <div className="modal-body text-center">
            <h4 className="fw-bolder mb-2 text-green">Forgot your password?</h4>
            <p className="text-muted mb-2 fs-6">
              We’ll email you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-3 text-center py-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="submit-btn mb-4"
              >
                Send me a password reset link
              </button>

              <button
                type="button"
                className="inactive-state"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
