import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

    const handleLogout = () => {
      // 1️⃣ Remove auth token
      localStorage.removeItem("token");
  
      // 2️⃣ Optional: show toast
      toast.success("Logged out successfully!", {
        position: "top-center",
        autoClose: 2000,
        style: {
          background: "#09585f",
          color: "#fff",
          borderRadius: "10px",
        },
      });
  
      // 3️⃣ Redirect to login
      navigate("/");
    };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();

     if (dropdownRef.current) {
    new bootstrap.Dropdown(dropdownRef.current);
  }
  }, []);

  // ✅ Get full profile image URL (if uploaded)
  const getProfileImage = () => {
    if (user?.profileImage) {
      // If backend gives filename only
      if (!user.profileImage.startsWith("http")) {
        return `http://localhost:5000${user.profileImage}`;
      }
      return user.profileImage;
    }
    return null; // so letter avatar will show instead
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm" id="navbar">
      <div className="container-fluid">
        <h1 className="navbar-brand d-flex justify-content-center align-items-center m-0 ms-2 text-green fw-bold">
          <img src="/Images/Logo.png" className="logo" alt="Logo" />
          <span className="display-6 fw-bold">Note</span>Verse
        </h1>

        <div className="d-flex align-items-center gap-2">
          {/* 📱 Offcanvas Menu Button */}
          <button
            className="btn btn-outline-secondary d-md-none"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasSidebar"
          >
            Menu
          </button>

          {/* 👤 User Dropdown */}
          <div className="dropdown">
            <button
              className="d-flex align-items-center border-0 bg-transparent"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              ref={dropdownRef}
            >
              {/* 🖼 If profile image exists → show image, else show first letter */}
              {getProfileImage() ? (
                <img
                  src={getProfileImage()}
                  alt="User"
                  className="rounded-circle me-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    border: "2px solid #eaeaea",
                  }}
                />
              ) : (
                <div
                  className="rounded-circle bg-green text-white d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <span className="fw-semibold me-1 text-grey">
                {user?.username || "User"}
              </span>
              <i className="bi bi-chevron-down"></i>
            </button>

            <ul
              className="dropdown-menu dropdown-menu-end shadow-sm"
              aria-labelledby="userDropdown"
              style={{"cursor":"pointer"}}
            >
              <li className="cursor-pointer" onClick={()=>{
                navigate("/profile")
              }}>
                <a className="dropdown-item">
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="cursor-pointer" onClick={handleLogout}>
                <a className="dropdown-item text-danger">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
