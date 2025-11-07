import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = () => {
    const navigate = useNavigate();

  // Function to close the offcanvas after navigating
  const handleNavClick = (path) => {
    navigate(path);
    const offcanvasElement = document.getElementById("offcanvasSidebar");
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) offcanvas.hide();
  };


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

  return (
    <>
      {/* 🌿 Desktop Sidebar */}
      <aside
        className="col-lg-2 d-none d-lg-flex flex-column bg-light sidebar p-3 border-end"
        style={{ minHeight: "calc(100vh - 75px)" }} id="sidebar"
      >
        <ul className="nav flex-column mb-3">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link-green fw-bold d-flex custom-sidebar align-items-center ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <i className="bi bi-house icon-bold text-green me-2"></i>Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `nav-link-green fw-bold custom-sidebar d-flex align-items-center ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <i className="bi bi-plus-lg icon-bold text-green me-2"></i>Create Notes
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                `nav-link-green custom-sidebar fw-bold d-flex align-items-center ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <i className="bi bi-file-earmark-post icon-bold text-green me-2"></i>
              All Notes
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/archive"
              className={({ isActive }) =>
                `nav-link-green custom-sidebar fw-bold d-flex align-items-center ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <i className="bi bi-archive icon-bold text-green me-2"></i>Archive
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/locked"
              className={({ isActive }) =>
                `nav-link-green custom-sidebar fw-bold d-flex align-items-center ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <i className="bi bi-lock icon-bold text-green me-2"></i>Locked
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `nav-link-green custom-sidebar fw-bold d-flex align-items-center ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <i className="bi bi-person-circle icon-bold text-green me-2"></i>My Profile
            </NavLink>
          </li>
        </ul>

        <div className="mt-auto">
          <hr />
          <button
            className="btn btn-danger w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
            data-bs-toggle="modal"
            onClick={handleLogout}
            data-bs-target="#editorModal"
          >
            <i className="bi bi-box-arrow-right fw-bold"></i> Log Out
          </button>
        </div>
      </aside>

      {/* 📱 Mobile Offcanvas Sidebar */}
       <div
      className="offcanvas offcanvas-start"
      tabIndex="-1"
      id="offcanvasSidebar"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title fw-bold text-green">Menu</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>

      <div className="offcanvas-body d-flex flex-column justify-content-between p-3">
        <ul className="nav flex-column mb-3">
          <li>
            <button
              className="nav-link-green fw-bold d-flex align-items-center py-2 btn text-start w-100"
              onClick={() => handleNavClick("/dashboard")}
            >
              <i className="bi bi-house icon-bold text-green me-2"></i>
              Dashboard
            </button>
          </li>

          <li>
            <button
              className="nav-link-green fw-bold d-flex align-items-center py-2 btn text-start w-100"
              onClick={() => handleNavClick("/create")}
            >
              <i className="bi bi-plus-lg icon-bold text-green me-2"></i>
              Create Notes
            </button>
          </li>

          <li>
            <button
              className="nav-link-green fw-bold d-flex align-items-center py-2 btn text-start w-100"
              onClick={() => handleNavClick("/notes")}
            >
              <i className="bi bi-file-earmark-post icon-bold text-green me-2"></i>
              All Notes
            </button>
          </li>

          <li>
            <button
              className="nav-link-green fw-bold d-flex align-items-center py-2 btn text-start w-100"
              onClick={() => handleNavClick("/archive")}
            >
              <i className="bi bi-archive icon-bold text-green me-2"></i>
              Archive
            </button>
          </li>

          <li>
            <button
              className="nav-link-green fw-bold d-flex align-items-center py-2 btn text-start w-100"
              onClick={() => handleNavClick("/locked")}
            >
              <i className="bi bi-lock icon-bold text-green me-2"></i>
              Locked
            </button>
          </li>

          <li>
            <button
              className="nav-link-green fw-bold d-flex align-items-center py-2 btn text-start w-100"
              onClick={() => handleNavClick("/profile")}
            >
              <i className="bi bi-person-circle icon-bold text-green me-2"></i>
              My Profile
            </button>
          </li>
        </ul>

        <div>
          <hr />
          <button
            className="btn btn-danger w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
            data-bs-toggle="modal"
            onClick={handleLogout}
            data-bs-target="#editorModal"
          >
            <i className="bi bi-box-arrow-right fw-bold"></i> Log Out
          </button>
        </div>
      </div>
    </div>

      {/* 📝 Logout Modal */}
      {/* <div className="modal fade" id="editorModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Note editor</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form id="noteForm">
                <div className="mb-3">
                  <input className="form-control" id="noteTitle" placeholder="Title" />
                </div>
                <div className="mb-3">
                  <div className="editor" contentEditable="true" id="noteBody">
                    Start writing your note...
                  </div>
                </div>
                <div className="mb-3 d-flex gap-2">
                  <input
                    className="form-control w-auto"
                    placeholder="Add tags (comma separated)"
                    id="noteTags"
                  />
                  <select className="form-select w-auto" id="noteColor">
                    <option value="">Default</option>
                    <option value="yellow">Yellow</option>
                    <option value="green">Green</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-primary" id="saveNoteBtn">
                Save
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Sidebar;
