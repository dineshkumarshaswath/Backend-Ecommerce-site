const express=require("express")
const products=require("./Routers/productRouter")
const errorMiddleware=require("./middleware/errorhandle")
const users=require("./Routers/userRouter")
const orders=require("./Routers/orderRouter")
const cors=require('cors')

const cookieParser=require("cookie-parser")

const app=express()

app.use(express.json())
app.use(cors())

//this middleware used for cookies
app.use(cookieParser())



app.use("/api/v1/",products)
app.use("/api/v1/",users)
app.use("/api/v1",orders)



app.use(errorMiddleware)




module.exports=app