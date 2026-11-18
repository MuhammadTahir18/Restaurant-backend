let mongoose=require('mongoose');

// order ke andar har item (snapshot)
let orderItemSchema=mongoose.Schema({
    menuItem:{type:mongoose.Schema.Types.ObjectId,ref:'menu',required:true},
    name:{type:String,required:true},
    price:{type:Number,required:true},
    qty:{type:Number,required:true,min:1}
},{_id:false});

let orderSchema=mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    items:{type:[orderItemSchema],validate:(v)=>v.length>0},
    totalAmount:{type:Number,required:true},
    address:{type:String,required:true,trim:true},
    phone:{type:String,required:true,trim:true},
    paymentMethod:{type:String,enum:['cod'],default:'cod'},
    status:{
        type:String,
        enum:['pending','accepted','preparing','out_for_delivery','delivered','cancelled'],
        default:'pending'
    }
},{timestamps:true});

let orderModel=mongoose.model('order',orderSchema);
module.exports=orderModel;