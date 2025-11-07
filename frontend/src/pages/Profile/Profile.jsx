import React, { useState, useEffect } from 'react';
import axios from "axios";
import * as bootstrap from "bootstrap";
import Sidebar from '../Dashboard/Sidebar';
import Navbar from '../Dashboard/Navbar';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Profile/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  
  const [profilePic, setProfilePic] = useState("Images/profile.jpg");
  const [previewPic, setPreviewPic] = useState(profilePic);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 Password visibility

  // 🖼 Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 💾 Save updates
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (previewPic !== profilePic && previewPic.startsWith("data:image")) {
        const blob = await fetch(previewPic).then(res => res.blob());
        formData.append("profileImage", blob, "profile.jpg"); // backend expects profileImage
      }

      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/api/auth/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setProfilePic(previewPic);
        toast.success("Profile updated successfully!", {
                        position: "top-center",
                        autoClose: 2500,
                        style: {
                            background: "#09585f",
                            color: "#fff",
                            borderRadius: "10px",
                        },
                    });

        const modal = bootstrap.Modal.getInstance(document.getElementById("updateProfileModal"));
        modal.hide();
        window.location.reload();
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong while updating your profile.", {
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

  // 🔄 Fetch user data on mount
useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = response.data;
      setUsername(user.username);
      setEmail(user.email);

      // 🧠 Important fix:
      const imgPath = user.profileImage
        ? user.profileImage.startsWith("http")
          ? user.profileImage
          : `http://localhost:5000${user.profileImage}`
        : "Images/profile.jpg";

      setProfilePic(imgPath);
      setPreviewPic(imgPath);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  fetchUser();
}, []);


  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-lg-10 col-12 p-4" style={{ minHeight: "calc(100vh - 75px)" }}>
            <div className="container py-4">
              {/* 👤 Profile Card */}
              <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                <div className="d-flex flex-wrap align-items-center gap-4">
                  <div className="position-relative">
                    <img
  src={
    profilePic.startsWith("http")
      ? profilePic // already full URL
      : profilePic.startsWith("/uploads/")
      ? `http://localhost:5000${profilePic}` // backend upload path
      : `/${profilePic}` // local public image (e.g., Images/profile.jpg)
  }
  alt="Profile"
  className="rounded-circle border border-3 border-light shadow-sm"
  width="120"
  height="120"
  onError={(e) => (e.target.src = "/Images/profile.jpg")} // fallback
/>


                  </div>
                  <div className="flex-grow-1">
                    <h4 className="fw-bold mb-1 text-dark">{username}</h4>
                    <p className="text-muted mb-1">
                      <i className="bi bi-envelope me-2"></i>
                      {email}
                    </p>
                    <p className="text-muted mb-0">
                      <i className="bi bi-lock me-2"></i>••••••••••
                    </p>
                  </div>
                  <div>
                    <button
                      className="green-btn d-flex align-items-center gap-2"
                      data-bs-toggle="modal"
                      data-bs-target="#updateProfileModal"
                    >
                      <i className="bi bi-pencil"></i> Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 🔒 Update Profile Modal */}
            <div
              className="modal fade"
              id="updateProfileModal"
              tabIndex="-1"
              aria-labelledby="updateProfileModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-sm rounded-4">
                  <div className="modal-header border-0">
                    <h5 className="modal-title fw-semibold" id="updateProfileModalLabel">
                      Update Profile
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="modal-body">
                    {/* 🖼 Image Upload + Preview */}
                    <div className="text-center mb-3">
                      <img
  src={previewPic.startsWith("data:image") ? previewPic : previewPic}
  alt="Preview"
  className="rounded-circle shadow-sm border"
  width="100"
  height="100"
/>

                      <div className="mt-2">
                        <label className="custom-cancel-btn w-50">
                          <i className="bi bi-upload me-1"></i> Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>

                    {/* 🧾 Form Fields */}
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="mb-3 position-relative">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          data-testid="new-pwd"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <i
                          className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} position-absolute`}
                          style={{ top: "52px", right: "10px", cursor: "pointer" }}
                          onClick={() => setShowPassword(!showPassword)}
                        ></i>
                      </div>
                    </form>
                  </div>

                  <div className="modal-footer border-0">
                    <button
                      type="button"
                      className="custom-cancel-btn"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="button" className="custom-green-btn" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
