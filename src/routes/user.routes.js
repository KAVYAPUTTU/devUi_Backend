import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router();

//we get the control from app.js when we hit /users/api
//when we get /users/api/register and it will run registerUser method which is a controller
//now when ever we hit this route a middleware is first done and in this way we inject the middleware upload from multer 
//through this middleware we can send files 
router.route("/register").post(
    upload.fields([
      {
        name:"avatar" ,//name of the file u taking
        maxCount:1
      },
      {
        name:"coverImage",
        maxCount:1
      }
    ]),
    registerUser)//http://localhost:8000/users/v1/api/register



export default router