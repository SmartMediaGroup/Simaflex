import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Configure multer for file uploads
// We'll save files to "public/uploads" so Vite can serve them directly during dev
// and they will be part of the static build (for those uploaded before build).
// Though, for dynamically uploaded files to persist and be served in production,
// they need to be served statically by Express.
const uploadDir = path.join(process.cwd(), "src", "assets", "images", "produits");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload Endpoint
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // We return the URL path relative to the root for Express to serve
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

async function startServer() {
  // Always serve uploaded files statically so they work in both dev and prod
  app.use("/uploads", express.static(uploadDir));

  // Catch unmatched API routes to prevent HTML error pages from Vite or Express
  app.all("/api/*", (req, res, next) => {
    // If it's the exact POST /api/upload route, it should have been matched above.
    // If it reached here, it's either the wrong method or a wrong API path.
    res.status(404).json({ error: "API route not found or method not supported" });
  });

  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
