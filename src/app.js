import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

//in express we mainly talk about in which form the requests are getting and in which forms we need to send the response
//in requests we have req.params(whenever we get data from url it comes in req.params format)
const app = express()

//all middlewares(uses use keyword)
//using cors for cross origin
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
//best practices to handle the entry of data
//accepting json format from form and setting limit
app.use(express.json({limit:"16kb"}))
//accepting data from url 
app.use(express.urlencoded({extended:true,limit:"16kb"}))
//when ever we want to store files folders images in public folder
app.use(express.static("public"))
//from my server accesing the cookies of users web browser(performing curd operations)
app.use(cookieParser())


export {app}