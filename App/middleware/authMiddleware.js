let jwt=require('jsonwebtoken');
let userModel=require('../models/userModel.js');

// Login check: token asli hai ya nahi
let protect=async(req,res,next)=>{
    try{
        let header=req.headers.authorization;

        // 1. Header mein token hai?
        if(!header || !header.startsWith('Bearer ')){
            return res.status(401).send({status:0,message:"Pehle login karein"});
        }

        // 2. "Bearer abc123" mein se sirf "abc123" nikalna
        let token=header.split(' ')[1];

        // 3. Token check: galat ya expire ho to yahan error throw hota hai
        let decoded=jwt.verify(token,process.env.JWT_SECRET);

        // 4. Database se user nikalna
        let user=await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).send({status:0,message:"User maujood nahi"});
        }

        // 5. User ko aage ke functions ke liye rakh do
        req.user=user;
        next();    // chowkidar ne guzarne diya
    }catch(err){
        if(err.name==='JsonWebTokenError' || err.name==='TokenExpiredError'){
            return res.status(401).send({status:0,message:"Token galat ya expire ho gaya hai"});
        }
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// Admin check: protect ke BAAD lagta hai
let adminOnly=(req,res,next)=>{
    if(req.user.role!=='admin'){
        return res.status(403).send({status:0,message:"Ye kaam sirf admin kar sakta hai"});
    }
    next();
};

module.exports={protect,adminOnly};