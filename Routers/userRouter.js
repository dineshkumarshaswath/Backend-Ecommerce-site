
const express=require('express')
const { registerUser, loginUser, logoutUser, forgotPassword,
     resetPassword, getUserProfile,
      changeUserPassword, 
      updateUserProfile,
      getUser,
      getAllUsers,
      updateUser,
      deleteUser} = require('../Controllers/authController')
const { isAuthorizeRoles, isAuthenticatedUser } = require('../middleware/authenticateuser')

const router=express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route("/forgot").post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/myprofile').get(isAuthenticatedUser,getUserProfile)
router.route('/user/changepassword').put(isAuthenticatedUser,changeUserPassword)
router.route('/user/updatemyprofile').put(isAuthenticatedUser,updateUserProfile)

//Admin Routes
router.route('/admin/users').get(isAuthenticatedUser,isAuthorizeRoles('admin'),getAllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser,isAuthorizeRoles('admin'),getUser)
                                 .put(isAuthenticatedUser,isAuthorizeRoles('admin'),updateUser)
                                 .delete(isAuthenticatedUser,isAuthorizeRoles('admin'),deleteUser)



module.exports=router