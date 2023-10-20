const express=require("express")
const { getProduct, newProduct, getSingleProduct, 
    updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require("../Controllers/productControllers")
const { isAuthenticatedUser,isAuthorizeRoles } = require("../middleware/authenticateuser")

const multer=require("multer")
const path=require('path')
  
   const upload=multer({storage:multer.diskStorage({
     destination:function(req,file,cb){
      cb(null,path.join(__dirname,'..','uploads/product'))
     },
     filename:function(req,file,cb){
      cb(null,file.originalname)
     }
        
})})



const router=express.Router()

router.route("/products").get(getProduct)
router.route("/products/:id").get(getSingleProduct)
 //create review router
 router.route("/product/review").put(isAuthenticatedUser,createReview)       

// admin router
router.route("/products/new").post(isAuthenticatedUser,isAuthorizeRoles('admin'),upload.array('images'), newProduct)
router.route("/admin/products").get(isAuthenticatedUser,isAuthorizeRoles('admin'),getAdminProducts)
router.route("/admin/product/:id").delete(isAuthenticatedUser,isAuthorizeRoles('admin'),deleteProduct)
router.route("/admin/product/:id").put(isAuthenticatedUser,isAuthorizeRoles('admin'),upload.array('images'),updateProduct)

router.route("/admin/allreviews").get(isAuthenticatedUser,isAuthorizeRoles('admin'),getReviews)
router.route("/admin/review").delete(isAuthenticatedUser,isAuthorizeRoles('admin'),deleteReview)          

 
                  




                            
                   


module.exports=router