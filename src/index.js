// require('dotenv').config({path: './env'})
//or
import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()










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