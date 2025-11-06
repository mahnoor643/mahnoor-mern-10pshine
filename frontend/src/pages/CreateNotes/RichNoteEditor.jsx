import React, { useRef, useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import "jodit/es2021/jodit.min.css";
import html2pdf from "html2pdf.js";


const AdvancedNoteEditor = ({ selectedNote = null, mode = "create", onUpdate }) => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const [selectedTags, setSelectedTags] = useState([]);
  const [password, setPassword] = useState("");
  const [secretPwdError, setSecretPwdError] = useState({});


  // Example tag options
  const tagOptions = [
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "important", label: "Important" },
    { value: "ideas", label: "Ideas" },
    { value: "secret", label: "Secret" },
  ];

  useEffect(() => {
    if (mode === "edit" && selectedNote) {
      setTitle(selectedNote.title || "");
      setContent(selectedNote.note || "");
      setSelectedTags(
        selectedNote.tags
          ? selectedNote.tags.split(",").map((tag) => ({ value: tag, label: tag }))
          : []
      );
      setActiveBtns({
        pin: selectedNote.pinned || false,
        lock: selectedNote.secured || false,
      });
      setPassword("");

      if (editorRef.current) {
        editorRef.current.value = selectedNote.note || "";
      }
    } else if (mode === "create") {
      setTitle("");
      setContent("");
      setSelectedTags([]);
      setActiveBtns({ pin: false, lock: false });
      setPassword("");

      if (editorRef.current) {
        editorRef.current.value = "";
      }
    }
  }, [selectedNote, mode]);



  const validatePassword = (pwd) => {
    if (!pwd) return "Password is required";
    if (pwd.length < 4) return "Password must be at least 4 characters long";
    if (pwd.length > 12) return "Password must not exceed 12 characters";
    return "";
  };

  // changed: keep multiple active buttons as independent toggles
  const [activeBtns, setActiveBtns] = useState({
    pin: false,
    lock: false,
  });

  const handleBtnClick = (btnName) => {
    setActiveBtns((prev) => {
      const updated = { ...prev, [btnName]: !prev[btnName] };
      setSecretPwdError("");
      // reset password when lock disabled
      if (btnName === "lock" && prev.lock) setPassword("");
      return updated;
    });
  };


  // ✨ Jodit Editor Configuration
  const config = useMemo(
    () => ({
      readonly: false,
      height: 500,
      toolbarSticky: true,
      showXPathInStatusbar: false,
      toolbarAdaptive: false,
      toolbarButtonSize: "middle",

      // ✅ Enable all built-in plugins
      extraPlugins: [
        "print",
        "copyformat",
        "table",
        "video",
        "media",
        "link",
        "spellcheck",
        "preview",
        "search",
        "color",
      ],

      // ✅ Enable image and file handling
      uploader: {
        insertImageAsBase64URI: true,
      },

      // ✅ Enable file browser
      filebrowser: {
        ajax: {
          url: "https://xdsoft.net/jodit/finder/",
        },
        createNewFolder: true,
        showPreview: true,
      },

      buttons: [
        // 🔤 Basic Formatting
        "bold", "italic", "underline", "strikethrough", "superscript", "subscript", "|",

        // 🧾 Lists and Indentations
        "ul", "ol", "outdent", "indent", "|",

        // ✏️ Text & Font Controls
        "font", "fontsize", "brush", "paragraph", "lineHeight", "textcolor", "background", "|",

        // 📎 Insert Options
        "link", "image", "file", "video", "table", "iframe", "|",

        // 🧭 Alignment & Blocks
        "align", "cut", "copy", "paste", "selectall", "|",

        // 🪄 Elements & Decorations
        "hr", "emoji", "symbol", "copyformat", "preview", "|",

        // 🔁 History
        "undo", "redo", "|",

        // 📄 Document Controls
        "print", "spellcheck", "find", "cleanup", "|",

        // 🧰 Advanced
        "fullsize", "source", "code", "about",
      ],

      style: {
        fontFamily: "Poppins, sans-serif",
        fontSize: "15px",
      },
    }),
    []
  );


  // 🧾 Export Note as PDF
  // 🧾 Export Note as PDF (Improved Professional Version)
  const exportToPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `
    <div style="
      font-family: 'Poppins', sans-serif;
      padding: 40px 50px;
      max-width: 700px;
      margin: auto;
      line-height: 1.7;
      color: #222;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 0 8px rgba(0,0,0,0.08);
    ">
      <h1 style="
        text-align: center;
        font-size: 26px;
        margin-bottom: 25px;
        color: #0b3d91;
        border-bottom: 2px solid #ccc;
        padding-bottom: 10px;
      ">
        ${title || "Untitled Note"}
      </h1>
      <div style="font-size: 15px; text-align: justify;">
        ${content}
      </div>
      <div style="margin-top: 30px; font-size: 13px; color: #666; text-align: right;">
        <em>Template by MahnoorTariq</em>
      </div>
    </div>
  `;

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right (in inches)
      filename: `${title ? title.replace(/\s+/g, "_") : "note"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(options).from(element).save();
  };


  const createNoteAPI = async () => {
    try {
      if (activeBtns.lock) {
        const errorMsg = validatePassword(password);
        if (errorMsg) {
          setSecretPwdError({ password: errorMsg });
          return;
        }
      }
      // Get the JWT token (you must have stored it at login time)
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- include token for authentication
        },
        body: JSON.stringify({
          title,
          note: content,
          pinned: activeBtns.pin,
          secured: activeBtns.lock,
          password: activeBtns.lock ? password : null,
          archived: false,
          tags: selectedTags.map((tag) => tag.value).join(","),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Note created successfully!", {
          position: "top-center",
          autoClose: 2500,
          style: {
            background: "#09585f",
            color: "#fff",
            borderRadius: "10px",
          },
        });
        console.log(data);
        // Optional: clear form
        setTitle("");
        setContent("");
        setSelectedTags([]);
        setPassword("");
        setActiveBtns({ pin: false, lock: false });
      } else {
        toast.error(`❌ Failed: ${data.message || "Something went wrong"}`, {
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
      console.error("Error creating note:", error);
      toast.error("An unexpected error occurred!", {
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

  // 🟡 Update Existing Note
  const updateNoteAPI = async () => {
    try {
      if (activeBtns.lock) {
        const errorMsg = validatePassword(password);
        if (errorMsg) {
          setSecretPwdError({ password: errorMsg });
          return;
        }
      }

      const response = await fetch(`http://localhost:5000/api/notes/update/${selectedNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          note: content,
          pinned: activeBtns.pin,
          secured: activeBtns.lock,
          password: activeBtns.lock ? password : null,
          archived: false,
          tags: selectedTags.map((tag) => tag.value).join(","),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Note updated successfully!", {
          position: "top-center",
          autoClose: 2500,
          style: {
            background: "#09585f",
            color: "#fff",
            borderRadius: "10px",
          },
        });
        if (onUpdate) onUpdate(); // 🔁 Refresh parent Notes list

        // Close modal manually after update
        const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        if (modal) modal.hide();
        if (onUpdate) onUpdate();
        setTitle("");
        setContent("");
        setSelectedTags([]);
        setActiveBtns({ pin: false, lock: false });

      } else {
        toast.error(`❌ Update failed: ${data.message || "Something went wrong"}`, {
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
      console.error("Error updating note:", error);
      toast.error("❌ An unexpected error occurred!", {
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

  return (
    <div className="container-fluid p-4" style={{ maxWidth: 900 }}>
      <div className="bg-white p-4 rounded-4 shadow-sm border">
        {/* 🏷️ Title Input */}
        <div className="row">
          <div className="d-flex align-items-center gap-2 justify-content-end">
            <button
              type="button"
              className={`export-pdf-btn ${activeBtns.pin ? "active-icon-btn" : ""}`}
              onClick={() => handleBtnClick("pin")}
              aria-pressed={activeBtns.pin}
              title={activeBtns.pin ? "Pinned" : "Pin"}
            >
              <i className="bi bi-pin-angle"></i>
            </button>

            <button
              type="button"
              className={`export-pdf-btn ${activeBtns.lock ? "active-icon-btn" : ""}`}
              onClick={() => handleBtnClick("lock")}
              aria-pressed={activeBtns.lock}
              title={activeBtns.lock ? "Locked" : "Lock"}
            >
              <i className="bi bi-lock-fill"></i>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter note title..."
            className="form-control form-control-lg rounded-3 shadow-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>


        {/* 🔒 Password Field (visible only when locked) */}
        {activeBtns.lock && (
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">Set Password:</label>
            <input
              type="password"
              placeholder="Enter a password to secure this note..."
              className={`form-control rounded-3 shadow-sm ${secretPwdError.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);

                const errorMsg = validatePassword(value);
                setSecretPwdError({ password: errorMsg });
              }}
            />

            {secretPwdError.password && (
              <div className="invalid-feedback text-start text-small">
                {secretPwdError.password}
              </div>
            )}

          </div>
        )}


        {/* Tag selector */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">Tags:</label>
          <Select
            isMulti
            name="tags"
            options={tagOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select or type tags..."
            value={selectedTags}
            onChange={setSelectedTags}
          />
        </div>

        {/* 📝 Jodit Editor */}
        <JoditEditor
          key={selectedNote ? selectedNote.id : "new"}
          ref={editorRef}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
        />

        {/* 💾 Action Buttons */}
        <div className="d-flex justify-content-end mt-4 gap-3 flex-wrap">
          <button
            className="clear-btn"
            onClick={() => {
              setTitle("");
              setContent("");
            }}
          >
            Clear
          </button>
          <button
            className="export-pdf-btn"
            onClick={exportToPDF}
          >
            Export PDF
          </button>
          <button
            className="save-note-btn"
            onClick={mode === "edit" ? updateNoteAPI : createNoteAPI}
          >
            {mode === "edit" ? "Update Note" : "Save Note"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdvancedNoteEditor;
