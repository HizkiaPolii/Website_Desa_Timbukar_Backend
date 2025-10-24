import { Router } from "express";
import { authenticate, adminOnly, } from "../middleware/auth.js";
import { BumdesController } from "../controllers/bumdesController.js";
const router = Router();
const bumdesController = new BumdesController();
// Public routes
router.get("/", (req, res) => bumdesController.getAll(req, res));
router.get("/:id", (req, res) => bumdesController.getById(req, res));
// Admin routes
router.post("/", authenticate, adminOnly, (req, res) => bumdesController.create(req, res));
router.put("/:id", authenticate, adminOnly, (req, res) => bumdesController.update(req, res));
router.delete("/:id", authenticate, adminOnly, (req, res) => bumdesController.delete(req, res));
export default router;
//# sourceMappingURL=bumdes.js.map