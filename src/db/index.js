import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


//DB conection is async await and we need try catch or .then().catch
//we will have many db connections throughout the project so to write the same async and await wrapper again and again is not good so we make a utility code for this warapper
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        //to know on which host we connected(development host or testing host or ect)
        console.log(`\n MongoDB Connected!! DB Host:${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("ERROR MONGODB connection", error);
        process.exit(1)//read about this exit process

    }
}

export default connectDB