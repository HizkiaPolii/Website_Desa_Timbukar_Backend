import * as express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { appConfig } from "./config/database.js";
import { initializeDatabase } from "./config/connectionPool.js";

// Import routes
import authRoutes from "./routes/auth.js";
import profilRoutes from "./routes/profil.js";
import pemerintahanRoutes from "./routes/pemerintahan.js";
import bumdesRoutes from "./routes/bumdes.js";
import lembagaMasyarakatRoutes from "./routes/lembagaMasyarakat.js";
import dataDesaRoutes from "./routes/dataDesa.js";

// Load environment variables
dotenv.config();

const app = express.default();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profil", profilRoutes);
app.use("/api/pemerintahan", pemerintahanRoutes);
app.use("/api/bumdes", bumdesRoutes);
app.use("/api/lembaga-masyarakat", lembagaMasyarakatRoutes);
app.use("/api/data-desa", dataDesaRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: "Route tidak ditemukan" });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log("Database initialized");

    app.listen(appConfig.port, () => {
      console.log(`Server running on port ${appConfig.port}`);
      console.log(`Environment: ${appConfig.env}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
