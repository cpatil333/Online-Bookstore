import multer from "multer";
import express from "express";
import path from "path";

const router = express.Router();

const uploadPath = path.join(process.cwd(), "src", "uploads");

console.log(uploadPath);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // correct key is `destination`, not `diskStorage`
  },
  filename: (req, file, cb) => {
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
