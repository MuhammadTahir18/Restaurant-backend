let express=require('express');
const {protect,adminOnly}=require('../../middleware/authMiddleware.js');
const {adminMenuList,menuInsert,menuUpdate,menuDelete}=require('../../controllers/admin/adminMenuController.js');

let adminMenuRoutes=express.Router();

// is file ke SAB routes par protect aur adminOnly lag jayenge
adminMenuRoutes.use(protect,adminOnly);

adminMenuRoutes.get('/',adminMenuList);
adminMenuRoutes.post('/',menuInsert);
adminMenuRoutes.put('/:id',menuUpdate);
adminMenuRoutes.delete('/:id',menuDelete);

module.exports=adminMenuRoutes;