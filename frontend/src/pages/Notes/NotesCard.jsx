import React from 'react'
import * as bootstrap from "bootstrap";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoteViewModal from "../Locked/NoteViewModal";


const NotesCard = ({
    id,
    title,
    content,
    tags = [],
    onEdit,
    onDelete,
    onArchive,
    onLock,
    onPin,
    created,
    updated,
    isLocked,
    isArchived,
    isPinned,
    showActions = true,
}) => {

    const [showNoteView, setShowNoteView] = useState(false);
const [fullNote, setFullNote] = useState(null);

const handleView = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
  const data = await response.json();

  setFullNote({
    id: data.id,
    title: data.title || "Untitled Note",
    content: data.note || "<p>No content</p>",
    created: data.created_at
      ? new Date(data.created_at).toLocaleString()
      : "Unknown",
    updated: data.updated_at
      ? new Date(data.updated_at).toLocaleString()
      : "Unknown",
    archived: data.archived,
    pinned: data.pinned,
  });

  setShowNoteView(true);
} else if (response.status === 401) {
  toast.error("Unauthorized: Please log in again.");
} else {
  toast.error("Failed to load note details!");
}

  } catch (err) {
    console.error("Error fetching note:", err);
    toast.error("Unexpected error fetching note.", { /* same style */ });
  }
};

    return (
       <>
        <div className="card note-card p-3 h-100 shadow-sm border-0"
        onClick={handleView}
        >
            {/* Header */}
            <div className="note-header mb-3 d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                    <h6 className="note-title text-truncate fw-semibold mb-2">{title}</h6>

                    {/* Tags */}
                    <div className="d-flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                            <span key={index} className="badge note-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Icons */}
                {showActions && (
                    <div className="d-flex align-items-center gap-2 ms-2"
                    onClick={(e) => e.stopPropagation()}
                    >

                    {/* pin / unpin */}
                    {!isPinned ? (
                        <i
                            className="bi bi-pin text-secondary cursor-pointer small"
                            title="Pin this note"
                            role="button"
                            onClick={onPin}
                        ></i>
                    ) : (
                        <i
                            className="bi bi-pin-angle-fill text-secondary cursor-pointer small"
                            title="Unpin this note"
                            role="button"
                            onClick={onPin}
                        ></i>
                    )}


                    {/* 🔒 Lock / Unlock */}
                    {!isLocked ? (
                        <i
                            className="bi bi-lock text-secondary cursor-pointer small"
                            onClick={onLock}
                            title="Secure this note"
                            role="button"
                        ></i>
                    ) : (
                        <i
                            className="bi bi-unlock text-secondary small"
                            title="This note is secured"
                            role="button"
                        ></i>
                    )}

                    {/* 🗃️ Archive / Unarchive */}
                    <i
                        className={`bi ${isArchived ? "bi-archive-fill" : "bi-archive"} text-secondary cursor-pointer small`}
                        onClick={onArchive}
                        title={isArchived ? "Unarchive Note" : "Archive Note"}
                        role="button"
                    ></i>

                    {/* ✏️ Edit */}
                    <i
                        className="bi bi-pencil text-warning cursor-pointer small"
                        onClick={onEdit}
                        title="Edit Note"
                        role="button"
                    ></i>

                    {/* 🗑️ Delete */}
                    <i
                        className="bi bi-trash text-danger cursor-pointer small"
                        onClick={onDelete}
                        title="Delete Note"
                        role="button"
                    ></i>
                </div>
                )}
            </div>

            {/* Content Preview */}
            <div
                className="note-preview mb-3"
                dangerouslySetInnerHTML={{ __html: content }}
            ></div>

            {/* Footer */}
            <div className="note-footer small text-muted mt-auto">
                <div>Created: {created}</div>
                <div>Updated: {updated}</div>
            </div>

            

        </div>


        {fullNote && (
  <NoteViewModal
  show={showNoteView}
  onClose={() => setShowNoteView(false)}
  note={fullNote}
  onEdit={(note) => onEdit(note)}
  onDelete={onDelete}
  onArchive={() => onArchive(id, isArchived === 1)}
  onUnarchive={() => onArchive(id, isArchived === 1)}
  onPin={() => onPin(id, isPinned === 1)}
/>

)}
<ToastContainer />
       </>
    );
};

export default NotesCard;
