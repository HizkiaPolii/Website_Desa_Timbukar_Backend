import type { Response } from "express";
import { Router } from "express";
import {
  authenticate,
  adminOnly,
  AuthenticatedRequest,
} from "../middleware/auth.js";
import { LembagaMasyarakatController } from "../controllers/lembagaMasyarakatController.js";

const router = Router();
const lembagaController = new LembagaMasyarakatController();

// Public routes
router.get("/", (req: AuthenticatedRequest, res: Response) =>
  lembagaController.getAll(req, res)
);
router.get("/:id", (req: AuthenticatedRequest, res: Response) =>
  lembagaController.getById(req, res)
);

// Admin routes
router.post(
  "/",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    lembagaController.create(req, res)
);
router.put(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    lembagaController.update(req, res)
);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    lembagaController.delete(req, res)
);

export default router;
