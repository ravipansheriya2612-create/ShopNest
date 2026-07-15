import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const token = localStorage.getItem("adminToken");

    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem("adminUser")
        );
    } catch {
        user = null;
    }

    if (!token || user?.role !== "admin") {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default AdminRoute;