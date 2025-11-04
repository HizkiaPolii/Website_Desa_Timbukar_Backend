import { Router, Request, Response } from "express";
import {
  uploadApbdes,
  uploadGaleri,
  uploadPemerintahan,
  uploadBumdes,
  uploadLembaga,
  uploadGeneral,
  uploadRkpdesa,
} from "../config/multer.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

/**
 * POST /api/upload
 * Upload file gambar ke folder yang ditentukan (apbdes, galeri, pemerintahan, bumdes, general)
 * Body: file (multipart), folder (apbdes|galeri|pemerintahan|bumdes|general)
 */
router.post("/", (req: Request, res: Response, next) => {
  const folder = req.query.folder as string;

  // Validate folder
  const allowedFolders = [
    "apbdes",
    "galeri",
    "pemerintahan",
    "bumdes",
    "lembaga",
    "rkpdesa",
    "general",
  ];

  if (!folder || !allowedFolders.includes(folder)) {
    return res.status(400).json({
      error: "Folder tidak valid",
      message: `Folder harus salah satu dari: ${allowedFolders.join(", ")}`,
    });
  }

  // Select appropriate upload handler based on folder
  let uploadHandler;
  switch (folder) {
    case "galeri":
      uploadHandler = uploadGaleri.single("file");
      break;
    case "apbdes":
      uploadHandler = uploadApbdes.single("file");
      break;
    case "pemerintahan":
      uploadHandler = uploadPemerintahan.single("file");
      break;
    case "bumdes":
      uploadHandler = uploadBumdes.single("file");
      break;
    case "lembaga":
      uploadHandler = uploadLembaga.single("file");
      break;
    case "rkpdesa":
      uploadHandler = uploadRkpdesa.single("file");
      break;
    case "general":
      uploadHandler = uploadGeneral.single("file");
      break;
    default:
      return res.status(400).json({
        error: "Folder tidak valid",
      });
  }

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        error: "Upload error",
        message: err.message,
      });
    } else if (err) {
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

    // Construct relative path (SIMPAN HANYA PATH RELATIVE)
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
router.post("/pdf", (req: Request, res: Response) => {
  uploadRkpdesa.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        error: "Upload error",
        message: err.message,
      });
    } else if (err) {
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

    // Construct relative path (SIMPAN HANYA PATH RELATIVE)
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
router.post("/galeri", (req: Request, res: Response) => {
  uploadGaleri.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        error: "Upload error",
        message: err.message,
      });
    } else if (err) {
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

    // Construct relative path (SIMPAN HANYA PATH RELATIVE)
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
