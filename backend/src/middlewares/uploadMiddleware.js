import multer from "multer";
import path from "path";
import fs from "fs";

// absolute uploads folder path
const uploadDir = path.resolve("uploads");

// ensure uploads folder exists (auto-create if missing)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 'uploads' folder created automatically!");
}

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // always use absolute path
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// file type filter (only allow images)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG and PNG files are allowed!"));
};

const upload = multer({ storage, fileFilter });

export default upload;
