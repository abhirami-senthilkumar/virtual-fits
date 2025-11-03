import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Handle POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ imageUrl: fileUrl });
});

export default router;
