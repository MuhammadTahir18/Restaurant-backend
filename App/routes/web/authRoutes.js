let express=require('express');
const {userRegister,userLogin,getMe}=require('../../controllers/web/authController.js');
const {protect}=require('../../middleware/authMiddleware.js');
let authRoutes=express.Router();

// post api
authRoutes.post('/register',userRegister);
authRoutes.post('/login',userLogin);
authRoutes.get('/me',protect,getMe);

module.exports=authRoutes;