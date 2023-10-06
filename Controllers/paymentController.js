

//const catchAsyncError=require("../middleware/catchAsyncError")
// const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY)
const Razorpay =require('razorpay')
const crypto=require("crypto")


 const  key_id ='rzp_test_kpkgzH3QE5weEB'

 const  key_secret ='J5dxXpAyacnAMu39kdvBdXTy'

 exports.ordersRequest = (req, res) => {
    try {
        const instance = new Razorpay({ 
        key_id: key_id, 
        key_secret: key_secret 
    });

    var options = {
        amount: req.body.amount * 100,  // amount in the smallest currency unit
        currency: "INR",
    };

    instance.orders.create(options, function (err, order) {
        if (err) {
            console.log(err)
            //return res.send({ code: 500, message: 'Server Err.' })
            return res.status(500).json({message:"server Error"})
        }
        //return res.send({ code: 200, message: 'order created', data: order })
         return res.status(200).json({message:"order created",data:order})
    });
    } catch (error) {
        console.log(error)
    }
 
   
}

exports.verfiyRequest= (req, res) => {


    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

    var expectedSignature = crypto.createHmac('sha256','J5dxXpAyacnAMu39kdvBdXTy')
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === req.body.response.razorpay_signature) {
        res.send({ code: 200, message: 'Sign Valid' });
    } else {

        res.send({ code: 500, message: 'Sign Invalid' });
    }
}







// exports.processPayment=catchAsyncError(async(req,res,next)=>{

//     const paymentIntent= await stripe.paymentIntents.create({
//         amount:req.body.amount,
//         currency:"usd",
//         description:"TEST PAYMENT",
//         metadata:{integration_check:"accept_payment"},
//         shipping:req.body.shipping
//     })

//     res.status(200).json({
//         success:true,
//         client_secret:paymentIntent.client_secret
//     })
// })

// exports.sendStripeApi=catchAsyncError(async(req,res,next)=>{

    

//     res.status(200).json({
//        stripeApiKey:process.env.STRIPE_PUBLISH_KEY
//     })
// })









