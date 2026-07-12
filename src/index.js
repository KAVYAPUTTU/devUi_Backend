// require('dotenv').config({path: './env'})
//or
import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js"

// const app=express();
dotenv.config({
    path: './env'
})

//connectDB is a async function so on completion we will get a promise so apply .then and .catch on the function
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port:${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONOGODB Connection failed!!!",err);
    
})










/*
import express from "express"
const app = express()

//iffis ()-function()-return--()()
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("error that express app is not able to connect"); 
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR",error);
        throw err
    }
})()*/