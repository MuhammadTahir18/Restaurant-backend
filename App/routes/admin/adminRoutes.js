let express=require('express');
const {protect,adminOnly}=require('../../middleware/authMiddleware.js');

let adminRoutes=express.Router();

// temporary test route
adminRoutes.get('/ping',protect,adminOnly,(req,res)=>{
    res.send({status:1,message:"Admin route kaam kar raha hai",admin:req.user.name});
});

module.exports=adminRoutes;