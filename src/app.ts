import * as express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { appConfig } from "./config/database.js";
import { initializeDatabase } from "./config/connectionPool.js";

// Import routes
import authRoutes from "./routes/auth.js";
import profilRoutes from "./routes/profil.js";
import pemerintahanRoutes from "./routes/pemerintahan.js";
import bumdesRoutes from "./routes/bumdes.js";
import lembagaMasyarakatRoutes from "./routes/lembagaMasyarakat.js";
import dataDesaRoutes from "./routes/dataDesa.js";
import rkpdesaRoutes from "./routes/rkpdesa.js";
import apbdesRoutes from "./routes/apbdes.js";
import galeriRoutes from "./routes/galeri.js";
import kontakRoutes from "./routes/kontak.js";

// Load environment variables
dotenv.config();

const app = express.default();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profil", profilRoutes);
app.use("/api/pemerintahan", pemerintahanRoutes);
app.use("/api/bumdes", bumdesRoutes);
app.use("/api/lembaga-masyarakat", lembagaMasyarakatRoutes);
app.use("/api/data-desa", dataDesaRoutes);
app.use("/api/rkpdesa", rkpdesaRoutes);
app.use("/api/apbdes", apbdesRoutes);
app.use("/api/galeri", galeriRoutes);
app.use("/api/kontak", kontakRoutes);

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
