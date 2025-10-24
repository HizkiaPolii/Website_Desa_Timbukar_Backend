import { Router } from "express";
import { authenticate, } from "../middleware/auth.js";
import { AuthController } from "../controllers/authController.js";
const router = Router();
const authController = new AuthController();
// Public routes
router.post("/login", (req, res) => authController.login(req, res));
router.post("/register", (req, res) => authController.register(req, res));
// Protected routes
router.post("/logout", authenticate, (req, res) => authController.logout(req, res));
router.get("/me", authenticate, (req, res) => authController.getProfile(req, res));
export default router;
//# sourceMappingURL=auth.js.map