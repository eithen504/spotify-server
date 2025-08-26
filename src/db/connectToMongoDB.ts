import mongoose from "mongoose";

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL as string);
    } catch (error: any) {
        console.log("Error connecting mongo db : ", error.message);
    }
}

export default connectToMongoDB