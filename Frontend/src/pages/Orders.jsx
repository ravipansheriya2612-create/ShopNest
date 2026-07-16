import {
    ArrowLeft,
    Box,
    CalendarDays,
    PackageCheck,
    ReceiptText,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";

import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    let customer = null;

    try {
        customer = JSON.parse(
            localStorage.getItem("shopnestCustomer")
        );
    } catch {
        customer = null;
    }

    useEffect(() => {
        const fetchOrders = async () => {
            if (!customer?.email || !customer?.phone) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const response = await API.get(
                    "/payments/customer-orders",
                    {
                        params: {
                            email: customer.email,
                            phone: customer.phone,
                        },
                    }
                );

                setOrders(response.data);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to load orders"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="app-page">
            <Navbar />

            <main className="orders-page">
                <div className="orders-heading">
                    <div>
                        <span>Purchase history</span>
                        <h1>My orders</h1>

                        {customer && (
                            <p>
                                Orders placed using{" "}
                                <strong>
                                    {customer.email}
                                </strong>
                            </p>
                        )}
                    </div>

                    <Link
                        to="/"
                        className="orders-shop-link"
                    >
                        <ArrowLeft size={17} />
                        Continue shopping
                    </Link>
                </div>

                {loading ? (
                    <div className="page-state">
                        <div className="spinner" />
                        <p>Loading your orders...</p>
                    </div>
                ) : !customer ? (
                    <div className="orders-empty">
                        <ReceiptText size={42} />

                        <h2>Customer information not found</h2>

                        <p>
                            Complete a payment first to view
                            your order history.
                        </p>

                        <Link to="/">
                            Browse products
                        </Link>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="orders-empty">
                        <Box size={42} />

                        <h2>No orders found</h2>

                        <p>
                            You have not completed any orders
                            using these customer details.
                        </p>

                        <Link to="/">
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <article
                                key={order._id}
                                className="order-card"
                            >
                                <div className="order-card-header">
                                    <div>
                                        <span>Order ID</span>
                                        <strong>
                                            {order.razorpayOrderId}
                                        </strong>
                                    </div>

                                    <span className="paid-status">
                                        <PackageCheck size={15} />
                                        Paid
                                    </span>
                                </div>

                                <div className="order-information">
                                    <div>
                                        <CalendarDays size={17} />

                                        <span>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>

                                    <div>
                                        <ReceiptText size={17} />

                                        <span>
                                            Payment ID:{" "}
                                            {
                                                order.razorpayPaymentId
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item) => (
                                        <div
                                            key={
                                                item._id ||
                                                item.product?._id
                                            }
                                            className="order-item"
                                        >
                                            <div className="order-item-image">
                                                {item.product?.image ? (
                                                    <img
                                                        src={
                                                            item
                                                                .product
                                                                .image
                                                        }
                                                        alt={
                                                            item.name
                                                        }
                                                    />
                                                ) : (
                                                    <Box size={24} />
                                                )}
                                            </div>

                                            <div className="order-item-details">
                                                <span>
                                                    {
                                                        item
                                                            .product
                                                            ?.category
                                                    }
                                                </span>

                                                <h3>
                                                    {item.name}
                                                </h3>

                                                <p>
                                                    Quantity:{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </p>
                                            </div>

                                            <strong>
                                                ₹
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-card-footer">
                                    <span>Total paid</span>

                                    <strong>
                                        ₹
                                        {Number(
                                            order.amount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Orders;