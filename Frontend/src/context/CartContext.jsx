import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            return (
                JSON.parse(
                    localStorage.getItem("shopnestCart")
                ) || []
            );
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            "shopnestCart",
            JSON.stringify(cart)
        );
    }, [cart]);

    const addToCart = (product) => {
        if (product.stock <= 0) {
            toast.error("Product is out of stock");
            return false;
        }

        const existingItem = cart.find(
            (item) => item._id === product._id
        );

        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                toast.error(
                    "You cannot add more than available stock"
                );

                return false;
            }

            setCart((previous) =>
                previous.map((item) =>
                    item._id === product._id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                )
            );

            toast.success("Cart quantity updated");

            return true;
        }

        setCart((previous) => [
            ...previous,
            {
                ...product,
                quantity: 1,
            },
        ]);

        toast.success("Product added to cart");

        return true;
    };

    const updateQuantity = (productId, quantity) => {
        setCart((previous) =>
            previous.map((item) => {
                if (item._id !== productId) {
                    return item;
                }

                const safeQuantity = Math.max(
                    1,
                    Math.min(quantity, item.stock)
                );

                return {
                    ...item,
                    quantity: safeQuantity,
                };
            })
        );
    };

    const removeFromCart = (productId) => {
        setCart((previous) =>
            previous.filter(
                (item) => item._id !== productId
            )
        );

        toast.success("Product removed from cart");
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = useMemo(
        () =>
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            ),
        [cart]
    );

    const cartTotal = useMemo(
        () =>
            cart.reduce(
                (total, item) =>
                    total +
                    item.price * item.quantity,
                0
            ),
        [cart]
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                cartTotal,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
};