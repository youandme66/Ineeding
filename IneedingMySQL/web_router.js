var express       = require('express');
var router        = express.Router();
var userCtrl      = require('./controllers/userCtrl');
var itemCtrl      = require('./controllers/itemCtrl');
var orderCtrl     = require('./controllers/orderCtrl');
var auth          = require('./middlewares/auth');
//用户管理员控制
router.post('/register', userCtrl.userRgister);
router.post('/login',userCtrl.userSign);
router.post('/user/selfinformation',auth.userRequired,userCtrl.getUser);
router.post('/user/loginout',auth.userRequired,userCtrl.signOut);
router.post('/user/recharge',auth.userRequired,auth.blocked,userCtrl.recharge);
router.post('/admin/login',userCtrl.adminSign);
router.post('/admin/unblockuser',auth.adminRequired,userCtrl.userUnblock);
router.post('/admin/blockuser',auth.adminRequired,userCtrl.userBlock);
router.post('/admin/manageruser/:flags',auth.adminRequired,userCtrl.changeBlock);
router.post('/admin/loginout',auth.adminRequired,userCtrl.adminSignout);
router.post('/user/upload_image',auth.userRequired,auth.blocked,userCtrl.userImage_upload);
router.post('/user/authuser',auth.userRequired,auth.blocked,userCtrl.authuser);
router.post('/user/changepassword',auth.userRequired,auth.blocked,userCtrl.userUpdatePassword);
router.post('/admin/userflags',auth.adminRequired,userCtrl.userAuthByAdmin);
router.post('/admin/changeflags',auth.adminRequired,userCtrl.userChangeByAdmin);
router.post('/admin/searchuser',auth.adminRequired,userCtrl.adminSearchUser);
//物品增删改查
router.post('/user/add/sellgood',auth.userRequired,auth.blocked,auth.userAuthened,itemCtrl.addSellGood);
router.post('/user/item/upload_image/:gid',auth.userRequired,auth.blocked,auth.userAuthened,itemCtrl.itemImageUpload);
router.post('/user/item/updateinformation',auth.userRequired,auth.blocked,auth.userAuthened,itemCtrl.itemChangeInfor);
router.post('/user/item/delete/:gid',auth.userRequired,auth.blocked,auth.userAuthened,itemCtrl.itemDelete);
router.post('/item/:page',itemCtrl.getItemByAll);
//订单操作
router.post('/user/order/add',auth.userRequired,auth.blocked,auth.userAuthened,auth.isBuy,orderCtrl.addOrderByUid);
router.post('/user/order/confirm',auth.userRequired,auth.blocked,auth.userAuthened,orderCtrl.updateOrderStatus);
router.post('/user/order/return',auth.userRequired,auth.blocked,auth.userAuthened,orderCtrl.returnOrder);
router.post('/business/order/receive',auth.userRequired,auth.blocked,auth.userAuthened,orderCtrl.receiveOrder);
router.post('/business/order/refuse',auth.userRequired,auth.blocked,auth.userAuthened,orderCtrl.refuseOrder);
//查询订单
module.exports = router;