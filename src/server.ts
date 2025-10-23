import { initializeDatabase, closeDatabase } from "./config/connectionPool.js";
import app from "./app.js";

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await closeDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await closeDatabase();
  process.exit(0);
});

export default app;
