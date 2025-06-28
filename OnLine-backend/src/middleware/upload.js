import multer from "multer";
import express from "express";

const router = express.Router();

const storage = multer.diskStorage({
  diskStorage: (req, file, db) => {
    cb(null, "uploads/");
  },
  filename: (req, file, db) => {
    const uniqueFile = Date.now() + "-" + file.originalname;
    cb(null, uniqueFile);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({ filename: req.file.filename });
  } else {
    res.status(400).json({ Error: "No file uploaded!" });
  }
});

export default router;