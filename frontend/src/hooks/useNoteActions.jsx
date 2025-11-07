import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";

const useNoteActions = (token, setNotes, fetchNotesAgain) => {
          const [selectedNote, setSelectedNote] = useState(null);

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

  return {
    selectedNote,
    handleEdit,
    handlePin,
    handleArchive,
    handleDelete,
  };
}

export default useNoteActions