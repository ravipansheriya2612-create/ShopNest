import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
        },

        razorpayPaymentId: {
            type: String,
            default: "",
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        currency: {
            type: String,
            default: "INR",
        },

        customer: {
            name: {
                type: String,
                required: true,
                trim: true,
            },

            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
            },

            phone: {
                type: String,
                required: true,
                trim: true,
            },
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                name: {
                    type: String,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],

        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model(
    "Payment",
    paymentSchema
);

export default Payment;