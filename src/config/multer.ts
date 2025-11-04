import multer from "multer";
import path from "path";
import fs from "fs";

// Helper function to create directories
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create uploads directories if they don't exist
const apbdesDir = path.join(process.cwd(), "uploads", "apbdes");
ensureDir(apbdesDir);

const galeriDir = path.join(process.cwd(), "uploads", "galeri");
ensureDir(galeriDir);

const pemerintahanDir = path.join(process.cwd(), "uploads", "pemerintahan");
ensureDir(pemerintahanDir);

const bumdesDir = path.join(process.cwd(), "uploads", "bumdes");
ensureDir(bumdesDir);

const lembagaDir = path.join(process.cwd(), "uploads", "lembaga");
ensureDir(lembagaDir);

const generalDir = path.join(process.cwd(), "uploads", "general");
ensureDir(generalDir);

const rkpdDir = path.join(process.cwd(), "uploads", "rkpdesa");
ensureDir(rkpdDir);

// Helper function to create storage config
const createStorage = (uploadDir: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
  });

// Configure storage for all folders
const apbdesStorage = createStorage(apbdesDir);
const galeriStorage = createStorage(galeriDir);
const pemerintahanStorage = createStorage(pemerintahanDir);
const bumdesStorage = createStorage(bumdesDir);
const lembagaStorage = createStorage(lembagaDir);
const generalStorage = createStorage(generalDir);
const rkpdesaStorage = createStorage(rkpdDir);

// Filter for images only
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan (JPEG, PNG, GIF, WebP)"));
  }
};

// Filter for PDF documents only
const pdfFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["application/pdf"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file PDF yang diizinkan"));
  }
};

// Create multer instances for all folders
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

export const uploadPemerintahan = multer({
  storage: pemerintahanStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadBumdes = multer({
  storage: bumdesStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadLembaga = multer({
  storage: lembagaStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadGeneral = multer({
  storage: generalStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadRkpdesa = multer({
  storage: rkpdesaStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for PDF
});
