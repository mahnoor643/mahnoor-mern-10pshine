import React, { useEffect, useState } from "react";
import * as bootstrap from "bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Sidebar from "../Dashboard/Sidebar";
import Navbar from "../Dashboard/Navbar";
import NotesCard from "./NotesCard";
import "../Notes/Notes.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SecretNoteCard from "../Locked/SecretNoteCard";
import AdvancedNoteEditor from "../CreateNotes/RichNoteEditor";


const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [password, setPassword] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  // 🆕 States for Search and Filter
const [searchQuery, setSearchQuery] = useState("");
const [selectedTag, setSelectedTag] = useState("All");


  const handleEdit = (note) => {
    setSelectedNote(note);
    const modalElement = document.getElementById("editModal");
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // 👈 changed here
      modal.show();
    } else {
      console.error("editModal not found in DOM");
    }
  };




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


  // 🆕 Unique Tags Extractor
const allTags = [
  "All",
  ...new Set(
    notes
      .flatMap((note) =>
        note.tags ? note.tags.split(",").map((t) => t.trim()) : []
      )
      .filter(Boolean)
  ),
];

// 🧩 Filtered + Searched Notes
const filteredNotes = notes.filter((note) => {
  const matchesSearch = note.title
    ?.toLowerCase()
    .includes(searchQuery.toLowerCase());
  const matchesTag =
    selectedTag === "All" ||
    (note.tags &&
      note.tags.split(",").map((t) => t.trim()).includes(selectedTag));
      
  return matchesSearch && matchesTag;
});

  // 🟡 Update Note Helper
  // const updateNote = async (noteId, updatedFields) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/notes/update/${noteId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(updatedFields),
  //     });

  //     if (response.ok) {
  //       setNotes((prev) =>
  //         prev.map((note) =>
  //           note.id === noteId ? { ...note, ...updatedFields } : note
  //         )
  //       );
  //     } else {
  //       const err = await response.json();
  //       console.error("Update failed:", err.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating note:", error);
  //   }
  // };

  // 🗃️ Archive / Unarchive Toggle
  const handleArchive = async (noteId, archived) => {
    try {
      // Immediately update UI for responsiveness
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, archived: archived ? 0 : 1 } : note
        )
      );

      // Then send update request to backend
      const response = await fetch(`http://localhost:5000/api/notes/update/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ archived: !archived }),
      });

      if (!response.ok) {
        // Revert if backend fails
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteId ? { ...note, archived: archived ? 1 : 0 } : note
          )
        );
        const err = await response.json();
        console.error("Update failed:", err.message);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };


  // 📌 Pin / Unpin Toggle
  const handlePin = async (noteId, pinned) => {
    try {
      // Optimistically update UI
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, pinned: pinned ? 0 : 1 } : note
        )
      );

      // Send update request to backend
      const response = await fetch(`http://localhost:5000/api/notes/update/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pinned: !pinned }),
      });

      if (!response.ok) {
        // Revert if backend fails
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === noteId ? { ...note, pinned: pinned ? 1 : 0 } : note
          )
        );
        const err = await response.json();
        console.error("Pin update failed:", err.message);
      }
    } catch (error) {
      console.error("Error updating pin:", error);
    }
  };



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


  // 🗑️ Delete Note
  const handleDelete = async (noteId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This note will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#09585f",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return; // same as old confirm() behavior

    try {
      const response = await fetch(`http://localhost:5000/api/notes/delete/${noteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        // Success alert
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your note has been deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        // Update your local notes state
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
      } else {
        const err = await response.json();
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: err.message || "Could not delete the note.",
        });
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while deleting the note.",
      });
    }
  };

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


{/* 🔍 Search + Filter Bar */}
<div className="d-flex justify-content-between align-items-center mb-4 gap-1">
  <div className="input-group">
    <span className="input-group-text bg-white border-end-0">
      <i className="bi bi-search text-muted"></i>
    </span>
    <input
      type="text"
      className=" p-3 border-0 rounded-end w-75"
      placeholder="Search notes by title..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  <div className="dropdown filter-btn-width bg-green rounded p-3 text-light">
    <button
      className="border-0 bg-green text-light dropdown-toggle d-flex align-items-center gap-2"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i className="bi bi-funnel-fill"></i>
      {selectedTag}
    </button>
    <ul className="dropdown-menu">
      {allTags.map((tag, index) => (
        <li key={index}>
          <button
            className={`dropdown-item select-filter ${selectedTag === tag ? "active-filter" : ""}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        </li>
      ))}
    </ul>
  </div>
</div>


            <div className="row g-4">
              {[...filteredNotes]
                .sort((a, b) => (b.pinned || 0) - (a.pinned || 0)) // 🧷 pinned first
                .map((note) =>
                  note.secured ? (
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

    </>
  );
};

export default Notes;
