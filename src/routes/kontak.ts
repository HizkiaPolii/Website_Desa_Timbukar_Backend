import express, { Router } from "express";
import * as kontakController from "../controllers/kontakController.js";
import { authenticate } from "../middleware/auth.js";

const router: Router = express.Router();

// Public routes
// Create new kontak message (public)
router.post("/", kontakController.createKontak);

// Admin routes (protected)
// Get all kontak messages with filters
router.get("/", authenticate, kontakController.getAllKontak);

// Get kontak statistics
router.get("/stats", authenticate, kontakController.getKontakStats);

// Get single kontak by ID
router.get("/:id", authenticate, kontakController.getKontakById);

// Update kontak status
router.patch("/:id/status", authenticate, kontakController.updateKontakStatus);

// Delete kontak
router.delete("/:id", authenticate, kontakController.deleteKontak);

export default router;
