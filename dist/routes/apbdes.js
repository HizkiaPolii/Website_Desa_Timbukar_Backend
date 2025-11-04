import { Router } from "express";
import { authenticate, adminOnly, } from "../middleware/auth.js";
import { ApbdesController } from "../controllers/apbdesController.js";
import { uploadApbdes } from "../config/multer.js";
const router = Router();
const apbdesController = new ApbdesController();
// Public routes
router.get("/", (req, res) => apbdesController.getAll(req, res));
router.get("/summary", (req, res) => apbdesController.getSummary(req, res));
router.get("/tahun/:tahun", (req, res) => apbdesController.getByTahun(req, res));
router.get("/:id", (req, res) => apbdesController.getById(req, res));
// Admin routes
router.post("/", authenticate, adminOnly, uploadApbdes.single("gambar"), (req, res) => apbdesController.create(req, res));
// Update dengan file upload (form-data)
router.put("/:id", authenticate, adminOnly, uploadApbdes.single("gambar"), (req, res) => apbdesController.update(req, res));
// Update tanpa file upload (JSON) - untuk delete image atau update data
router.patch("/:id", authenticate, adminOnly, (req, res) => apbdesController.update(req, res));
router.delete("/:id", authenticate, adminOnly, (req, res) => apbdesController.delete(req, res));
export default router;
//# sourceMappingURL=apbdes.js.map