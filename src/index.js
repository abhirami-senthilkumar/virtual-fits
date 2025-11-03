import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import tryonRoutes from './routes/tryon.js';
import uploadRoutes from './routes/uploads.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan('dev'));
// Serve static files
app.use("/uploads", express.static("uploads"));

// Upload route
app.use("/api/upload", uploadRoutes);

app.get('/', (req, res) => {
    const message = 'Server is working ✅';
    res.send(message);
});
app.use("/api/tryon", tryonRoutes);
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
