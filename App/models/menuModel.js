let mongoose=require('mongoose');

let menuSchema=mongoose.Schema({
    name:{type:String,required:true,trim:true},
    description:{type:String,trim:true,default:''},
    price:{type:Number,required:true,min:0},
    category:{type:String,required:true,trim:true},
    imageUrl:{type:String,trim:true,default:''},
    isAvailable:{type:Boolean,default:true}
},{timestamps:true});

let menuModel=mongoose.model('menu',menuSchema);
module.exports=menuModel;