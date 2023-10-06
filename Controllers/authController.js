const User = require("../db/usermodel")
const catchAsyncError=require("../middleware/catchAsyncError")
const sendMail = require("../middleware/sendEmail")
const ErrorHandler = require("../utils/errorHandleer")
const sendToken=require('../utils/jwt')
const crypto=require('crypto')




exports.registerUser=catchAsyncError(async(req,res,next)=>{
       const{name,email,password}=req.body
        
       let avatar;
       if(req.file){
              avatar=`https://e-commerce-dk.onrender.com/uploads/user/${req.file.originalname}`
       }


       const user= await User.create({
        name,password,email,avatar
       })
       sendToken(user,201,res)

})

exports.loginUser=catchAsyncError(async(req,res,next)=>{
       const{email,password}=req.body

       if(!email||!password){
              return next(new ErrorHandler('Please enter email & Password',400))
       }

       //finding the user from database

       const user = await User.findOne({email}).select('+password');
       if(!user){
              return next(new ErrorHandler('Invalid crenditials',400))
       
       }

       if(!await user.isValidPassword(password)){
              return next(new ErrorHandler('Invalid crenditials',401))

       }

       sendToken(user,201,res)

})

exports.logoutUser=(req,res,next)=>{
        return res.cookie('token',null,{
              expires:new Date(Date.now()),
              httpOnly:true
       }).status(200).json({success:true,message:"successfully loggedOut"})

      
}

exports.forgotPassword=catchAsyncError(async (req,res,next)=>{
       const user=await User.findOne({email:req.body.email})

       if(!user){
              return next(new ErrorHandler("user not found with this email",404))
       }

       const resetToken=await user.getResetToken();
       await user.save({validationBeforeSave:false})
       //create reset url

       const resetUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`

       const message=`your password reset url is as follows \n\n
       ${resetUrl}\n\n if you have not generate this url ,then ignore it`

       try {
              sendMail({
                     email:user.email,
                     subject:'dkCart password recovery link',
                     message
              })
              return res.status(201).json({success:true,message:`Email sent to this ${user.email}`})
              
       } catch (error) {
              user.resetPasswordToken=undefined,
              user.resetPasswordTokenExpire=undefined
              await user.save({validationBeforeSave:false})
              return next(new ErrorHandler(error.message,500))

              
       }


})

exports.resetPassword=catchAsyncError(async(req,res,next)=>{
      const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex')

      const user=await User.findOne({
       resetPasswordToken,
        resetPasswordTokenExpire:{$gt:Date.now()}
       })
       if(!user){
              return next(new ErrorHandler('password reset token invalid or expired',404))
       }
       if(req.body.password !== req.body.confirmPassword){
              return next (new ErrorHandler('password does not match' ,400))
       }
       user.password=req.body.password
       user.resetPasswordToken=undefined
       user.resetPasswordTokenExpire=undefined;
       await user.save({validationBeforeSave:false})
         
       sendToken(user,201,res)
})

//Get user profile

exports.getUserProfile=catchAsyncError(async(req,res,next)=>{

       const user=await User.findById(req.user.id)
       res.status(200).json({success:true,user})
})

//Change password

exports.changeUserPassword=catchAsyncError(async(req,res,next)=>{
       const user=await User.findById(req.user.id).select('+password')
       
       //check old password

       if(!await user.isValidPassword(req.body.oldPassword)){
              return next(new ErrorHandler('your Old password is incorrect',401))

       }
       //assigning new password

       user.password=req.body.password;
       await user.save();
       res.status(200).json({success:true})

})

//Edit Profile

exports.updateUserProfile=catchAsyncError(async(req,res,next)=>{
    

       //change the name and email
       let newUserData={
              name:req.body.name,
              email:req.body.email
       }
       if(req.file){
            
         avatar=`https://e-commerce-dk.onrender.com/uploads/user/${req.file.originalname}`
         newUserData={...newUserData,avatar}
            

       }
//run validators is important 

       const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
              new:true,
              runValidators:true
       })
       res.status(200).json({success:true,user})




})

//Admin controls
//get all user
exports.getAllUsers=catchAsyncError(async(req,res,next)=>{
       const user=await User.find();
       res.status(200).json({success:true,user})


})

//get specific user
exports.getUser=catchAsyncError(async(req,res,next)=>{
       const user=await User.findById(req.params.id);
       if(!user){
              return next(new ErrorHandler(`user not found with this is ${req.params.id}`,401))
       }
       res.status(200).json({success:true,user})


})

//Admin  :update specific user

exports.updateUser=catchAsyncError(async(req,res,next)=>{
        //change the name and email
        const newUserData={
              name:req.body.name,
              email:req.body.email,
              role:req.body.role
       }
//run validators is important 

       const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
              new:true,
              runValidators:true
       })
       res.status(200).json({success:true,user})

})


//Admin :Delete the specific user
 exports.deleteUser=catchAsyncError(async(req,res,next)=>{
       const user=await User.findById(req.params.id);
       if(!user){
              return next(new ErrorHandler(`user not found with this is ${req.params.id}`,401))
       }

       const deleteuser= await User.findByIdAndDelete(req.params.id)
       return res.status(201).json({
          success:true,
        
      })

 })



