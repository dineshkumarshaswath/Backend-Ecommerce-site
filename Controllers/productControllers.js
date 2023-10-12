const Product = require("../db/productmodel")
const ErrorHandler = require("../utils/errorHandleer")
const catchAsyncError=require("../middleware/catchAsyncError")
const APIFeatures=require('../utils/apiFeatures')




//get product api --api/v1/products
exports.getProduct= catchAsyncError(async(req,res,next)=>{
    const resPerPage=3
    
    
    let buildQuery=()=>{
        return new APIFeatures(Product.find(),req.query).search().filter()
    }

    const filteredProductsCount=  await buildQuery().query.countDocuments()
    const totalProductCount=await Product.countDocuments({})
    let productsCount=totalProductCount
    if( filteredProductsCount !== totalProductCount){
       
        productsCount=filteredProductsCount
    }

    
    
    const products= await buildQuery().paginate(resPerPage).query
    
    //loading test
    //await new Promise(resolve =>setTimeout(resolve,3000))
    //error test
   // return  next( new ErrorHandler("Product not found",400))
       

    res.status(200).json({
        success:true,
        Message:"successfully got the product data",
        count:productsCount,
        resPerPage,
        products
    })
})

//create product api --api/v1/products/new

exports.newProduct= catchAsyncError(async(req,res,next)=>{
    req.body.user=req.user.id

    const products= await Product.create(req.body);
     res.status(201).json({
        success:true,
        products
     })})


exports.getSingleProduct= catchAsyncError(async(req,res,next)=>{

         const product=await Product.findById( {_id:req.params.id})
    if(!product){
         //res.status(404).json({ success:false,  message:"Product not found" })
       return  next( new ErrorHandler("Product not found",400))
        
    }
      res.status(201).json({
        success:true,
        product
    })

        
   
})

exports.updateProduct= async(req,res,next)=>{
    const products =await Product.findById(req.params.id)
    if(!products){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }


      const product =await Product.findByIdAndUpdate(req.params.id,req.body,
        {new:true,runValidators:true})
        res.status(201).json({
            success:true,
            product
        })


}

exports.deleteProduct= async(req,res,next)=>{
    const products =await Product.findById(req.params.id)
    if(!products){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    
     
     const deleteitem= await Product.findByIdAndDelete(req.params.id)
     return res.status(201).json({
        success:true,
        message:"product successfully deleted"
    })

     
      

}

//Create review

exports.createReview=catchAsyncError(async(req,res,next)=>{
   const{productId,rating,comment}=req.body
   const review={
    user:req.user.id,
    rating,
    comment
   }

   const product=await Product.findById(productId)
   //check the user already post the review
   
     const isReviewed= product.reviews.find(review=>{
         return   review.user.toString() == req.user.id.toString()
    })

    
    if(isReviewed){
        product.reviews.forEach(review=>{
            if(review.user.toString() == req.user.id.toString() ){
                review.comment=comment,
                review.rating=rating
            }
        })


    }else{

        product.reviews.push(review)
        product.noOfReviews=product.reviews.length

    }
   //calculate the average of the ratings
    product.ratings= (product.reviews.reduce((acc,review)=>{
       return  review.rating + acc
    },0))/product.reviews.length

    product.ratings =isNaN(product.ratings)?0:product.ratings
    await product.save({validationBeforeSave:false})
  

    return res.status(200).json({
        success:true,
       product
    })




})

//GetReviews

exports.getReviews=catchAsyncError(async(req,res,next)=>{

    const product=await Product.findById(req.query.id);
    // if(product.reviews.length == 0){
    //     return res.status(404).json({success:false,message:"there is no review for this product"})
    // }
   return  res.status(200).json({
        success:true,
        reviews:product.reviews
    })

})

//deletereviews 
exports.deleteReview=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId)

    //filter the review id
    const reviews=product.reviews.filter(review =>{
        review._id.toString() !== req.query.id.toString()
    })

    const noOfReviews=reviews.length
    //find the average review
    let ratings=reviews.reduce((acc,review)=>{
        return  review.rating + acc
     },0)/reviews.length;
     ratings=isNaN(ratings)?0:ratings

     await Product.findByIdAndUpdate(req.query.productId,{reviews,noOfReviews,ratings})
     return res.status(200).json({success:true})
})


