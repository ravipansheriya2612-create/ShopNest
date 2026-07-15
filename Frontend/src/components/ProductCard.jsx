import {
    ArrowRight,
    ImageOff,
    ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [imageFailed, setImageFailed] =
        useState(false);

    const handleAddToCart = () => {
        const added = addToCart(product);

        if (added) {
            navigate("/cart");
        }
    };

    return (
        <article className="product-card">
            <Link
                to={`/products/${product._id}`}
                className="product-image-box"
            >
                {imageFailed || !product.image ? (
                    <div className="product-image-fallback">
                        <ImageOff size={34} />
                        <span>Image unavailable</span>
                    </div>
                ) : (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={() =>
                            setImageFailed(true)
                        }
                    />
                )}

                {product.stock <= 0 && (
                    <span className="stock-badge">
                        Out of stock
                    </span>
                )}
            </Link>

            <div className="product-card-content">
                <span className="product-category">
                    {product.category}
                </span>

                <Link to={`/products/${product._id}`}>
                    <h3>{product.name}</h3>
                </Link>

                <p>
                    {product.description ||
                        "No product description available."}
                </p>

                <div className="product-card-footer">
                    <strong>
                        ₹
                        {Number(
                            product.price
                        ).toLocaleString("en-IN")}
                    </strong>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                    >
                        <ShoppingCart size={17} />
                        Add
                    </button>
                </div>

                <Link
                    to={`/products/${product._id}`}
                    className="view-product-link"
                >
                    View details
                    <ArrowRight size={15} />
                </Link>
            </div>
        </article>
    );
}

export default ProductCard;