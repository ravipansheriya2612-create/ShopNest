import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const products = [
    {
        name: "Urban Classic Watch",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
        category: "Watches",
        price: 2499,
        description:
            "A clean everyday watch with a minimal dial and comfortable strap.",
        stock: 15,
        isFeatured: true,
    },
    {
        name: "Wireless Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        category: "Electronics",
        price: 3499,
        description:
            "Comfortable wireless headphones with clear sound and long battery life.",
        stock: 12,
        isFeatured: true,
    },
    {
        name: "Everyday Backpack",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        category: "Bags",
        price: 1899,
        description:
            "A practical backpack with multiple compartments for work and travel.",
        stock: 20,
        isFeatured: false,
    },
    {
        name: "Running Shoes",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
        category: "Footwear",
        price: 2999,
        description:
            "Lightweight running shoes designed for comfort and daily activity.",
        stock: 18,
        isFeatured: true,
    },
    {
        name: "Classic Sunglasses",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
        category: "Accessories",
        price: 1299,
        description:
            "Classic sunglasses with UV protection and a lightweight frame.",
        stock: 25,
        isFeatured: false,
    },
    {
        name: "Smart Desk Lamp",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
        category: "Home",
        price: 1599,
        description:
            "Modern desk lamp with adjustable brightness for study and work.",
        stock: 10,
        isFeatured: false,
    },
];

const seedProducts = async () => {
    try {
        await connectDB();

        await Product.deleteMany();
        await Product.insertMany(products);

        console.log("Sample products inserted successfully");

        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

seedProducts();