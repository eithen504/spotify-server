import mongoose from "mongoose";

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL || "");
    } catch (error: any) {
        console.log("Error connecting mongo db : ", error.message);
    }
}

export default connectToMongoDB