import {
    LayoutDashboard,
    LogIn,
    PackageCheck,
    ShoppingBag,
    ShoppingCart,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { cartCount } = useCart();

    const adminToken = localStorage.getItem("adminToken");

    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand">
                <div className="brand-icon">
                    <ShoppingBag size={21} />
                </div>

                <div>
                    <strong>ShopNest</strong>
                    <span>Thoughtful everyday products</span>
                </div>
            </Link>

            <nav className="navbar-links">
                <NavLink to="/">Shop</NavLink>

                <NavLink to="/orders">
                    <PackageCheck size={17} />
                    Orders
                </NavLink>

                {adminToken ? (
                    <NavLink to="/admin">
                        <LayoutDashboard size={17} />
                        Admin
                    </NavLink>
                ) : (
                    <NavLink to="/admin/login">
                        <LogIn size={17} />
                        Admin
                    </NavLink>
                )}

                <NavLink to="/cart" className="cart-link">
                    <ShoppingCart size={18} />
                    Cart

                    {cartCount > 0 && (
                        <span>{cartCount}</span>
                    )}
                </NavLink>
            </nav>
        </header>
    );
}

export default Navbar;