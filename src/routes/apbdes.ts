import type { Response } from "express";
import { Router } from "express";
import {
  authenticate,
  adminOnly,
  AuthenticatedRequest,
} from "../middleware/auth.js";
import { ApbdesController } from "../controllers/apbdesController.js";
import { uploadApbdes } from "../config/multer.js";

const router = Router();
const apbdesController = new ApbdesController();

// Public routes
router.get("/", (req: AuthenticatedRequest, res: Response) =>
  apbdesController.getAll(req, res)
);
router.get("/summary", (req: AuthenticatedRequest, res: Response) =>
  apbdesController.getSummary(req, res)
);
router.get("/tahun/:tahun", (req: AuthenticatedRequest, res: Response) =>
  apbdesController.getByTahun(req, res)
);
router.get("/:id", (req: AuthenticatedRequest, res: Response) =>
  apbdesController.getById(req, res)
);

// Admin routes
router.post(
  "/",
  authenticate,
  adminOnly,
  uploadApbdes.single("gambar"),
  (req: AuthenticatedRequest, res: Response) =>
    apbdesController.create(req, res)
);
router.put(
  "/:id",
  authenticate,
  adminOnly,
  uploadApbdes.single("gambar"),
  (req: AuthenticatedRequest, res: Response) =>
    apbdesController.update(req, res)
);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    apbdesController.delete(req, res)
);

export default router;
