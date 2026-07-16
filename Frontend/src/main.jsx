import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <CartProvider>
        <App />

        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
            }}
        />
    </CartProvider>
);