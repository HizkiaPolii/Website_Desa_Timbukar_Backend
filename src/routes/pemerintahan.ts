import type { Response } from "express";
import { Router } from "express";
import {
  authenticate,
  adminOnly,
  AuthenticatedRequest,
} from "../middleware/auth.js";
import { PemerintahanDesaController } from "../controllers/pemerintahanController.js";

const router = Router();
const pemerintahanController = new PemerintahanDesaController();

// Public routes
router.get("/", (req: AuthenticatedRequest, res: Response) =>
  pemerintahanController.getAll(req, res)
);
router.get("/:id", (req: AuthenticatedRequest, res: Response) =>
  pemerintahanController.getById(req, res)
);

// Admin routes
router.post(
  "/",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    pemerintahanController.create(req, res)
);
router.put(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    pemerintahanController.update(req, res)
);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    pemerintahanController.delete(req, res)
);

export default router;
