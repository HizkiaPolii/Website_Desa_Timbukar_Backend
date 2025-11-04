import { Router } from "express";
import { uploadApbdes, uploadGaleri } from "../config/multer.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const router = Router();
// Configure storage for PDF (RKP Desa)
const pdfDir = path.join(process.cwd(), "uploads", "rkpdesa");
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}
const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pdfDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});
// Filter for PDF only
const pdfFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    }
    else {
        cb(new Error("Hanya file PDF yang diizinkan"));
    }
};
const uploadPDF = multer({
    storage: pdfStorage,
    fileFilter: pdfFilter,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for PDF
});
/**
 * POST /api/upload
 * Upload file gambar ke folder yang ditentukan (apbdes, galeri, pemerintahan, bumdes, general)
 * Body: file (multipart), folder (apbdes|galeri|pemerintahan|bumdes|general)
 */
router.post("/", (req, res, next) => {
    const folder = req.query.folder;
    // Validate folder
    const allowedFolders = [
        "apbdes",
        "galeri",
        "pemerintahan",
        "bumdes",
        "general",
    ];
    if (!folder || !allowedFolders.includes(folder)) {
        return res.status(400).json({
            error: "Folder tidak valid",
            message: `Folder harus salah satu dari: ${allowedFolders.join(", ")}`,
        });
    }
    // Use different upload handlers based on folder
    const uploadHandler = folder === "galeri"
        ? uploadGaleri.single("file")
        : uploadApbdes.single("file");
    uploadHandler(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: "Upload error",
                message: err.message,
            });
        }
        else if (err) {
            return res.status(400).json({
                error: "Upload error",
                message: err.message,
            });
        }
        if (!req.file) {
            return res.status(400).json({
                error: "Tidak ada file yang diunggah",
            });
        }
        // Construct URL
        const fileUrl = `/uploads/${folder}/${req.file.filename}`;
        return res.status(200).json({
            success: true,
            message: "File berhasil diunggah",
            data: {
                url: fileUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                folder: folder,
            },
        });
    });
});
/**
 * POST /api/upload/pdf
 * Upload file PDF (RKP Desa)
 * Body: file (multipart/form-data)
 */
router.post("/pdf", (req, res) => {
    uploadPDF.single("file")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: "Upload error",
                message: err.message,
            });
        }
        else if (err) {
            return res.status(400).json({
                error: "Upload error",
                message: err.message,
            });
        }
        if (!req.file) {
            return res.status(400).json({
                error: "Tidak ada file PDF yang diunggah",
            });
        }
        // Construct URL
        const fileUrl = `/uploads/rkpdesa/${req.file.filename}`;
        return res.status(200).json({
            success: true,
            message: "File PDF berhasil diunggah",
            data: {
                url: fileUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
            },
        });
    });
});
/**
 * POST /api/upload/galeri
 * Upload file gambar khusus untuk galeri
 * Body: file (multipart/form-data)
 */
router.post("/galeri", (req, res) => {
    uploadGaleri.single("file")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: "Upload error",
                message: err.message,
            });
        }
        else if (err) {
            return res.status(400).json({
                error: "Upload error",
                message: err.message,
            });
        }
        if (!req.file) {
            return res.status(400).json({
                error: "Tidak ada file yang diunggah",
            });
        }
        // Construct URL
        const fileUrl = `/uploads/galeri/${req.file.filename}`;
        return res.status(200).json({
            success: true,
            message: "File galeri berhasil diunggah",
            data: {
                url: fileUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
            },
        });
    });
});
export default router;
//# sourceMappingURL=upload.js.map