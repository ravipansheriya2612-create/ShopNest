import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const {
            search = "",
            category = "",
            minPrice,
            maxPrice,
            sort = "newest",
        } = req.query;

        const filter = {};

        if (search.trim()) {
            filter.name = {
                $regex: search.trim(),
                $options: "i",
            };
        }

        if (category.trim()) {
            filter.category = {
                $regex: `^${category.trim()}$`,
                $options: "i",
            };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (
                minPrice !== undefined &&
                minPrice !== "" &&
                !Number.isNaN(Number(minPrice))
            ) {
                filter.price.$gte = Number(minPrice);
            }

            if (
                maxPrice !== undefined &&
                maxPrice !== "" &&
                !Number.isNaN(Number(maxPrice))
            ) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        let sortOption = { createdAt: -1 };

        if (sort === "price-low") {
            sortOption = { price: 1 };
        }

        if (sort === "price-high") {
            sortOption = { price: -1 };
        }

        if (sort === "name") {
            sortOption = { name: 1 };
        }

        const products = await Product.find(filter).sort(
            sortOption
        );

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            image,
            category,
            price,
            description,
            stock,
            isFeatured,
        } = req.body;

        if (
            !name?.trim() ||
            !image?.trim() ||
            !category?.trim() ||
            !description?.trim() ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: "All product fields are required",
            });
        }

        if (Number(price) < 0 || Number(stock) < 0) {
            return res.status(400).json({
                message: "Price and stock cannot be negative",
            });
        }

        const product = await Product.create({
            name: name.trim(),
            image: image.trim(),
            category: category.trim(),
            price: Number(price),
            description: description.trim(),
            stock: Number(stock),
            isFeatured: Boolean(isFeatured),
        });

        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const fields = [
            "name",
            "image",
            "category",
            "price",
            "description",
            "stock",
            "isFeatured",
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        if (Number(product.price) < 0) {
            return res.status(400).json({
                message: "Price cannot be negative",
            });
        }

        if (Number(product.stock) < 0) {
            return res.status(400).json({
                message: "Stock cannot be negative",
            });
        }

        const updatedProduct = await product.save();

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        await product.deleteOne();

        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};