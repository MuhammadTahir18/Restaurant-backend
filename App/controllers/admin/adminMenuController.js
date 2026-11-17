let mongoose=require('mongoose');
let menuModel=require('../../models/menuModel.js');

// admin ke liye poori list (out of stock bhi dikhte hain)
let adminMenuList=async(req,res)=>{
    try{
        let items=await menuModel.find().sort({category:1,name:1});
        res.send({status:1,message:"Menu list",data:items});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// naya item
let menuInsert=async(req,res)=>{
    try{
        let {sName,sDescription,nPrice,sCategory,sImageUrl}=req.body;

        if(typeof sName!=='string' || !sName.trim() || typeof sCategory!=='string' || !sCategory.trim()){
            return res.status(400).send({status:0,message:"Name aur category zaroori hain (text mein)"});
        }
        if(typeof nPrice!=='number' || !Number.isFinite(nPrice) || nPrice<0){
            return res.status(400).send({status:0,message:"Price number honi chahiye aur 0 se kam nahi"});
        }

        let item=await menuModel.create({
            name:sName,
            description:typeof sDescription==='string'?sDescription:'',
            price:nPrice,
            category:sCategory,
            imageUrl:typeof sImageUrl==='string'?sImageUrl:''
        });

        res.status(201).send({status:1,message:"Menu item add ho gaya",data:item});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// item badalna (sirf wo fields jo bheji jayein)
let menuUpdate=async(req,res)=>{
    try{
        let id=req.params.id;
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).send({status:0,message:"Galat ID"});
        }

        let {sName,sDescription,nPrice,sCategory,sImageUrl,bAvailable}=req.body;
        let updateObj={};

        if(sName!==undefined){
            if(typeof sName!=='string' || !sName.trim()){
                return res.status(400).send({status:0,message:"Name text honi chahiye"});
            }
            updateObj.name=sName;
        }
        if(sDescription!==undefined){
            if(typeof sDescription!=='string'){
                return res.status(400).send({status:0,message:"Description text honi chahiye"});
            }
            updateObj.description=sDescription;
        }
        if(nPrice!==undefined){
            if(typeof nPrice!=='number' || !Number.isFinite(nPrice) || nPrice<0){
                return res.status(400).send({status:0,message:"Price number honi chahiye aur 0 se kam nahi"});
            }
            updateObj.price=nPrice;
        }
        if(sCategory!==undefined){
            if(typeof sCategory!=='string' || !sCategory.trim()){
                return res.status(400).send({status:0,message:"Category text honi chahiye"});
            }
            updateObj.category=sCategory;
        }
        if(sImageUrl!==undefined){
            if(typeof sImageUrl!=='string'){
                return res.status(400).send({status:0,message:"Image URL text honi chahiye"});
            }
            updateObj.imageUrl=sImageUrl;
        }
        if(bAvailable!==undefined){
            if(typeof bAvailable!=='boolean'){
                return res.status(400).send({status:0,message:"bAvailable true ya false honi chahiye"});
            }
            updateObj.isAvailable=bAvailable;
        }

        if(Object.keys(updateObj).length===0){
            return res.status(400).send({status:0,message:"Badalne ke liye koi field nahi di"});
        }

        let item=await menuModel.findByIdAndUpdate(id,updateObj,{new:true,runValidators:true});
        if(!item){
            return res.status(404).send({status:0,message:"Menu item nahi mila"});
        }

        res.send({status:1,message:"Menu item update ho gaya",data:item});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// item mitana
let menuDelete=async(req,res)=>{
    try{
        let id=req.params.id;
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).send({status:0,message:"Galat ID"});
        }

        let item=await menuModel.findByIdAndDelete(id);
        if(!item){
            return res.status(404).send({status:0,message:"Menu item nahi mila"});
        }

        res.send({status:1,message:"Menu item delete ho gaya",id:id});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

module.exports={adminMenuList,menuInsert,menuUpdate,menuDelete};