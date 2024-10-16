import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw new Error("MongoDB connection failed");
    }
};

export default connectDB;