import React, { useRef, useState, useMemo } from "react";
import JoditEditor from "jodit-react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import "jodit/es2021/jodit.min.css";
import html2pdf from "html2pdf.js";


const AdvancedNoteEditor = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

    // Example tag options
  const tagOptions = [
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "important", label: "Important" },
    { value: "ideas", label: "Ideas" },
    { value: "secret", label: "Secret" },
  ];

    const handleSave = () => {
    console.log({
      title,
      content,
      tags: selectedTags.map(tag => tag.value),
    });
  };
  // changed: keep multiple active buttons as independent toggles
  const [activeBtns, setActiveBtns] = useState({
    pin: false,
    lock: false,
  });

  const handleBtnClick = (btnName) => {
    setActiveBtns((prev) => ({
      ...prev,
      [btnName]: !prev[btnName], // toggle the clicked button
    }));

    // You can add per-button logic here if needed:
    // if (btnName === "pin" && !activeBtns.pin) { /* pin enabled */ }
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
      "emoji",
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
      "align",
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
const exportToPDF = () => {
  const element = document.createElement("div");
  element.innerHTML = `
    <div style="font-family: Poppins, sans-serif; padding: 30px;">
      <h1 style="text-align:center; color:#333; border-bottom:1px solid #ddd; padding-bottom:10px;">
        ${title || "Untitled Note"}
      </h1>
      ${content}
    </div>
  `;

  const options = {
    margin: 0.5,
    filename: `${"note"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(options).from(element).save();
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
            onClick={handleSave}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedNoteEditor;
