import type { Response } from "express";
import { Router } from "express";
import {
  authenticate,
  adminOnly,
  AuthenticatedRequest,
} from "../middleware/auth.js";
import { RKPDesaController } from "../controllers/rkpdesaController.js";

const router = Router();
const rkpdesaController = new RKPDesaController();

// Public routes
router.get("/", (req: AuthenticatedRequest, res: Response) =>
  rkpdesaController.getAll(req, res)
);
router.get("/tahun/:tahun", (req: AuthenticatedRequest, res: Response) =>
  rkpdesaController.getByTahun(req, res)
);
router.get("/:id", (req: AuthenticatedRequest, res: Response) =>
  rkpdesaController.getById(req, res)
);

// Admin routes
router.post(
  "/",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    rkpdesaController.create(req, res)
);
router.put(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    rkpdesaController.update(req, res)
);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    rkpdesaController.delete(req, res)
);

export default router;
