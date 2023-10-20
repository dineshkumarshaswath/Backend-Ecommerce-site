const express=require("express")
const { isAuthenticatedUser, isAuthorizeRoles } = require("../middleware/authenticateuser")
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../Controllers/orderController")

const router=express.Router()

router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder)
router.route("/myorders").get(isAuthenticatedUser,myOrders)

//Admin order routes
router.route("/admin/orders").get(isAuthenticatedUser,isAuthorizeRoles('admin'),getAllOrders)
router.route("/admin/order/:id").put(isAuthenticatedUser,isAuthorizeRoles('admin'),updateOrder)
                           .delete(isAuthenticatedUser,isAuthorizeRoles('admin'),deleteOrder)

module.exports=router