const mongoose =require("mongoose")


const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter the product name'],
        trim:true,
        maxLength:[40, 'please make count under 40 characters']
    },
    price:{
        type:Number,
        default:0.0

    },
    description:{
        type:String,
        required:[true,'please enter product description']
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            images:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"please enter product category"],
        enum:{
            values:[
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message:"please select the correct category"
        }
    },
    seller:{
        type:String,
        required:[true,'please enter product seller Name']
    },
    stock:{
        type:Number,
        required:[true,'please enter how many stocks remaind'],
        maxLength:[30,'product stock cannot exceed 30']

    },
    noOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"user"
            },
            rating:{
                type:Number,
                required:true

            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

const Product= mongoose.model("products",productSchema)

module.exports=Product