const express=require("express")
const { isAuthenticatedUser } = require("../middleware/authenticateuser")
const { ordersRequest,verfiyRequest } = require("../Controllers/paymentController")
const router=express.Router()


// router.route("/payment/process").post(isAuthenticatedUser,processPayment)

// router.route("/stripeapi").get(isAuthenticatedUser,sendStripeApi)

router.route("/ordercreate").post(ordersRequest)
router.route("/verifyorder").post(verfiyRequest)



module.exports=router