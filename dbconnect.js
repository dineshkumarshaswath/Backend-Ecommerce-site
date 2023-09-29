const mongoose=require("mongoose")
const mongodb=require("mongodb")

const dbConnection =()=>{
    try {

        // const URL=process.env.MONGO_DB_URL
        const parser={
            useNewUrlParser:true,
            useUnifiedTopology:true
        }

        mongoose.connect(process.env.MONGO_DB_URL,parser)
        console.log("db connected successfully")
        
    } catch (error) {
        console.log(`internal server error:${error}`)
        
    }
}

module.exports=dbConnection

