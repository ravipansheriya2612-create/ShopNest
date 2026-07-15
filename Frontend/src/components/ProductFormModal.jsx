import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import toast from "react-hot-toast";
import CloudinaryUpload from "./CloudinaryUpload";

const emptyForm = {
    name: "",
    image: "",
    category: "",
    price: "",
    description: "",
    stock: "",
    isFeatured: false,
};

function ProductFormModal({
    open,
    product,
    loading,
    onClose,
    onSubmit,
}) {
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                image: product.image || "",
                category: product.category || "",
                price: product.price ?? "",
                description: product.description || "",
                stock: product.stock ?? "",
                isFeatured: Boolean(product.isFeatured),
            });
        } else {
            setFormData(emptyForm);
        }
    }, [product, open]);

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape" && !loading) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [open, loading, onClose]);

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.image.trim() ||
            !formData.category.trim() ||
            !formData.description.trim()
        ) {
            toast.error("Please complete all product fields");
            return;
        }

        if (
            Number(formData.price) < 0 ||
            Number(formData.stock) < 0
        ) {
            toast.error("Price and stock cannot be negative");
            return;
        }

        const success = await onSubmit({
            name: formData.name.trim(),
            image: formData.image.trim(),
            category: formData.category.trim(),
            price: Number(formData.price),
            description: formData.description.trim(),
            stock: Number(formData.stock),
            isFeatured: formData.isFeatured,
        });

        if (success) {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div
            className="modal-overlay"
            onMouseDown={() => !loading && onClose()}
        >
            <section
                className="product-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="modal-header">
                    <div>
                        <span>
                            {product
                                ? "Edit product"
                                : "New product"}
                        </span>

                        <h2>
                            {product
                                ? "Update product details"
                                : "Add product to catalogue"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    className="product-form"
                    onSubmit={handleSubmit}
                >
                    <div className="two-column">
                        <label>
                            Product name
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Urban Classic Watch"
                            />
                        </label>

                        <label>
                            Category
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Watches"
                            />
                        </label>
                    </div>

                    <label>
                        Product image

                        <CloudinaryUpload
                            value={formData.image}
                            onUpload={(imageUrl) =>
                                setFormData((previous) => ({
                                    ...previous,
                                    image: imageUrl,
                                }))
                            }
                        />
                    </label>

                    <div className="two-column">
                        <label>
                            Price
                            <input
                                type="number"
                                name="price"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Stock
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <label>
                        Description
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                        />

                        Show as featured product
                    </label>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            <Save size={17} />

                            {loading
                                ? "Saving..."
                                : "Save product"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default ProductFormModal;