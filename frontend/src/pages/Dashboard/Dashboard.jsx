import React, { useEffect, useState } from 'react';
import "../Dashboard/Dashboard.css";
import * as bootstrap from "bootstrap";
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useNavigate } from "react-router-dom";
import NotesCard from "../Notes/NotesCard";
import SecretNoteCard from "../Locked/SecretNoteCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../Notes/Notes.css";
import AdvancedNoteEditor from "../CreateNotes/RichNoteEditor";
import useNoteActions from '../../hooks/useNoteActions';


const Dashboard = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notes/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setNotes(data);
        } else {
          console.error("Failed to load notes:", data.message);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  // 🧮 Calculate totals
  const totalNotes = notes.length;
  const lockedNotes = notes.filter(note => note.secured === 1).length;
  const archivedNotes = notes.filter(note => note.archived === 1).length;
  



  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [password, setPassword] = useState("");



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

    const { selectedNote, handleEdit, handlePin, handleArchive, handleDelete } = useNoteActions(token, setNotes, fetchNotesAgain);



  if (loading) return <p>Loading notes...</p>;

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <main className="col-lg-10 col-12 p-4" style={{ minHeight: "calc(100vh - 75px)" }}>
            <div className="container-fluid bg-light p-5 rounded shadow-sm">
              {/* 🏠 Dashboard Header */}
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="fw-bold mb-0 text-green">Welcome to Noteverse</h1>
                  <p className="text-muted mb-0">
                    Your personal space to create, lock, and organize notes.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/create")}
                  className="btn green-btn w-auto d-flex align-items-center gap-2 mt-3 mt-sm-0"
                >
                  <i className="bi bi-plus-lg"></i> Create New Note
                </button>
              </div>

              {/* 📊 Stats Section */}
              <div className="row g-3 mb-5">
                <div className="col-md-4 col-sm-6">
                  <div className="card bg-card shadow-sm border-0 text-center p-4 h-100">
                    <i className="bi bi-journal-text fs-2 text-primary mb-2"></i>
                    <h6 className="fw-semibold mb-0">Total Notes</h6>
                    <p className="text-muted small mb-0">
                      {loading ? "Loading..." : `${totalNotes} Notes`}
                    </p>
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="card bg-card shadow-sm border-0 text-center p-4 h-100">
                    <i className="bi bi-lock-fill fs-2 text-danger mb-2"></i>
                    <h6 className="fw-semibold mb-0">Locked Notes</h6>
                    <p className="text-muted small mb-0">
                      {loading ? "Loading..." : `${lockedNotes} Secured`}
                    </p>
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="card bg-card shadow-sm border-0 text-center p-4 h-100">
                    <i className="bi bi-archive-fill fs-2 text-secondary mb-2"></i>
                    <h6 className="fw-semibold mb-0">Archived Notes</h6>
                    <p className="text-muted small mb-0">
                      {loading ? "Loading..." : `${archivedNotes} Archived`}
                    </p>
                  </div>
                </div>
              </div>

              {/* 📝 Recent Notes Section */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold mb-0">Recent Notes</h5>
                <button
                  onClick={() => navigate("/notes")}
                  className="btn btn-link text-green fw-semibold text-decoration-none p-0"
                >
                  View All <i className="bi bi-arrow-right"></i>
                </button>
              </div>

              {/* 🧾 Last 3 Notes */}
              <div className="row g-4">
                {[...notes].slice(-3).reverse().map((note) => (
                  <div key={note.id} className="col-lg-4 col-md-6 col-12">
                    {note.secured ? (
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

                    ) : (
                      <NotesCard
  id={note.id}
  title={note.title}
  content={note.note}
  tags={note.tags ? note.tags.split(",") : []}
  created={new Date(note.created_at).toLocaleString()}
  updated={new Date(note.updated_at).toLocaleString()}
  isLocked={note.secured === 1}
  isArchived={note.archived === 1}
  isPinned={note.pinned === 1}
  onLock={() => handleLock(note.id)}
  onPin={() => handlePin(note.id, note.pinned === 1)}
  onArchive={() => handleArchive(note.id, note.archived === 1)}
  onEdit={() => handleEdit(note)}
  onDelete={() => handleDelete(note.id)}
  showActions={true}
/>

                    )}
                  </div>
                ))}

                {/* If no notes */}
                {!loading && notes.length === 0 && (
                  <p className="text-muted text-center mt-3">No notes yet.</p>
                )}
              </div>
            </div>
          </main>
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
                className="inactive-state w-25"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="green-btn w-50"
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
      </div>
      
    </>
  );
};

export default Dashboard;
