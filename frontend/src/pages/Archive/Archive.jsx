import React, { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Sidebar from "../Dashboard/Sidebar";
import Navbar from "../Dashboard/Navbar";
import NotesCard from "../Notes/NotesCard";
import "../Notes/Notes.css";
import SecretNoteCard from "../Locked/SecretNoteCard";
import AdvancedNoteEditor from "../CreateNotes/RichNoteEditor";
import useNoteActions from "../../hooks/useNoteActions";


const Archive = () => {

    const [notes, setNotes] = useState([]);
      const [loading, setLoading] = useState(true);
      const [selectedNoteId, setSelectedNoteId] = useState(null);
      const [password, setPassword] = useState("");
    
      const token = localStorage.getItem("token");


    
      // 🟢 Fetch Notes
      const fetchNotesAgain = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/notes/my", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) setNotes(data);
          else console.error("Error fetching notes:", data.message);
        } catch (error) {
          console.error("Error fetching notes:", error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchNotesAgain();
      }, []);
    
    
      // 🔒 Lock Modal Trigger
      const handleLock = (noteId) => {
        setSelectedNoteId(noteId);
        setPassword("");
        const modal = new bootstrap.Modal(
          document.getElementById("lockModal")
        );
        modal.show();
      };
    
      // 🔒 Confirm Lock
      const confirmLock = async () => {
        if (!password) return toast.error("Please enter a password!", {
          position: "top-center",
          autoClose: 2500,
          style: {
            background: "#09585f",
            color: "#fff",
            borderRadius: "10px",
          },
        });;
        if (!selectedNoteId) return toast.error("No note selected!", {
          position: "top-center",
          autoClose: 2500,
          style: {
            background: "#09585f",
            color: "#fff",
            borderRadius: "10px",
          },
        });;
    
        try {
          const response = await fetch(`http://localhost:5000/api/notes/update/${selectedNoteId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ secured: true, password }),
          });
    
          if (response.ok) {
            // ✅ Update UI instantly
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === selectedNoteId
                  ? { ...note, secured: true, password }
                  : note
              )
            );
    
            // ✅ Close modal
            const modal = bootstrap.Modal.getInstance(
              document.getElementById("lockModal")
            );
            modal.hide();
    
            toast.success("Note secured successfully!", {
              position: "top-center",
              autoClose: 2500,
              style: {
                background: "#09585f",
                color: "#fff",
                borderRadius: "10px",
              },
            });
          } else {
            const err = await response.json();
            console.error("Lock failed:", err.message);
            toast.error("Failed to secure note. Try again!", {
              position: "top-center",
              autoClose: 2500,
              style: {
                background: "#09585f",
                color: "#fff",
                borderRadius: "10px",
              },
            });
          }
        } catch (error) {
          console.error("Error securing note:", error);
        }
      };
    
          const { selectedNote, handleEdit, handlePin, handleArchive, handleDelete } =
  useNoteActions(token, setNotes, fetchNotesAgain);

    
      if (loading) return <p>Loading notes...</p>;
    
  return (
     <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main
            className="col-lg-10 col-12 p-4"
            style={{ minHeight: "calc(100vh - 75px)" }}
          >
            <div className="row g-4">
              {[...notes]
  .filter((note) => note.archived === 1) // 🧾 only archived notes
  .sort((a, b) => (b.pinned || 0) - (a.pinned || 0))
  .map((note) =>
                  note.secured ? (
                    <div className="col-lg-4 col-md-6 col-12" key={note.id}>
                      <SecretNoteCard
          id={note.id}
          title={note.title || "Secret Note"}
          tags={note.tags ? note.tags.split(",") : []}
          content={note.note}
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
                  ) : (
                    <div className="col-lg-4 col-md-6 col-12" key={note.id}>
                      <NotesCard
                                            id={note.id}
                        title={note.title}
                        content={note.note}
                        tags={note.tags ? note.tags.split(",") : []}
                        created={new Date(
                          note.created_at
                        ).toLocaleString()}
                        updated={new Date(
                          note.updated_at
                        ).toLocaleString()}
                        isLocked={note.secured === 1}
                        isArchived={note.archived === 1}
                        isPinned={note.pinned === 1}
                        onLock={() => handleLock(note.id)}
                        onPin={() => handlePin(note.id, note.pinned === 1)}
                        onArchive={() =>
                          handleArchive(note.id, note.archived === 1)
                        }
                        onEdit={() => handleEdit(note)}
                        onDelete={() => handleDelete(note.id)}
                      />
                    </div>
                  )
                )}
            </div>
          </main>
        </div>
      </div>

      {/* 🔒 Lock Password Modal */}
      <div
        className="modal fade"
        id="lockModal"
        tabIndex="-1"
        aria-labelledby="lockModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title" id="lockModalLabel">
                Secure This Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label className="form-label">Enter Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password (4–12 characters)"
                value={password}
                minLength={4}
                maxLength={12}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={confirmLock}
              >
                Lock Note
              </button>
            </div>
          </div>
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
              {/* 🔥 Rich Editor will be placed here */}
              <AdvancedNoteEditor mode="edit" selectedNote={selectedNote} onUpdate={fetchNotesAgain} />
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Archive