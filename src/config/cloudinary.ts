import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const cloudinaryConfig = () => {
    console.log("process.env.CLOUDINARY_CLOUDE_NAME", process.env.CLOUDINARY_CLOUDE_NAME as string);
    
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUDE_NAME as string,
        api_key: process.env.CLOUDINARY_API_KEY as string,
        api_secret: process.env.CLOUDINARY_API_SECRET as string,
    });
}

export default cloudinaryConfig