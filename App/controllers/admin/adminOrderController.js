let mongoose=require('mongoose');
let orderModel=require('../../models/orderModel.js');

// kaun sa status kahan se kahan ja sakta hai
let STATUS_FLOW={
    pending:['accepted','cancelled'],
    accepted:['preparing','cancelled'],
    preparing:['out_for_delivery'],
    out_for_delivery:['delivered'],
    delivered:[],
    cancelled:[]
};

// ---------- SAB ORDERS ----------
let adminOrderList=async(req,res)=>{
    try{
        let filter={};

        // ?status=pending
        if(typeof req.query.status==='string' && Object.keys(STATUS_FLOW).includes(req.query.status)){
            filter.status=req.query.status;
        }

        let orders=await orderModel.find(filter)
            .populate('user','name email phone')   // user ki sirf ye 3 fields
            .sort({createdAt:-1});

        res.send({status:1,message:"Orders list",data:orders});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

// ---------- STATUS BADLANA ----------
let orderStatusUpdate=async(req,res)=>{
    try{
        let id=req.params.id;
        let {sStatus}=req.body;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).send({status:0,message:"Galat ID"});
        }
        if(typeof sStatus!=='string' || !Object.keys(STATUS_FLOW).includes(sStatus)){
            return res.status(400).send({status:0,message:"Galat status"});
        }

        let order=await orderModel.findById(id);
        if(!order){
            return res.status(404).send({status:0,message:"Order nahi mila"});
        }

        let allowed=STATUS_FLOW[order.status];
        if(!allowed.includes(sStatus)){
            return res.status(400).send({
                status:0,
                message:order.status+" se "+sStatus+" nahi ho sakta. Allowed: "+(allowed.join(', ')||"koi nahi")
            });
        }

        order.status=sStatus;
        await order.save();

        res.send({status:1,message:"Status update ho gaya",data:order});
    }catch(err){
        console.log(err);
        res.status(500).send({status:0,message:"Server error"});
    }
};

module.exports={adminOrderList,orderStatusUpdate};