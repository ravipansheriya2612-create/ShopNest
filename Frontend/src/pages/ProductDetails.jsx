import {
    ArrowLeft,
    PackageCheck,
    ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Link,
    useParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await API.get(
                    `/products/${id}`
                );

                setProduct(response.data);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to load product"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        const added = addToCart(product);

        if (added) {
            navigate("/cart");
        }
    };

    return (
        <div className="app-page">
            <Navbar />

            <main className="details-page">
                <Link to="/" className="back-link">
                    <ArrowLeft size={17} />
                    Back to products
                </Link>

                {loading ? (
                    <div className="page-state">
                        <div className="spinner" />
                    </div>
                ) : !product ? (
                    <div className="page-state">
                        <h2>Product not found</h2>
                    </div>
                ) : (
                    <section className="product-details">
                        <div className="details-image">
                            <img
                                src={product.image}
                                alt={product.name}
                            />
                        </div>

                        <div className="details-content">
                            <span className="product-category">
                                {product.category}
                            </span>

                            <h1>{product.name}</h1>

                            <strong className="details-price">
                                ₹
                                {Number(
                                    product.price
                                ).toLocaleString("en-IN")}
                            </strong>

                            <p>{product.description}</p>

                            <div className="stock-information">
                                <PackageCheck size={18} />

                                {product.stock > 0
                                    ? `${product.stock} units available`
                                    : "Currently out of stock"}
                            </div>

                            <button
                                type="button"
                                className="details-cart-button"
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                            >
                                <ShoppingCart size={19} />
                                Add to cart
                            </button>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default ProductDetails;