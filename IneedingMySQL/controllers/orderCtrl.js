var orderDao=require('../proxys/orderDao');
var itemDao=require('../proxys/itemDao');
var userDao=require('../proxys/userDao');
var validator = require('validator');
var eventproxy = require('eventproxy');
var allCfg = require('../config/allCfg');
var date=new Date();
exports.addOrderByUid = function(req, res, next) {
	try {
		var uid1 = req.session.user.uid;
		var gid = req.body.gid;
		var onum = req.body.num;
	} catch (e) {
		return res.json({
			code: -20,
			msg: '请不要进行非法操作'
		});
	}
	if (isNaN(uid1) || isNaN(gid) || isNaN(onum)) {
		return res.json({
			code: -20,
			msg: '请不要进行非法操作'
		});
	}
	if (onum < 0) {
		return res.json({
			code: -20,
			msg: '请不要进行非法操作'
		});
	}
	var oprice;
	itemDao.getGoodById([gid], function(err, result) {
		if (err) {
			return res.json({
				code: -20,
				msg: '服务器出错'
			});
		} else if (typeof result == 'undefined' || result.length == 0) {
			return res.json({
				code: -20,
				msg: '请不要进行非法操作'
			});
		} else {
			if(result[0].gsum-onum<0){
				return res.json({
					code:-20,
					msg:'此物品不足'+onum
				});
			}
			var oprice = result[0].gprice;
			var uid2 = result[0].uid;
			var aprice = onum * oprice;
			userDao.getUserById([uid1], function(err, result1) {
				if (err) {
					return res.json({
						code: -20,
						msg: '服务器出错'
					});
				} else {
					if (result1[0].umoney-aprice < 0) {
						return res.json({
							code: -20,
							msg: '你的余额为'+result1[0].umoney+',请重新选择数量'
						});
					}else {
						var aa = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
						var params1 = [uid1, uid2, gid, onum, aprice, aa, aa];
						var params2 = [onum, aa, gid];
						var params3 = [aprice, aa, uid1];
						orderDao.addOrder(params1, params2, params3, function(err, result) {
							if (err) {
								return res.json({
									code: -20,
									msg: '下单失败'
								});
							} else {
								return res.json({
									code: 20,
									msg: '下单成功'
								});
							}
						});
					}
				}
			});
			
		}
	});
};
exports.updateOrderStatus=function(req,res,next){
	try {
		var oid = req.body.oid;
	} catch (e) {
		return res.json({
			code: -20,
			msg: '请不要进行非法操作'
		});
	}
	if (isNaN(oid)) {
		return res.json({
			code: -20,
			msg: '请不要进行非法操作'
		});
	}
	var uid = req.session.user.uid;
	var aa = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
	var params2 = [oid,0,1,uid];
	orderDao.getOrderPriceByStatus(params2, function(err, result) {
		if (err) {
			return res.json({
				code: -20,
				msg: '服务器出错'
			});
		} else if (typeof result === 'undefined' || result.length == 0) {
			return res.json({
				code: -20,
				msg: '没有你的未完成订单'
			});
		} else if (result.length > 0) {
			var oid = result[0].oid;
			var oprice = result[0].oprice;
			var uid2 = result[0].uid2;
			var oprice1 = oprice * 0.9;
			var params1 = [oprice1, uid2];
			var params4 = [aa, oid];
			userDao.getUserUid2([uid], function(err, result2) {
				if (err) {
					return res.json({
						code: -20,
						msg: '服务器出错'
					});
				} else {
					if (result2[0].uid2 != null) {
						var uid3 = result2[0].uid2;
						var oprice2 = oprice * 0.05;
						var oprice3 = oprice * 0.05;
						var params2 = [oprice2, uid3];
						var params3 = [oprice3];
						orderDao.orderOver(params1, params2, params3, params4, function(err, result) {
							if (err) {
								return res.json({
									code: -20,
									msg: '确认收货失败'
								});
							} else {
								return res.json({
									code: -20,
									msg: '确认收货成功'
								});
							}
						});
					} else {
						var oprice2 = oprice * 0.1;
						var params2 = [oprice2];
						orderDao.orderOver2(params1, params2, params4, function(err, result) {
							if (err) {
								return res.json({
									code: -20,
									msg: '确认收货失败'
								});
							} else {
								return res.json({
									code: 20,
									msg: '确认收货成功'
								});
							}
						});
					}
				}
			})

		} else {
			return res.json({
				code: -20,
				msg: '未知错误，请重新提交'
			});
		}
	});
};
exports.returnOrder=function(req,res,next){
	var ep = new eventproxy();
	try {
		var oid = req.body.oid;
	} catch (e) {
		return res.json({
			code: -20,
			msg: '请不要进行非法操作'
		});
	}
	if (isNaN(oid)) {
		return res.json({
			code: -20,
			msg: '请不要进行非法操作'
		});
	}
	var uid = req.session.user.uid;
	var aa = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
	var params4 = [oid, uid];
	orderDao.getOrderPriceById(params4, function(err, result) {
		if (err) {
			return res.json({
				code: -20,
				msg: '服务器出错'
			});
		} else if (typeof result === 'undefined' || result.length == 0) {
			return res.json({
				code: -20,
				msg: '没有你的未完成订单'
			});
		} else if (result.length > 0) {
			ep.emit('next1', result);
		} else {
			return res.json({
				code: -20,
				msg: '未知错误，请重新提交'
			});
		}
	});
	ep.on('next1', function(result) {
		var gsum = result[0].onum;
		var gid = result[0].gid;
		var umoney = result[0].oprice;
		var params1 = [gsum, gid];
		var params2 = [umoney, uid];
		var params3 = [oid];
		orderDao.returnGood(params1, params2, params3, function(err, result) {
			if (err) {
				return res.json({
					code: -20,
					msg: '退货失败'
				});
			} else {
				return res.json({
					code: 20,
					msg: '退货成功'
				});
			}
		});
	});
};
exports.getOrderByWay1=function(req,res,next){
};
exports.refuseOrder=function(req,res,next){
	var ep=new eventproxy();
	try{
		var oid=req.body.oid;
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	if(isNaN(oid)){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	var uid2=req.session.user.uid;
	var params=[oid,0,0,uid2];
	orderDao.getOrderPriceByStatus1(params,function(err,result){
		if(err){
			return res.json({
			code:-20,
			msg:'服务器出错'	
			});
		}else if(typeof result==='undefined' || result.length==0){
			return res.json({
				code:-20,
			    msg:'没要符合你的订单'
			});
		}else if(result.length>0){
			ep.emit('deal1',result);
		}else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
	ep.on('deal1',function(result){
		var gsum=result[0].onum;
		var umoney=result[0].oprice;
		var uid1=result[0].uid1;
		var gid=result[0].gid;
		var params1=[gsum,gid];
		var params2=[umoney,uid1];
		var params3=[oid];
		orderDao.orderRefuse(params1,params2,params3,function(err,result){
			if(err){
				return res.json({
					code:-20,
					msg:'拒绝订单失败'
				});
			}else{
				return res.json({
					code:-20,
					msg:'拒绝订单成功'
				});
			}
		});
	});
};
exports.receiveOrder=function(req,res,next){
	try{
		var oid=req.body.oid;
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	if(isNaN(oid)){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	var uid2=req.session.user.uid;
	var params=[oid,uid2];
	orderDao.orderReceive(params,function(err,result){
		if(err){
			return res.json({
				code:-20,
				msg:'服务器出错'
			});
		}else if(result.changedRows==0){
			return res.json({
				code:-20,
				msg:'请核对你的订单'
			});
		}else{
			return res.json({
				code:20,
				msg:'接受订单成功'
			});
		}
	});
};