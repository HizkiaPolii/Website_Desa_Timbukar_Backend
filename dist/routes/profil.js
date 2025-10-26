import { Router } from "express";
import { authenticate, adminOnly, } from "../middleware/auth.js";
import { ProfilDesaController } from "../controllers/profilController.js";
const router = Router();
const profilController = new ProfilDesaController();
// Public routes
router.get("/", (req, res) => profilController.getProfil(req, res));
// Admin routes
router.put("/", authenticate, adminOnly, (req, res) => profilController.updateProfil(req, res));
router.post("/", authenticate, adminOnly, (req, res) => profilController.createProfil(req, res));
export default router;
//# sourceMappingURL=profil.js.map