import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UnlockModal = ({ show, onClose, onUnlock }) => {
  const [password, setPassword] = useState("");

  const handleUnlock = () => {
    if (password.trim() === "") {
      toast.error("Please enter your password.", {
                              position: "top-center",
                              autoClose: 2500,
                              style: {
                                  background: "#09585f",
                                  color: "#fff",
                                  borderRadius: "10px",
                              },
                          });
      return;
    }
    onUnlock(password);
    setPassword("");
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: show ? "rgba(0,0,0,0.4)" : "transparent" }}
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow rounded-4">
          <div className="modal-body text-center p-4">
            <h5 className="fw-semibold mb-3">Enter password to unlock</h5>
            <label htmlFor="unlockPassword" className="form-label text-muted small">
              Secret password
            </label>
            <input
              type="password"
              className="form-control text-center mb-4"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: "10px",
                padding: "10px",
                fontSize: "1rem",
              }}
            />
            <div className="d-flex justify-content-center gap-3">
              <button
                className="green-btn w-25"
                onClick={handleUnlock}
              >
                OK
              </button>
              <button
                className="btn btn-outline-secondary"
                
                onClick={() => {
                  setPassword("");
                  onClose();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UnlockModal;
