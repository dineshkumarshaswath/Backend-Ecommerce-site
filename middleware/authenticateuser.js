const Jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandleer");
const catchAsyncError = require("./catchAsyncError");
const User = require("../db/usermodel");

exports.isAuthenticatedUser=catchAsyncError(async(req,res,next)=>{
         const{token}=req.cookies
         
         if(!token){
            return next(new ErrorHandler('login first ot handle this server',401))
         }
         const decode= Jwt.verify(token,process.env.JWT_SECRETKEY)
         
         req.user= await User.findById(decode.id)
         next()


})

exports.isAuthorizeRoles=(...roles)=>{
    return (req,res,next)=>{
     // console.log(req.user._id) full value
      //console.log(req.user.id) only id number
      
      if(!roles.includes(req.user.role)){
         return next(new ErrorHandler(`Role ${req.user.role} is not  eligible for access this request`,401))

      }
      next()

   }

}