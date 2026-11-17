let mongoose=require('mongoose');

let userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    phone:{
        type:String,
        trim:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },  // hash save hoga
    role:{
        type:String,
        enum:[
            'customer',
            'admin'
        ],
        default:'customer'
    }
},{
    timestamps:true
});

let userModel=mongoose.model('user',userSchema);
module.exports=userModel;