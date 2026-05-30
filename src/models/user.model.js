import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      //to make a field searchable in a optimized way keep index true
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      //to make a field searchable in a optimized way keep index true
      index: true,
    },
    avatar: {
      type: String,//cloudinary url is used here
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    refreshToken: {
      type: String
    }
  }, {
  timestamps: true
});
//password encryption
//first attribute:event name
//2nd attribute:callback-do not write here arrowfunction becoz we do not have here this reference
//these call back functions take time so they are async
//here there is a problem whenever the data is saved this pre hook will run so many number of times and every time the password is changes
//so to make this code run only when password field is changes we must add if condition
userSchema.pre("save", async function(next){
  if(this.isModified("password")){
  //hash takes two values 1.what is need to be hashed 2.how many rounds
  this.password=bcrypt.hash(this.password,10)
  next()
  }
})
//to check password given by user we can create methods or can use predefined methods
//created own method
userSchema.methods.isPasswordCorrect = async function(password){
  //since bcrypt can do encryption it can also check the password
  //it uses compare and takes two things (plaintextpassword,encryptedpassword)
  return await bcrypt.compare(password,this.password)
}

//injected these methods to the schema
//both are jwt tokens
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
    _id:this._id,
    email:this.email,
    username:this.username,
    fullname:this.fullname,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
)
}
//referesh token is similar to the above code but contains less payload
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
    _id:this._id,
  },
  process.env.REFERESH_TOKEN_SECRET,
  {
    expiresIn:process.env.REFERESH_TOKEN_EXPIRY
  }
)
}
export const User = mongoose.model("User", userSchema)
