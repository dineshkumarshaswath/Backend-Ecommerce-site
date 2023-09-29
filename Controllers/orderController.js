
const Order = require("../db/ordermodel")
const Product = require("../db/productmodel")
const catchAsyncError=require("../middleware/catchAsyncError")
const ErrorHandler = require("../utils/errorHandleer")

//create new order
exports.newOrder=catchAsyncError(async(req,res,next)=>{
   const{
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo
   } =req.body

   const order=await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt:Date.now(),
    user:req.user.id

   })
    return res.status(200).json({success:true,order
})


   
})

//Get single order

exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
         const order=await Order.findById(req.params.id).populate('user','name email')
         if(!order){
            return next(new ErrorHandler(`order not found because of this wrong id 
            ${req.params.id}`,400))
         }
        return  res.status(200).json({success:true,order
         })


})

//getlogged user orders

exports.myOrders=catchAsyncError(async(req,res,next)=>{
   const order=await Order.find({user:req.user.id})
   
   return res.status(200).json({success:true,order
   })


})

//Admin order routes

exports.getAllOrders=catchAsyncError(async(req,res,next)=>{
   const order=await Order.find()

   let totalamount=0
   order.forEach(order=>{
      totalamount += order.totalPrice
   })

  
   return res.status(200).json({
      success:true,
      totalamount,
      order
   })


})

//updat order

exports.updateOrder=catchAsyncError(async(req,res,next)=>{
   const order=await Order.findById(req.params.id)
//
   if(order.orderStatus =='Delivered'){
      return next(new ErrorHandler('Order has been already delivered '
      ,400))

   }
   //updating the product stock

   order.orderItems.forEach( async orderItem=>{
          await updateStock(orderItem.product,orderItem.quantity)
   })

   order.orderStatus=req.body.orderStatus
   order.delivereAt=Date.now()
   await order.save()

  return  res.status(200).json({
      success:true,
      order
      
   })

})

//util purpose for update stock
async function updateStock(productId,quantity){
   const product=await Product.findById(productId);
   product.stock=product.stock - quantity
   await product.save({validationBeforeSave:false})

}


//Admin DeleteOrder

exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
   const order=await Order.findById(req.params.id)
   if(!order){
      return next(new ErrorHandler(`order not found because of this wrong id 
      ${req.params.id}`,400))
   }

   const deleteorder= await Order.findByIdAndDelete(req.params.id)
   return res.status(200).json({success:true})

})