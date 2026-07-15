import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadoncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken"
//method to generate tokens
const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        //generating models
        const user =await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //adding the refresh token into the database
        //which means User model is a object so we just added the value like we add in dictionary
        user.refreshToken=refreshToken
        //save
        //here we are only adding a single value but when we use save
        //all methods kick in so no prevent that we need to write validatebeforesave as false
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating refresh and acess token")
    }
    
}


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
    console.log(req.files);
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
const loginUser = asyncHandler(async (req,res) => {
    //1.take data from req body 
    //2.acess using email or username
    //3.find the user
    //4.password check if user is there
    //5.access and refresh token is generated to the user
    //6.send them like cookies
    //response as successfull
    //1.
    const {email,username,password}=req.body;
    //2.
    if (!(username || email)) {
        throw new ApiError(400,"username and email is required")
    }
    //User can talk with mongodb
    //$or is a mongodb query 
    //3.
    const user =await User.findOne({
        $or:[{username},{email}]
    })
    if (!user) {
        throw new ApiError(404,"user not found")
    }
    //4.these isPasswordcorrect geneateaccesstoken refresh token is available on user(our actual user) not User(mongoose model)
    const ispasswordValid = await user.isPasswordCorrect(password)
    if (!ispasswordValid) {
        throw new ApiError(401,"Invalid User credentials")
    }
    //5.we are going to use this method of generating accesstoken and refresh token again and again
    //so keep it in a separate method--it takes some time
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);
    //6.sending then as cookies
    //which info we need to send to the user
    //removing all the unnesssary information
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
     //for cookies we need to develop some options
     //by doinf the below thing we prevent any change from frontend to our cookies
     //server can only modify them
    const options = {
        httpOnly:true,
        secure:true
    }
    //sending response
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            //status code
            200,
            //data - object which we send
            {
                user:loggedInUser,accessToken,refreshToken
            },
            //message
            "User Logges in Successfully"
        )
    )
})
//logout User
//for logout we do not get tdata from a form or anything else
//so we do not have accesss of user to get that we use middleware
const logoutUser = async (req,res) => {
        //delete all the cookies
        //remove the refresh token then only logically the user is logged out
        //now we will design a middleware--authmiddleware
        //go and design the middleware then come
        await User.findByIdAndUpdate(
            //now after jwtmiddleware is done we get the access of req.user
            req.user._id,
            {
                //delete refresh token
                $set:{
                    refreshToken:undefined
                }
            },
            {
                //the response we get has new updated value
                new:true
            }
        )

        const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    //cleacookie is a method in cookieparser to clealr cookie
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))
    }
const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401,"unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFERESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401,"invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401,"Refresh token is expired or used")   
        }
        //verification is done so generate a new one
        const options={
            httpOnly:true,
            secure:true
        }
        const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
        return res
        .status(300)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newrefreshToken},
                "AccessToken refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token")
    }

})
export {registerUser,loginUser,logoutUser,refreshAccessToken}