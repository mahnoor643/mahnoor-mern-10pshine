import { NavLink } from "react-router-dom";
import React from 'react'

const Sidebar = () => {
  return (
    <>
    <aside className="col-lg-2 d-none d-lg-flex flex-column bg-light sidebar p-3 border-end" style={{ height: "calc(100vh - 75px)", top: "70px", height: "auto" }}>
      <ul className="nav flex-column mb-3">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link-green fw-bold d-flex custom-sidebar align-items-center ${isActive ? "active-link" : ""}`
            }
          >
            <i className="bi bi-house icon-bold text-green me-2"></i>Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `nav-link-green fw-bold custom-sidebar d-flex align-items-center ${isActive ? "active-link" : ""}`
            }
          >
            <i className="bi bi-plus-lg icon-bold text-green me-2"></i>Create Notes
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `nav-link-green custom-sidebar fw-bold d-flex align-items-center ${isActive ? "active-link" : ""}`
            }
          >
            <i className="bi bi-file-earmark-post icon-bold text-green me-2"></i>All Notes
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/archive"
            className={({ isActive }) =>
              `nav-link-green custom-sidebar fw-bold d-flex align-items-center ${isActive ? "active-link" : ""}`
            }
          >
            <i className="bi bi-archive icon-bold text-green me-2"></i>Archive
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/locked"
            className={({ isActive }) =>
              `nav-link-green custom-sidebar fw-bold d-flex align-items-center ${isActive ? "active-link" : ""}`
            }
          >
            <i className="bi bi-lock icon-bold text-green me-2"></i>Locked
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link-green custom-sidebar fw-bold d-flex align-items-center ${isActive ? "active-link" : ""}`
            }
          >
            <i className="bi bi-person-circle icon-bold text-green me-2"></i>My Profile
          </NavLink>
        </li>
      </ul>


      <div className="mt-auto">
        <hr />
        <button className="btn btn-danger w-100" data-bs-toggle="modal" data-bs-target="#editorModal"><i className="bi bi-box-arrow-right fw-bold me-2"></i>Log Out</button>
      </div>
    </aside>

    <div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvasSidebar">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Menu</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">
                    <button className="btn btn-primary w-100 mb-3" data-bs-toggle="modal" data-bs-target="#editorModal">+ New Note</button>
                    <ul className="nav flex-column">
                        <li className="nav-item"><a className="nav-link"><i className="bi bi-house text-dark"></i>Dashboard</a></li>
                        <li className="nav-item"><a className="nav-link">All notes</a></li>
                        <li className="nav-item"><a className="nav-link">Archive</a></li>
                        <li className="nav-item"><a className="nav-link">Locked</a></li>
                        <li className="nav-item"><a className="nav-link">My Profile</a></li>
                    </ul>
                </div>
            </div>

            <div className="modal fade" id="editorModal" tabindex="-1">
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
                                    <div className="editor" contenteditable="true" id="noteBody">Start writing your note...</div>
                                </div>
                                <div className="mb-3 d-flex gap-2">
                                    <input className="form-control w-auto" placeholder="Add tags (comma separated)" id="noteTags" />
                                    <select className="form-select w-auto" id="noteColor">
                                        <option value="">Default</option>
                                        <option value="yellow">Yellow</option>
                                        <option value="green">Green</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button className="btn btn-primary" id="saveNoteBtn">Save</button>
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Sidebar