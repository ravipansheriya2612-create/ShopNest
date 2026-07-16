import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow Postman, server-to-server requests and listed origins
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.error("Blocked CORS origin:", origin);

            return callback(
                new Error(`CORS blocked origin: ${origin}`)
            );
        },
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
    res.status(200).send("ShopNest API is running");
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
    console.error("Server error:", error.message);

    const statusCode =
        error.message?.startsWith("CORS blocked")
            ? 403
            : 500;

    res.status(statusCode).json({
        message:
            error.message || "Internal server error",
    });
});

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

const startServer = async () => {
    await connectDB();

    app.listen(PORT, HOST, () => {
        console.log(
            `Server running on http://${HOST}:${PORT}`
        );
    });
};

startServer();