const Jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandleer");
const catchAsyncError = require("./catchAsyncError");
const User = require("../db/usermodel");

exports.isAuthenticatedUser=catchAsyncError(async(req,res,next)=>{
         // const{token}=req.headers
         
         // if(!token){
         //    return next(new ErrorHandler('login first ot handle this server',401))
         // }
         // const decode= Jwt.verify(token,process.env.JWT_SECRETKEY)
         
         // req.user= await User.findById(decode.id)
         // next()
        

      if (req.headers) {
         let token;
         
          token = await req.headers["x-auth-token"]
          if (!token) {
            return next(new ErrorHandler('login first ot handle this server',401))
          } else {
              const decode = Jwt.verify(token, process.env.JWT_SECRETKEY);
              req.user = await User.findById(decode.id)
              //console.log(req.user)
              next()
          }


      }






})

exports.isAuthorizeRoles=(...roles)=>{
    return (req,res,next)=>{
     // console.log(req.user._id) full value
      //console.log(req.user.id) only id number
      
      if(!roles.includes(req.user.role)){
         console.log(req.user.role)
         return next(new ErrorHandler(`Role ${req.user.role} is not  eligible for access this request`,401))

      }
      next()

   }

}