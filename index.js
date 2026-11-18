let express=require('express');
let mongoose=require('mongoose');
let cors=require('cors');
require('dotenv').config();
const authRoutes=require('./App/routes/web/authRoutes.js');
const adminRoutes=require('./App/routes/admin/adminRoutes.js');
const menuRoutes=require('./App/routes/web/menuRoutes.js');
const adminMenuRoutes=require('./App/routes/admin/adminMenuRoutes.js');
const orderRoutes=require('./App/routes/web/orderRoutes.js');
const adminOrderRoutes=require('./App/routes/admin/adminOrderRoutes.js');

let app=express();
app.use(cors());
app.use(express.json());   // routes se PEHLE, warna req.body khali aayegi

app.get('/health',(req,res)=>{
    res.send({status:1,message:"Server ok"});
});

app.use('/web/api/auth',authRoutes);
app.use('/admin/api',adminRoutes);
app.use('/web/api/menu',menuRoutes);
app.use('/admin/api/menu',adminMenuRoutes);
app.use('/admin/api',adminRoutes); 
app.use('/web/api/orders',orderRoutes);
app.use('/admin/api/orders',adminOrderRoutes);

// Mongodb connect
mongoose.connect(process.env.DB_URI).then(()=>{
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT,()=>{
        console.log("Server is running at "+process.env.PORT+" port");
    });
}).catch((err)=>{
    console.log("MongoDB connect nahi hua:",err.message);
});