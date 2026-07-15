import {
    RefreshCw,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("newest");

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

    const categories = useMemo(() => {
        return [
            ...new Set(
                products.map((product) => product.category)
            ),
        ].sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        const result = products.filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(normalizedSearch);

            const matchesCategory =
                category === "all" ||
                product.category === category;

            const matchesPrice =
                !maxPrice ||
                product.price <= Number(maxPrice);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice
            );
        });

        return result.sort((first, second) => {
            if (sort === "price-low") {
                return first.price - second.price;
            }

            if (sort === "price-high") {
                return second.price - first.price;
            }

            if (sort === "name") {
                return first.name.localeCompare(second.name);
            }

            return (
                new Date(second.createdAt) -
                new Date(first.createdAt)
            );
        });
    }, [products, search, category, maxPrice, sort]);

    return (
        <div className="app-page">
            <Navbar />

            <main>
                <section className="hero-section">
                    <div>
                        <span className="eyebrow">
                            New everyday essentials
                        </span>

                        <h1>
                            Products selected for useful,
                            modern living.
                        </h1>

                        <p>
                            Explore a focused collection of
                            accessories, electronics, home items
                            and lifestyle products.
                        </p>

                        <a href="#products">
                            Explore products
                        </a>
                    </div>

                    <div className="hero-summary">
                        <span>Current collection</span>
                        <strong>{products.length}</strong>
                        <p>carefully listed products</p>
                    </div>
                </section>

                <section
                    className="catalogue-section"
                    id="products"
                >
                    <div className="section-heading">
                        <div>
                            <span>Catalogue</span>
                            <h2>Browse all products</h2>
                        </div>

                        <div className="catalogue-heading-actions">
                            <strong>
                                {filteredProducts.length} products
                            </strong>

                            <button
                                type="button"
                                className="refresh-products-button"
                                onClick={fetchProducts}
                                disabled={loading}
                            >
                                <RefreshCw
                                    size={16}
                                    className={loading ? "spin-icon" : ""}
                                />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="filter-bar">
                        <div className="search-box">
                            <Search size={18} />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search product name"
                            />
                        </div>

                        <div className="filter-select">
                            <SlidersHorizontal size={17} />

                            <select
                                value={category}
                                onChange={(event) =>
                                    setCategory(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All categories
                                </option>

                                {categories.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input
                            className="price-filter"
                            type="number"
                            min="0"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(event.target.value)
                            }
                            placeholder="Maximum price"
                        />

                        <select
                            className="sort-select"
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value)
                            }
                        >
                            <option value="newest">
                                Newest
                            </option>
                            <option value="price-low">
                                Price: Low to high
                            </option>
                            <option value="price-high">
                                Price: High to low
                            </option>
                            <option value="name">
                                Product name
                            </option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="page-state">
                            <div className="spinner" />
                            <p>Loading products...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="page-state">
                            <h3>No matching products</h3>
                            <p>
                                Change your search or filter
                                options.
                            </p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Home;