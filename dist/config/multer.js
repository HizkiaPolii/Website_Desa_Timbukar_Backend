import multer from "multer";
import path from "path";
import fs from "fs";
// Create uploads directories if they don't exist
const apbdesDir = path.join(process.cwd(), "uploads", "apbdes");
if (!fs.existsSync(apbdesDir)) {
    fs.mkdirSync(apbdesDir, { recursive: true });
}
const galeriDir = path.join(process.cwd(), "uploads", "galeri");
if (!fs.existsSync(galeriDir)) {
    fs.mkdirSync(galeriDir, { recursive: true });
}
// Configure storage for APBDES
const apbdesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, apbdesDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});
// Configure storage for Galeri
const galeriStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, galeriDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});
// Filter for images only
const fileFilter = (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Hanya file gambar yang diizinkan (JPEG, PNG, GIF, WebP)"));
    }
};
// Create multer instances
export const uploadApbdes = multer({
    storage: apbdesStorage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
export const uploadGaleri = multer({
    storage: galeriStorage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
//# sourceMappingURL=multer.js.map