import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

connectDB();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error(`CORS blocked origin: ${origin}`)
            );
        },
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("ShopNest API is running");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ShopNest API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "API route not found",
    });
});

app.use((error, req, res, next) => {
    console.error(error.message);

    res.status(500).json({
        message:
            error.message || "Internal server error",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});