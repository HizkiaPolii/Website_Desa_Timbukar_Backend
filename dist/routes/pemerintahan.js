import { Router } from "express";
import { authenticate, adminOnly, } from "../middleware/auth.js";
import { PemerintahanDesaController } from "../controllers/pemerintahanController.js";
const router = Router();
const pemerintahanController = new PemerintahanDesaController();
// Public routes
router.get("/", (req, res) => pemerintahanController.getAll(req, res));
router.get("/:id", (req, res) => pemerintahanController.getById(req, res));
// Admin routes
router.post("/", authenticate, adminOnly, (req, res) => pemerintahanController.create(req, res));
router.put("/:id", authenticate, adminOnly, (req, res) => pemerintahanController.update(req, res));
router.delete("/:id", authenticate, adminOnly, (req, res) => pemerintahanController.delete(req, res));
export default router;
//# sourceMappingURL=pemerintahan.js.map