import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const LIGHTX_API_KEY = process.env.LIGHTX_API_KEY;
const BASE_URL = process.env.LIGHTX_BASE_URL;
router.get('/', async (req, res) => {
    res.send("Tryon API");
})
// 1️⃣ Create order (Try-on request)
router.post("/", async (req, res) => {
    try {
        const { modelImageUrl, garmentImageUrl } = req.body;

        if (!modelImageUrl || !garmentImageUrl) {
            return res.status(400).json({ message: "Both model and garment images are required" });
        }
        const data = {
            "imageUrl": modelImageUrl,
            "styleImageUrl": garmentImageUrl, // already a URL from assets
        };
        console.log("data", data);
        const response = await axios.post(
            `${BASE_URL}`,
            JSON.stringify(data),
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": LIGHTX_API_KEY,
                },
            }
        );

        console.log("Order Response:", response.data);

        res.status(200).json({
            message: "Order created successfully",
            orderId: response.data?.order_id,
            response: response.data,
        });
    } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to create order",
            error: error.response?.data || error.message,
        });
    }
});

// 2️⃣ Fetch try-on result
router.post("/result", async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: "orderId is required" });
    }

    try {
        const response = await axios.post(
            "https://api.lightxeditor.com/external/api/v2/order-status",
            { orderId },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.LIGHTX_API_KEY,
                },
            }
        );

        console.log("✅ LightX Response:", response.data);
        res.json({
            message: "Result fetched successfully",
            response: response.data,
        });
    } catch (err) {
        console.error("❌ Error details:", err.response?.data || err.message);
        res.status(500).json({
            message: "Failed to fetch try-on result",
            error: err.response?.data || err.message,
        });
    }
});

export default router;
