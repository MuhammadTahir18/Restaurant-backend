let express=require('express');
const {protect,adminOnly}=require('../../middleware/authMiddleware.js');
const {adminOrderList,orderStatusUpdate}=require('../../controllers/admin/adminOrderController.js');

let adminOrderRoutes=express.Router();

adminOrderRoutes.use(protect,adminOnly);

adminOrderRoutes.get('/',adminOrderList);
adminOrderRoutes.patch('/:id/status',orderStatusUpdate);

module.exports=adminOrderRoutes;