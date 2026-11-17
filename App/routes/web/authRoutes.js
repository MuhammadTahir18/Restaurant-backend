let express=require('express');
const {userRegister,userLogin}=require('../../controllers/web/authController.js');

let authRoutes=express.Router();

// post api
authRoutes.post('/register',userRegister);
authRoutes.post('/login',userLogin);

module.exports=authRoutes;