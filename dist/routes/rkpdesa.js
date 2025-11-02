import { Router } from "express";
import { authenticate, adminOnly, } from "../middleware/auth.js";
import { RKPDesaController } from "../controllers/rkpdesaController.js";
const router = Router();
const rkpdesaController = new RKPDesaController();
// Public routes
router.get("/", (req, res) => rkpdesaController.getAll(req, res));
router.get("/tahun/:tahun", (req, res) => rkpdesaController.getByTahun(req, res));
router.get("/:id", (req, res) => rkpdesaController.getById(req, res));
// Admin routes
router.post("/", authenticate, adminOnly, (req, res) => rkpdesaController.create(req, res));
router.put("/:id", authenticate, adminOnly, (req, res) => rkpdesaController.update(req, res));
router.delete("/:id", authenticate, adminOnly, (req, res) => rkpdesaController.delete(req, res));
export default router;
//# sourceMappingURL=rkpdesa.js.map