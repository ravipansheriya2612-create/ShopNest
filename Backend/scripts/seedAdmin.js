import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.ADMIN_EMAIL
            .trim()
            .toLowerCase();

        const existingAdmin = await User.findOne({ email });

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        if (existingAdmin) {
            existingAdmin.name = process.env.ADMIN_NAME;
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin";

            await existingAdmin.save();

            console.log("Admin account updated");
        } else {
            await User.create({
                name: process.env.ADMIN_NAME,
                email,
                password: hashedPassword,
                role: "admin",
            });

            console.log("Admin account created");
        }

        console.log(`Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`Password: ${process.env.ADMIN_PASSWORD}`);

        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

seedAdmin();