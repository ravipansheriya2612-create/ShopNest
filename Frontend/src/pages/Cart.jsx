import {
    Minus,
    Plus,
    ShoppingCart,
    Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import CheckoutModal from "../components/CheckoutModal";

function Cart() {
    const {
        cart,
        cartCount,
        cartTotal,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    const [checkoutOpen, setCheckoutOpen] = useState(false);

    return (
        <div className="app-page">
            <Navbar />

            <main className="cart-page">
                <div className="section-heading">
                    <div>
                        <span>Shopping bag</span>
                        <h1>Your cart</h1>
                    </div>

                    <div className="cart-heading-actions">
                        <strong>{cartCount} items</strong>

                        <Link to="/" className="continue-shopping-button">
                            Continue shopping
                        </Link>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <ShoppingCart size={42} />

                        <h2>Your cart is empty</h2>

                        <p>
                            Browse the catalogue and add products
                            you would like to purchase.
                        </p>

                        <Link to="/">Browse products</Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <section className="cart-items">
                            {cart.map((item) => (
                                <article
                                    key={item._id}
                                    className="cart-item"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />

                                    <div className="cart-item-info">
                                        <span>
                                            {item.category}
                                        </span>

                                        <h3>{item.name}</h3>

                                        <strong>
                                            ₹
                                            {Number(
                                                item.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </div>

                                    <div className="quantity-control">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.quantity -
                                                    1
                                                )
                                            }
                                        >
                                            <Minus size={15} />
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={
                                                item.quantity >=
                                                item.stock
                                            }
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.quantity +
                                                    1
                                                )
                                            }
                                        >
                                            <Plus size={15} />
                                        </button>
                                    </div>

                                    <strong className="item-total">
                                        ₹
                                        {(
                                            item.price *
                                            item.quantity
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                    <button
                                        type="button"
                                        className="remove-item"
                                        onClick={() =>
                                            removeFromCart(
                                                item._id
                                            )
                                        }
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </article>
                            ))}
                        </section>

                        <aside className="cart-summary">
                            <span>Order summary</span>

                            <h2>Cart total</h2>

                            <div>
                                <p>Products</p>
                                <strong>{cartCount}</strong>
                            </div>

                            <div>
                                <p>Subtotal</p>
                                <strong>
                                    ₹{cartTotal.toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <div className="summary-total">
                                <p>Total</p>
                                <strong>
                                    ₹{cartTotal.toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <Link
                                to="/"
                                className="continue-shopping-button"
                            >
                                <Plus size={17} />
                                Add more products
                            </Link>

                            <button
                                type="button"
                                className="checkout-button"
                                onClick={() => setCheckoutOpen(true)}
                            >
                                Proceed to checkout
                            </button>

                            <button
                                type="button"
                                className="clear-cart"
                                onClick={clearCart}
                            >
                                Clear cart
                            </button>
                        </aside>
                    </div>
                )}
            </main>
            <CheckoutModal
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
            />
        </div>
    );
}

export default Cart;