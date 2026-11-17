
let userModel=require('../../models/userModel.js');
let bcrypt=require('bcryptjs');
let jwt=require('jsonwebtoken');

// token (ticket) banane ka function
let makeToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'7d'});
};

// register
let userRegister=async(req,res)=>{
    try{
        let {sName,sEmail,sPhone,sPassword}=req.body;

        if(!sName || !sEmail || !sPassword){
            return res.status(400).send({status:0,message:"Name, email aur password zaroori hain"});
        }
        if(sPassword.length<6){
            return res.status(400).send({status:0,message:"Password kam az kam 6 characters ka ho"});
        }

        let exists=await userModel.findOne({email:sEmail.toLowerCase()});
        if(exists){
            return res.status(409).send({status:0,message:"Ye email pehle se registered hai"});
        }

        let hashed=await bcrypt.hash(sPassword,12);   // password ko hash karna

        let user=await userModel.create({
            name:sName,
            email:sEmail,
            phone:sPhone,
            password:hashed,
            role:'customer'      // hamesha customer, client se role kabhi nahi lete
        });

        res.status(201).send({
            status:1,
            message:"Register ho gaya",
            token:makeToken(user._id),
            data:{id:user._id,name:user.name,email:user.email,role:user.role}
        });
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// login
let userLogin=async(req,res)=>{
    try{
        let {sEmail,sPassword}=req.body;

        if(!sEmail || !sPassword){
            return res.status(400).send({status:0,message:"Email and password is necessary "});
        }

        let user=await userModel.findOne({email:sEmail.toLowerCase()}).select('+password');

        // dono galat cases mein ek hi message, taake hacker ko pata na chale email maujood hai ya nahi
        if(!user || !(await bcrypt.compare(sPassword,user.password))){
            return res.status(401).send({status:0,message:"Email or password is  wrong"});
        }

        res.send({
            status:1,
            message:"Login ho gaya",
            token:makeToken(user._id),
            data:{id:user._id,name:user.name,email:user.email,role:user.role}
        });
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// apni profile
let getMe=async(req,res)=>{
    res.send({
        status:1,
        data:{
            id:req.user._id,
            name:req.user.name,
            email:req.user.email,
            phone:req.user.phone,
            role:req.user.role
        }
    });
};
module.exports={userRegister,userLogin,getMe};