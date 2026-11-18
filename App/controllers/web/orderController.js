let mongoose=require('mongoose');
let menuModel=require('../../models/menuModel.js');
let orderModel=require('../../models/orderModel.js');

// ---------- ORDER PLACE ----------
let orderPlace=async(req,res)=>{
    try{
        let {sAddress,sPhone,aItems}=req.body;

        // 1. Address aur phone check
        if(typeof sAddress!=='string' || !sAddress.trim() || typeof sPhone!=='string' || !sPhone.trim()){
            return res.status(400).send({status:0,message:"Address aur phone zaroori hain"});
        }

        // 2. Items ki list check
        if(!Array.isArray(aItems) || aItems.length===0 || aItems.length>50){
            return res.status(400).send({status:0,message:"Kam az kam 1 item zaroori hai"});
        }

        // 3. Har item check. Same item dobara aaye to quantity jama kar do
        let qtyMap=new Map();   // menuId -> qty
        for(let it of aItems){
            if(!it || typeof it.sMenuId!=='string' || !mongoose.isValidObjectId(it.sMenuId)){
                return res.status(400).send({status:0,message:"Galat menu ID"});
            }
            if(!Number.isInteger(it.nQty) || it.nQty<1 || it.nQty>20){
                return res.status(400).send({status:0,message:"Quantity 1 se 20 ke beech ka poora number ho"});
            }
            qtyMap.set(it.sMenuId,(qtyMap.get(it.sMenuId)||0)+it.nQty);
        }

        // 4. Ek hi query mein sab items database se
        let ids=[...qtyMap.keys()];
        let menuItems=await menuModel.find({_id:{$in:ids}});

        if(menuItems.length!==ids.length){
            return res.status(404).send({status:0,message:"Kuch menu items maujood nahi"});
        }

        // 5. PRICE DATABASE SE, total server nikalta hai
        let orderItems=[];
        let total=0;
        for(let m of menuItems){
            if(!m.isAvailable){
                return res.status(400).send({status:0,message:m.name+" abhi available nahi hai"});
            }
            let qty=qtyMap.get(m._id.toString());
            orderItems.push({menuItem:m._id,name:m.name,price:m.price,qty:qty});
            total+=m.price*qty;
        }

        // 6. Order save
        let order=await orderModel.create({
            user:req.user._id,        // protect ne rakha tha
            items:orderItems,
            totalAmount:total,
            address:sAddress.trim(),
            phone:sPhone.trim()
        });

        res.status(201).send({status:1,message:"Order place ho gaya",data:order});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// ---------- MERE ORDERS ----------
let myOrders=async(req,res)=>{
    try{
        let orders=await orderModel.find({user:req.user._id}).sort({createdAt:-1});
        res.send({status:1,message:"Aap ke orders",data:orders});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// ---------- EK ORDER KI DETAIL ----------
let orderDetail=async(req,res)=>{
    try{
        let id=req.params.id;
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).send({status:0,message:"Galat ID"});
        }

        // user bhi match hona chahiye, warna dusre ka order nazar aa jayega
        let order=await orderModel.findOne({_id:id,user:req.user._id});
        if(!order){
            return res.status(404).send({status:0,message:"Order nahi mila"});
        }

        res.send({status:1,message:"Order detail",data:order});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// ---------- ORDER CANCEL ----------
let orderCancel=async(req,res)=>{
    try{
        let id=req.params.id;
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).send({status:0,message:"Galat ID"});
        }

        let order=await orderModel.findOne({_id:id,user:req.user._id});
        if(!order){
            return res.status(404).send({status:0,message:"Order nahi mila"});
        }

        if(order.status!=='pending'){
            return res.status(400).send({status:0,message:"Ab order cancel nahi ho sakta (status: "+order.status+")"});
        }

        order.status='cancelled';
        await order.save();

        res.send({status:1,message:"Order cancel ho gaya",data:order});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

module.exports={orderPlace,myOrders,orderDetail,orderCancel};