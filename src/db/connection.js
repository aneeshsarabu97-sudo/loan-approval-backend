import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("Database connected sucuesfully");
    } catch (error) {
        console.log("Database connection error",error);
        process.exit(1)
    }
}

export default connectDB;