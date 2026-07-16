import {
    Eye,
    EyeOff,
    LogIn,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
    Link,
    useNavigate,
} from "react-router-dom";
import API from "../services/api";

function AdminLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !formData.email.trim() ||
            !formData.password
        ) {
            toast.error("Enter email and password");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post(
                "/auth/login",
                {
                    email: formData.email
                        .trim()
                        .toLowerCase(),
                    password: formData.password,
                }
            );

            localStorage.setItem(
                "adminToken",
                response.data.token
            );

            localStorage.setItem(
                "adminUser",
                JSON.stringify(response.data.user)
            );

            toast.success("Admin login successful");
            navigate("/admin");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to login"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">
            <section className="admin-login-intro">
                <Link to="/" className="admin-brand">
                    <ShieldCheck size={24} />
                    ShopNest Admin
                </Link>

                <div>
                    <span>Catalogue management</span>

                    <h1>
                        Manage products from one focused
                        workspace.
                    </h1>

                    <p>
                        Add, update and remove products while
                        keeping the customer catalogue current.
                    </p>
                </div>
            </section>

            <section className="admin-login-form-section">
                <form
                    className="admin-login-form"
                    onSubmit={handleSubmit}
                >
                    <span>Protected access</span>
                    <h2>Admin login</h2>
                    <p>
                        Use the administrator credentials created
                        by the backend seed command.
                    </p>

                    <label>
                        Email address
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    email: event.target.value,
                                })
                            }
                            placeholder="admin@shopnest.com"
                        />
                    </label>

                    <label>
                        Password

                        <div className="password-input">
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={formData.password}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        password:
                                            event.target.value,
                                    })
                                }
                                placeholder="Enter password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </label>

                    <button
                        type="submit"
                        className="admin-login-button"
                        disabled={loading}
                    >
                        <LogIn size={18} />

                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>

                    <Link to="/" className="return-shop">
                        Return to product catalogue
                    </Link>
                </form>
            </section>
        </main>
    );
}

export default AdminLogin;