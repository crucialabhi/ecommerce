// import {v2 as cloudinary} from 'cloudinary';
import pkg from "cloudinary";
const { v2: cloudinary } = pkg;
import fs from "fs";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloude = async (localPath) => {
  try {
    if (!localPath) {
      return null;
    }

        const respone = await cloudinary.uploader.upload(localPath, {
            resource_type : "auto"
        })
        
        fs.unlinkSync(localPath);
        return respone;


    } catch (error) {
        fs.unlinkSync(localPath);
        return null;
    }
}
