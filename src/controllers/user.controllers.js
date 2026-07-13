import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadoncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
//this method is uded to register user
//now the next step is to create the routes 
const registerUser = asyncHandler( async (req,res)=>{
    //steps for register user
    //1.get user details from frontend
    //2.validation on these details--not empty
    //3.check if useralready exists:check with username and email
    //4.check for images,check for avatar
    //5.upload them to cloudinary--check for avatar
    //6.create user object--create entry in db
    //7.remove password and refresh token fiels from response
    //8.check for user creation
    //return res

    //if the data is coming from form or json then we find it in req.body(here we are using postman(body-raw-json) to send the data)
    const {fullname,email,username,password}=req.body
    console.log(email);

    //validation can be done using  if else on all parameters
    // if (fullname==="") {
    //     throw new ApiError(400,"fullname is required")
    // }
    //or
    if (
        [fullname,email,username,password].some((field)=>
        field?.trim()==="")
    ) {
        throw new ApiError(400,"all fields are required")
    }
    
    //check if aready there
    //since User is a model created by mongoose..this User only will call the db by behalf of you
    //we have a method know as findone on User model
    //through $ we can use different methods like and xor or
    //here the logic is we are finfing the user through email or username
    const existedUser= await User.findOne({
        $or:[{email},{username}]
    })
    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists")
    }

    //check for images
    //since we added middleware on the register route
    //this middleware adds some more fields to the res.body
    //express gives access of req.body
    //multer give access of files this is the reason the middleware multer is added
    //multer already took the path when  clicked submit and stored in its server beacasue we told it to do so in multer file
    const avatarLocalPath = req.files?.avatar[0]?.path //we will take the first property of the object which gives a path from multer.
    // const coverimagelocalpath = req.files?.coverImage[0]?.path
    let coverimagelocalpath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0) {
        coverimagelocalpath=req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }

    //upload them in clodinary
    //clodinary file is already written and exported so we will use it
    //it takes time so we itensionaly make here to stop for some time and do not continue
    const avatar = await uploadoncloudinary(avatarLocalPath)
    const coverImage = await uploadoncloudinary(coverimagelocalpath)

    //check for avatar
    if (!avatar) {
        throw new ApiError(400,"Avatar file is required")
    }

    //make object and make entry in db
    //User is the only one who is able to talk with the db
    //db things can give error and db is in another continent so try catch and await is imp
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    //removing password and referesh token from the object
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"//need to write which u do not want to include
    );

    if(!createduser){
        throw new ApiError(500,"Something went wrong while registering the user in db")
    }
  
    //response in a structured way
    return res.status(201).json(
        new ApiResponse(
            200,
            createduser,
            "User registered successfuly"
        )
    )



    

})

export {registerUser}