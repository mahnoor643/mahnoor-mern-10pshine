import React, { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Sidebar from "../Dashboard/Sidebar";
import Navbar from "../Dashboard/Navbar";
import "./Locked.css"
import SecretNoteCard from "../Locked/SecretNoteCard";
import AdvancedNoteEditor from "../CreateNotes/RichNoteEditor";
import useNoteActions from "../../hooks/useNoteActions";


const Locked = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");



  // 🟢 Fetch only locked notes
  const fetchLockedNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        // ✅ Filter only secured notes
        const lockedNotes = data.filter(note => note.secured === 1);
        setNotes(lockedNotes);
      } else {
        console.error("Error fetching notes:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockedNotes();
  }, []);

    const { selectedNote, handleEdit, handlePin, handleArchive, handleDelete } =
  useNoteActions(token, setNotes, fetchLockedNotes);
  
  if (loading) return <p className="text-center mt-5">Loading locked notes...</p>;

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-lg-10 col-12 p-4" style={{ minHeight: "calc(100vh - 75px)" }}>
            <div className="row g-4">
              {notes.length === 0 ? (
                <p className="text-center text-muted mt-5">No locked notes found.</p>
              ) : (
                [...notes]
                  .sort((a, b) => (b.pinned || 0) - (a.pinned || 0))
                  .map(note => (
                    <div className="col-lg-4 col-md-6 col-12" key={note.id}>
                      <SecretNoteCard
                        id={note.id}
                        title={note.title || "Secret Note"}
                        content={note.note}
                        tags={note.tags ? note.tags.split(",") : []}
                        created={new Date(note.created_at).toLocaleString()}
                        updated={new Date(note.updated_at).toLocaleString()}
                        passwordHash={note.password}
                        onEdit={() => handleEdit(note)}
                        onDelete={() => handleDelete(note.id)}
                        onArchive={() => handleArchive(note.id, note.archived === 1)}
                        onUnarchive={() => handleArchive(note.id, note.archived === 1)}
                        onPin={() => handlePin(note.id, note.pinned === 1)}
                      />
                    </div>
                  ))
              )}
            </div>
          </main>
        </div>
      </div>

      {/* ✏️ Edit Note Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold text-dark" id="editModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-0">
              <AdvancedNoteEditor
                mode="edit"
                selectedNote={selectedNote}
                onUpdate={fetchLockedNotes}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer />
    </>
  );
};

export default Locked;
