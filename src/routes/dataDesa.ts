import type { Response } from "express";
import { Router } from "express";
import {
  authenticate,
  adminOnly,
  AuthenticatedRequest,
} from "../middleware/auth.js";
import { DataDesaController } from "../controllers/dataDesaController.js";

const router = Router();
const dataDesaController = new DataDesaController();

// Public routes
router.get("/", (req: AuthenticatedRequest, res: Response) =>
  dataDesaController.getAll(req, res)
);
router.get("/:id", (req: AuthenticatedRequest, res: Response) =>
  dataDesaController.getById(req, res)
);

// Admin routes
router.post(
  "/",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    dataDesaController.create(req, res)
);

// Update all data in one request
router.post(
  "/update-all",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    dataDesaController.updateAll(req, res)
);

router.put(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    dataDesaController.update(req, res)
);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    dataDesaController.delete(req, res)
);

export default router;
