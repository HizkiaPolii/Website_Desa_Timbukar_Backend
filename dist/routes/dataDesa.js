import { Router } from "express";
import { authenticate, adminOnly, } from "../middleware/auth.js";
import { DataDesaController } from "../controllers/dataDesaController.js";
const router = Router();
const dataDesaController = new DataDesaController();
// Public routes
router.get("/", (req, res) => dataDesaController.getAll(req, res));
router.get("/:id", (req, res) => dataDesaController.getById(req, res));
// Admin routes
router.post("/", authenticate, adminOnly, (req, res) => dataDesaController.create(req, res));
router.put("/:id", authenticate, adminOnly, (req, res) => dataDesaController.update(req, res));
router.delete("/:id", authenticate, adminOnly, (req, res) => dataDesaController.delete(req, res));
export default router;
//# sourceMappingURL=dataDesa.js.map