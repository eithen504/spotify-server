import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUDE_NAME } from './env';

dotenv.config()

const cloudinaryConfig = () => {
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUDE_NAME as string,
        api_key: CLOUDINARY_API_KEY as string,
        api_secret: CLOUDINARY_API_SECRET as string,
    });
}

export default cloudinaryConfig