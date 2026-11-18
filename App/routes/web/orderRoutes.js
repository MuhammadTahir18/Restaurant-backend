let express=require('express');
const {protect}=require('../../middleware/authMiddleware.js');
const {orderPlace,myOrders,orderDetail,orderCancel}=require('../../controllers/web/orderController.js');

let orderRoutes=express.Router();

orderRoutes.use(protect);   // sab par login zaroori

orderRoutes.post('/',orderPlace);
orderRoutes.get('/',myOrders);
orderRoutes.get('/:id',orderDetail);
orderRoutes.patch('/:id/cancel',orderCancel);

module.exports=orderRoutes;