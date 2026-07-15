import { CreditCard, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CheckoutModal({ open, onClose }) {
    const {
        cart,
        cartTotal,
        clearCart,
    } = useCart();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "phone"
                    ? value.replace(/\D/g, "").slice(0, 10)
                    : value,
        }));
    };

    const handlePayment = async (event) => {
        event.preventDefault();

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const phone = formData.phone.trim();

        if (!name || !email || !phone) {
            toast.error("Please enter all customer details");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Enter a valid email address");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            toast.error(
                "Enter a valid 10-digit Indian mobile number"
            );
            return;
        }

        if (cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        if (!window.Razorpay) {
            toast.error(
                "Razorpay checkout could not be loaded"
            );
            return;
        }

        try {
            setProcessing(true);

            const customerPhone = `+91${phone}`;

            const orderResponse = await API.post(
                "/payments/create-order",
                {
                    customer: {
                        name,
                        email,
                        phone: customerPhone,
                    },

                    items: cart.map((item) => ({
                        productId: item._id,
                        quantity: item.quantity,
                    })),
                }
            );

            const {
                key,
                orderId,
                amount,
                currency,
            } = orderResponse.data;

            const options = {
                key,
                amount,
                currency,
                name: "ShopNest",
                description: "ShopNest product order",
                order_id: orderId,

                prefill: {
                    name,
                    email,
                    contact: customerPhone,
                },

                theme: {
                    color: "#173d35",
                },

                handler: async (response) => {
                    try {
                        await API.post(
                            "/payments/verify",
                            response
                        );

                        localStorage.setItem(
                            "shopnestCustomer",
                            JSON.stringify({
                                name,
                                email,
                                phone: customerPhone,
                            })
                        );

                        clearCart();
                        onClose();

                        toast.success(
                            "Payment completed successfully"
                        );

                        navigate("/orders");
                    } catch (error) {
                        toast.error(
                            error.response?.data?.message ||
                            "Payment verification failed"
                        );
                    } finally {
                        setProcessing(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on(
                "payment.failed",
                (response) => {
                    setProcessing(false);

                    toast.error(
                        response.error?.description ||
                        "Payment failed"
                    );
                }
            );

            razorpay.open();
        } catch (error) {
            setProcessing(false);

            toast.error(
                error.response?.data?.message ||
                "Unable to start payment"
            );
        }
    };

    if (!open) return null;

    return (
        <div
            className="modal-overlay"
            onMouseDown={() =>
                !processing && onClose()
            }
        >
            <section
                className="checkout-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby="checkout-title"
            >
                <div className="modal-header">
                    <div>
                        <span>Secure payment</span>

                        <h2 id="checkout-title">
                            Complete your order
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        aria-label="Close checkout"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    className="checkout-form"
                    onSubmit={handlePayment}
                >
                    <label>
                        Full name

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                        />
                    </label>

                    <label>
                        Email address

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="customer@example.com"
                            autoComplete="email"
                        />
                    </label>

                    <label>
                        Phone number

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                            inputMode="numeric"
                            maxLength="10"
                            autoComplete="tel"
                        />
                    </label>

                    <div className="checkout-total">
                        <span>Amount to pay</span>

                        <strong>
                            ₹
                            {cartTotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <button
                        type="submit"
                        className="checkout-pay-button"
                        disabled={processing}
                    >
                        <CreditCard size={18} />

                        {processing
                            ? "Starting payment..."
                            : `Pay ₹${cartTotal.toLocaleString(
                                "en-IN"
                            )}`}
                    </button>
                </form>
            </section>
        </div>
    );
}

export default CheckoutModal;