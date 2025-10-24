import { Router } from "express";
import { authenticate, adminOnly, } from "../middleware/auth.js";
import { LembagaMasyarakatController } from "../controllers/lembagaMasyarakatController.js";
const router = Router();
const lembagaController = new LembagaMasyarakatController();
// Public routes
router.get("/", (req, res) => lembagaController.getAll(req, res));
router.get("/:id", (req, res) => lembagaController.getById(req, res));
// Admin routes
router.post("/", authenticate, adminOnly, (req, res) => lembagaController.create(req, res));
router.put("/:id", authenticate, adminOnly, (req, res) => lembagaController.update(req, res));
router.delete("/:id", authenticate, adminOnly, (req, res) => lembagaController.delete(req, res));
export default router;
//# sourceMappingURL=lembagaMasyarakat.js.map