const express=require("express")
const { getProduct, newProduct, getSingleProduct, 
    updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require("../Controllers/productControllers")
const { isAuthenticatedUser,isAuthorizeRoles } = require("../middleware/authenticateuser")


const router=express.Router()

router.route("/products").get(getProduct)
router.route("/products/new").post(isAuthenticatedUser,isAuthorizeRoles('admin'),newProduct)
router.route("/admin/products").post(isAuthenticatedUser,isAuthorizeRoles('admin'),getAdminProducts)

router.route("/products/:id").get(getSingleProduct).put(updateProduct)
                              .delete(deleteProduct);
router.route("/allreviews").get(getReviews)
router.route("/reviews").delete(deleteReview)


                            
 //create review router
 router.route("/product/review").put(isAuthenticatedUser,createReview)                          


module.exports=router