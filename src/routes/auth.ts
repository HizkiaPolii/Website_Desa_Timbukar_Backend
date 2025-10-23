import type { Response } from "express";
import { Router } from "express";
import {
  authenticate,
  adminOnly,
  AuthenticatedRequest,
} from "../middleware/auth.js";
import { AuthController } from "../controllers/authController.js";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/login", (req: AuthenticatedRequest, res: Response) =>
  authController.login(req, res)
);
router.post("/register", (req: AuthenticatedRequest, res: Response) =>
  authController.register(req, res)
);

// Protected routes
router.post(
  "/logout",
  authenticate,
  (req: AuthenticatedRequest, res: Response) => authController.logout(req, res)
);
router.get("/me", authenticate, (req: AuthenticatedRequest, res: Response) =>
  authController.getProfile(req, res)
);

export default router;
