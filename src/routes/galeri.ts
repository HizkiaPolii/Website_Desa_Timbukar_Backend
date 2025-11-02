import { Router, Request, Response } from "express";
import { GaleriController } from "../controllers/galeriController.js";
import { authenticate, adminOnly } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
const galeriController = new GaleriController();

// Routes untuk galeri
// GET - Get all galeri (public - no auth required)
router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  await galeriController.getAllGaleri(req, res);
});

// GET - Get kategori list (public - no auth required)
router.get(
  "/kategori/list",
  async (req: AuthenticatedRequest, res: Response) => {
    await galeriController.getKategoriList(req, res);
  }
);

// GET - Get galeri by ID (public - no auth required)
router.get("/:id", async (req: AuthenticatedRequest, res: Response) => {
  await galeriController.getGaleriById(req, res);
});

// POST - Create galeri (requires auth & admin)
router.post(
  "/",
  authenticate,
  adminOnly,
  async (req: AuthenticatedRequest, res: Response) => {
    await galeriController.createGaleri(req, res);
  }
);

// PUT - Update galeri (requires auth & admin)
router.put(
  "/:id",
  authenticate,
  adminOnly,
  async (req: AuthenticatedRequest, res: Response) => {
    await galeriController.updateGaleri(req, res);
  }
);

// DELETE - Delete galeri (requires auth & admin)
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  async (req: AuthenticatedRequest, res: Response) => {
    await galeriController.deleteGaleri(req, res);
  }
);

export default router;
