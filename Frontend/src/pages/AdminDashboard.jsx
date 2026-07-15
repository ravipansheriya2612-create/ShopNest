import {
    Boxes,
    LogOut,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductFormModal from "../components/ProductFormModal";
import API from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] =
        useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await API.get("/products");
            setProducts(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Unable to load products"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openCreateModal = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;

        setModalOpen(false);
        setEditingProduct(null);
    };

    const saveProduct = async (productData) => {
        try {
            setSaving(true);

            if (editingProduct) {
                const response = await API.put(
                    `/products/${editingProduct._id}`,
                    productData
                );

                setProducts((previous) =>
                    previous.map((product) =>
                        product._id ===
                        editingProduct._id
                            ? response.data
                            : product
                    )
                );

                toast.success(
                    "Product updated successfully"
                );
            } else {
                const response = await API.post(
                    "/products",
                    productData
                );

                setProducts((previous) => [
                    response.data,
                    ...previous,
                ]);

                toast.success(
                    "Product created successfully"
                );
            }

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Unable to save product"
            );

            return false;
        } finally {
            setSaving(false);
        }
    };

    const deleteProduct = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            await API.delete(`/products/${productId}`);

            setProducts((previous) =>
                previous.filter(
                    (product) =>
                        product._id !== productId
                )
            );

            toast.success(
                "Product deleted successfully"
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Unable to delete product"
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin/login");
    };

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        return products.filter(
            (product) =>
                product.name
                    .toLowerCase()
                    .includes(term) ||
                product.category
                    .toLowerCase()
                    .includes(term)
        );
    }, [products, search]);

    const totalStock = products.reduce(
        (total, product) => total + product.stock,
        0
    );

    const outOfStockCount = products.filter(
        (product) => product.stock === 0
    ).length;

    return (
        <div className="app-page">
            <Navbar />

            <main className="admin-page">
                <section className="admin-heading">
                    <div>
                        <span>Admin workspace</span>
                        <h1>Product management</h1>
                        <p>
                            Manage product information, stock and
                            catalogue availability.
                        </p>
                    </div>

                    <div className="admin-heading-actions">
                        <button
                            type="button"
                            className="logout-admin"
                            onClick={handleLogout}
                        >
                            <LogOut size={17} />
                            Logout
                        </button>

                        <button
                            type="button"
                            className="add-product-button"
                            onClick={openCreateModal}
                        >
                            <Plus size={18} />
                            Add product
                        </button>
                    </div>
                </section>

                <section className="admin-stats">
                    <div>
                        <span>Total products</span>
                        <strong>{products.length}</strong>
                    </div>

                    <div>
                        <span>Available stock</span>
                        <strong>{totalStock}</strong>
                    </div>

                    <div>
                        <span>Out of stock</span>
                        <strong>{outOfStockCount}</strong>
                    </div>
                </section>

                <section className="admin-products-panel">
                    <div className="admin-products-header">
                        <div>
                            <span>Catalogue</span>
                            <h2>All products</h2>
                        </div>

                        <div className="admin-search">
                            <Search size={17} />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search products"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="page-state">
                            <div className="spinner" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="page-state">
                            <Boxes size={40} />
                            <h3>No products found</h3>
                        </div>
                    ) : (
                        <div className="admin-product-list">
                            {filteredProducts.map(
                                (product) => (
                                    <article
                                        key={product._id}
                                        className="admin-product-row"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />

                                        <div className="admin-product-info">
                                            <span>
                                                {product.category}
                                            </span>
                                            <h3>
                                                {product.name}
                                            </h3>
                                        </div>

                                        <strong>
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                        <div className="stock-column">
                                            <span>Stock</span>
                                            <strong>
                                                {product.stock}
                                            </strong>
                                        </div>

                                        <div className="admin-row-actions">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditModal(
                                                        product
                                                    )
                                                }
                                            >
                                                <Pencil
                                                    size={16}
                                                />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-product"
                                                onClick={() =>
                                                    deleteProduct(
                                                        product._id
                                                    )
                                                }
                                            >
                                                <Trash2
                                                    size={16}
                                                />
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    )}
                </section>
            </main>

            <ProductFormModal
                open={modalOpen}
                product={editingProduct}
                loading={saving}
                onClose={closeModal}
                onSubmit={saveProduct}
            />
        </div>
    );
}

export default AdminDashboard;