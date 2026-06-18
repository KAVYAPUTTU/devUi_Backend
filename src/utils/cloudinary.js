//we will get a local file from our local server which we got from user
//after uploading in the cloudianry we need to remove the file from the local server
//this is done my unlink in the filesystem
import {v2 as cloudinary} from "cloudinary"
//file system in nodejs manages the filehandling
import fs from  "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//it takes time and involves errors
const uploadoncloudinary = async(localFilePath)=>{
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        //it takes two things one is the url of the file and other includes many things 
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("file is uploaded in cloudinary",response.url);//it gives the url after upload
        return response
    } catch (error) {
        //if the file is not uploaded then it should be removed from our local server for save cleaning
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation failed
        return null
    }
}

export {uploadoncloudinary}