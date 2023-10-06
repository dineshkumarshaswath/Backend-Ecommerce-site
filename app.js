const express=require("express")
const products=require("./Routers/productRouter")
const errorMiddleware=require("./middleware/errorhandle")
const users=require("./Routers/userRouter")
const orders=require("./Routers/orderRouter")
const payment=require('./Routers/paymentRouter')
const cors=require('cors')
const path =require("path")
const dotenv=require("dotenv")


dotenv.config({path:path.join(__dirname,'config/config.env')})




const app=express()

app.use(express.json())
app.use(cors())

app.use('/uploads',express.static(path.join(__dirname,'uploads'))) 

//this middleware used for cookies




app.use("/api/v1/",products)
app.use("/api/v1/",users)
app.use("/api/v1",orders)
app.use("/api/v1/",payment)



app.use(errorMiddleware)




module.exports=app