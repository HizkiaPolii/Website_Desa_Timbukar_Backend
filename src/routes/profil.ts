import type { Response } from "express";
import { Router } from "express";
import {
  authenticate,
  adminOnly,
  AuthenticatedRequest,
} from "../middleware/auth.js";
import { ProfilDesaController } from "../controllers/profilController.js";

const router = Router();
const profilController = new ProfilDesaController();

// Public routes
router.get("/", (req: AuthenticatedRequest, res: Response) =>
  profilController.getProfil(req, res)
);

// Admin routes
router.put(
  "/",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    profilController.updateProfil(req, res)
);

router.post(
  "/",
  authenticate,
  adminOnly,
  (req: AuthenticatedRequest, res: Response) =>
    profilController.createProfil(req, res)
);

export default router;
