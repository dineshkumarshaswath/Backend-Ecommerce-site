const products=require("../data.json")
const Product = require("../db/productmodel");
const dbConnection = require("../dbconnect");
const dotenv=require("dotenv")

dotenv.config()

dbConnection()
const seedProducts=async()=>{
    try {
       
        const deleteproduct= await Product.deleteMany();
        console.log("all the data  product deleted")
         const allproduct= await Product.insertMany(products)
         console.log("all products inserted" )
        
    } catch (error) {

        console.log(error.message)
        
    }
    process.exit()
   

}

seedProducts()

