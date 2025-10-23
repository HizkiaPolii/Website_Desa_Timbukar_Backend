import type { Response } from "express";
import { Router } from "express";
import {
  authenticate,
  adminOnly,
  AuthenticatedRequest,
} from "../middleware/auth.js";
import { BumdesController } from "../controllers/bumdesController.js";

const router = Router();
const bumdesController = new BumdesController();

// Public routes
router.get("/", (req: AuthenticatedRequest, res: Response) =>
  bumdesController.getAll(req, res)
);
router.get("/:id", (req: AuthenticatedRequest, res: Response) =>
  bumdesController.getById(req, res)
);

// Admin routes
router.post(
  "/",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    bumdesController.create(req, res)
);
router.put(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    bumdesController.update(req, res)
);
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    bumdesController.delete(req, res)
);

export default router;
