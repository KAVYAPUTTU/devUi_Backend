//we wrote this middleware separate beacuse for any thing like logout addpost del post we need to authorise the user
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
//authentication middleware
//this will verify that user is present or not
//when we make user login we give then accesstoken and refresh token to them so based on them only we can verify the user
//if we have true login then in request.body i will add a new object req.user
export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        //request has access of cookies becpz we gave them through middleware in app.js
        //and from that we will get accessToken which we added in the user controller
        //user can also send custom header from which we can get the accesstoken
        //we get Bearer <token> but we need only token so replace that text 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        //check for token  
        if (!token) {
            throw new ApiError(401,"unauthorized request")
        }
        //if token is present then we have to use jwt and ask if the given token is correct or not
        //and also get the info from the token that is decode the token
        //jwt.verify takes two things..1.our token 2.and secret from environmentvariable
        const decodedTokeninfo=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        //now do a db request using User model
        //if we have decoded token then we will get _id..refer the gennerateacesstoken in the user model
        //we will also remove unnessary info so use .select and remove password and refresh token
        const user = await User.findById(decodedTokeninfo?._id).select("-password -refreshToken")
    
        //if user not present
        if (!user) {
            throw new ApiError(401,"invalid Access Token")
        }
        //we have access of req..so in the req we will add a new object names user and set the acess of user
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401,"invalid accesstoken")
    }
})