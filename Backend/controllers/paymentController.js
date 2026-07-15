import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    try {
        const { items, customer } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
            });
        }

        if (
            !customer?.name?.trim() ||
            !customer?.email?.trim() ||
            !customer?.phone?.trim()
        ) {
            return res.status(400).json({
                message: "Customer information is required",
            });
        }

        let totalAmount = 0;
        const paymentItems = [];

        for (const item of items) {
            const product = await Product.findById(
                item.productId
            );

            if (!product) {
                return res.status(404).json({
                    message: "A cart product was not found",
                });
            }

            const quantity = Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {
                return res.status(400).json({
                    message: "Invalid product quantity",
                });
            }

            if (quantity > product.stock) {
                return res.status(400).json({
                    message: `${product.name} has insufficient stock`,
                });
            }

            totalAmount += product.price * quantity;

            paymentItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity,
            });
        }

        const amountInPaise = Math.round(
            totalAmount * 100
        );

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                customerEmail: customer.email.trim(),
            },
        });

        await Payment.create({
            razorpayOrderId: order.id,
            amount: totalAmount,
            currency: order.currency,
            customer: {
                name: customer.name.trim(),
                email: customer.email.trim().toLowerCase(),
                phone: customer.phone.trim(),
            },
            items: paymentItems,
            status: "created",
        });

        return res.status(201).json({
            key: process.env.RAZORPAY_KEY_ID,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message:
                error.error?.description ||
                error.message ||
                "Unable to create payment order",
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Payment verification data is missing",
            });
        }

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            await Payment.findOneAndUpdate(
                {
                    razorpayOrderId:
                        razorpay_order_id,
                },
                {
                    status: "failed",
                }
            );

            return res.status(400).json({
                message: "Payment verification failed",
            });
        }

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment order not found",
            });
        }

        if (payment.status === "paid") {
            return res.status(200).json({
                message: "Payment was already verified",
                payment,
            });
        }

        for (const item of payment.items) {
            const updatedProduct =
                await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        stock: {
                            $gte: item.quantity,
                        },
                    },
                    {
                        $inc: {
                            stock: -item.quantity,
                        },
                    },
                    {
                        new: true,
                    }
                );

            if (!updatedProduct) {
                return res.status(409).json({
                    message:
                        "Product stock changed before payment confirmation",
                });
            }
        }

        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.status = "paid";

        await payment.save();

        return res.status(200).json({
            message: "Payment verified successfully",
            payment,
        });
    } catch (error) {
        return res.status(500).json({
            message:
                error.message ||
                "Unable to verify payment",
        });
    }
};

export const getCustomerOrders = async (req, res) => {
    try {
        const email = req.query.email
            ?.trim()
            .toLowerCase();

        const phone = req.query.phone?.trim();

        if (!email || !phone) {
            return res.status(400).json({
                message: "Email and phone number are required",
            });
        }

        const orders = await Payment.find({
            "customer.email": email,
            "customer.phone": phone,
            status: "paid",
        })
            .populate(
                "items.product",
                "name image category price"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({
            message:
                error.message ||
                "Unable to load customer orders",
        });
    }
};