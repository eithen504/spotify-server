import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const cloudinaryConfig = () => {
    console.log("process.env.CLOUDINARY_CLOUDE_NAME", process.env.CLOUDINARY_CLOUDE_NAME);
    
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export default cloudinaryConfig