const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt=require('bcrypt')
const Jwt=require('jsonwebtoken')
const crypto=require("crypto")


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please enter the name']
    },
    email: {
        type: String,
        required: [true, "Please enter the email id"],
        unique: true,
        validate: [validator.isEmail, 'Please Enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please Enter the password'],
        maxlength: [12, "Password can't exceed above 12 Characters"],
        select:false

    },
    avatar: {
        type: String
       
    },
    role: {
        type: String,
        default: 'user'
    },

    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpire: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

userSchema.pre('save', async function(next){
   
    if(!this.isModified('password')){
        next()
    }
    this.password=  await bcrypt.hash(this.password,10)
})

userSchema.methods.getJwtToken=function(){
    return Jwt.sign({id:this.id},process.env.JWT_SECRETKEY,
        {expiresIn:process.env.JWT_EXPIRETIME})
}

userSchema.methods.isValidPassword= async function(givenPassword){
         return await bcrypt.compare(givenPassword, this.password)


}

userSchema.methods.getResetToken=async function(){
    
     //Generate Token
     const token= crypto.randomBytes(20).toString('hex')

     //Generate hash and set to resetpassword token
     this.resetPasswordToken=crypto.createHash("sha256").update(token).digest("hex")

     //set the expire time
     this.resetPasswordTokenExpire= Date.now()+30*60*60*1000

     return token 

}



const User=mongoose.model('user',userSchema)

module.exports=User