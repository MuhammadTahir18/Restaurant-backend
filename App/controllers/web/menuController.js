let mongoose=require('mongoose');
let menuModel=require('../../models/menuModel.js');

// customer ke liye menu (sirf available items)
let menuList=async(req,res)=>{
    try{
        let filter={isAvailable:true};

        // ?category=Burgers
        if(typeof req.query.category==='string' && req.query.category.trim()){
            filter.category=req.query.category.trim();
        }

        let items=await menuModel.find(filter).sort({category:1,name:1});
        res.send({status:1,message:"Menu list",data:items});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// ek item ki detail
let menuDetail=async(req,res)=>{
    try{
        let id=req.params.id;
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).send({status:0,message:"Galat ID"});
        }

        let item=await menuModel.findById(id);
        if(!item || !item.isAvailable){
            return res.status(404).send({status:0,message:"Menu item nahi mila"});
        }

        res.send({status:1,message:"Menu item",data:item});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

module.exports={menuList,menuDetail};