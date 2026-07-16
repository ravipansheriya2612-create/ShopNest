import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is missing from environment variables"
            );
        }

        mongoose.set("strictQuery", false);

        await mongoose.connect(process.env.MONGO_URI);

        console.log(
            `MongoDB Host: ${mongoose.connection.host}`
        );

        console.log(
            `MongoDB Database: ${mongoose.connection.name}`
        );
    } catch (error) {
        console.error(
            `MongoDB connection failed: ${error.message}`
        );

        process.exit(1);
    }
};

export default connectDB;