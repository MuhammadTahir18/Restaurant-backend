let express=require('express');
const {menuList,menuDetail}=require('../../controllers/web/menuController.js');

let menuRoutes=express.Router();

menuRoutes.get('/',menuList);
menuRoutes.get('/:id',menuDetail);

module.exports=menuRoutes;