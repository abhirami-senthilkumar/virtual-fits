import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import tryonRoutes from "./routes/tryon.js";
import uploadRoutes from "./routes/uploads.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// ✅ Step 1: CORS first, with safe configuration
app.use(
    cors({
        origin: ["http://localhost:5173", "https://virtual-fits.netlify.app"],
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
    })
);

// ✅ Step 2: Explicit preflight handling
app.options(/.*/, (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

// ✅ Step 3: Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));
// app.use("/uploads", express.static("/uploads"));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Step 4: Routes
app.get("/", (req, res) => {
    res.send("Server is working ✅");
});
app.use("/api/upload", uploadRoutes);
app.use("/api/tryon", tryonRoutes);

// ✅ Step 5: 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// ✅ Step 6: Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
