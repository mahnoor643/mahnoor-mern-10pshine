import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AdvancedNoteEditor from "../CreateNotes/RichNoteEditor";

const NotesModal = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className="container py-5 text-center">
      {/* 🟢 Open Modal Button */}
      <button
        type="button"
        className="btn btn-primary btn-lg"
        onClick={handleOpen}
        data-bs-toggle="modal"
        data-bs-target="#noteModal"
      >
        <i className="bi bi-plus-circle me-2"></i> Create New Note
      </button>

      {/* 🟡 Bootstrap Modal */}
      <div
        className="modal fade"
        id="noteModal"
        tabIndex="-1"
        aria-labelledby="noteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-semibold" id="noteModalLabel">
                ✨ Create / Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              {/* 📝 Note Editor Component */}
              <AdvancedNoteEditor />
            </div>

            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
