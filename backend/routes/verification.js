const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const verificationController = require("../controllers/verificationController");

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), verificationController.uploadDocument);
router.get("/:employee_id", verificationController.getDocuments);

module.exports = router;
