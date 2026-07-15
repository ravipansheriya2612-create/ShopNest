import express from "express";
import {
    createOrder,
    getCustomerOrders,
    verifyPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

router.get("/customer-orders", getCustomerOrders);

export default router;