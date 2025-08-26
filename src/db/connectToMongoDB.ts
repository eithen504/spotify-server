import mongoose from "mongoose";
import { MONGO_DB_URL } from "../config/env";

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(MONGO_DB_URL);
    } catch (error: any) {
        console.log("Error connecting mongo db : ", error.message);
    }
}

export default connectToMongoDB