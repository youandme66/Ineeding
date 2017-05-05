var itemDao = require('../proxys/itemDao');
var orderDao=require('../proxys/orderDao');
var validator = require('validator');
var eventproxy = require('eventproxy');
var allCfg = require('../config/allCfg');
var image_upload=require('../util/item_image_upload');
var item_upload=image_upload.array('item',3);
var date=new Date();
exports.addSellGood=function(req,res,next){
	try {
		var gtitle = validator.trim(req.body.title);
		var ghandle = validator.trim(req.body.handle);
		var gtype = validator.trim(req.body.type);
		var gdescription = validator.trim(req.body.description);
		var gprice = req.body.price;
		var gsum = req.body.sum;
	} catch (e) {
		return res.json({
			code: -20,
			msg: '信息不玩整'
		});
	}

	var is_title = /^[a-zA-Z0-9\-_\u4E00-\uFA29|\uE7C7-\uE7F3]{1,20}$/;
	if (!is_title.test(gtitle)) {
		return res.json({
			code: -20,
			msg: '不符合正常标题'
		});
	}
	if (isNaN(gprice)) {
		return res.json({
			code: -20,
			msg: '请输入正确金额'
		});
	}
	if (gprice < 0 || gprice > 9999.9) {
		return res.json({
			code: -20,
			msg: '价格只能是0-9999.9'
		});
	}
	if (isNaN(gsum)) {
		return res.json({
			code: -20,
			msg: '请输入正确数量'
		});
	}
	if(gdescription.length>100){
		return res.json({
			code:-20,
			msg:'仅支持一百字'
		});
	}
	var uid = req.session.user.uid;
	var aa = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
	var params = [uid, gtitle, ghandle, gtype, gdescription, gprice, gsum, aa, aa];
	itemDao.insertSellGood(params, function(err, result) {
		if (err) {
			console.log(err);
			if (err.errno == 1452) {
				return res.json({
					code: -20,
					msg: '请不要进行非法操作'
				});
			} else {
				return res.json({
					code: -20,
					msg: '添加物品失败'
				});
			}
		} else if (result.affectedRows > 0) {
			return res.json({
				code: 20,
				msg: '添加物品成功'
			});
		} else {
			return res.json({
				code: -20,
				msg: '未知错误，请重新提交'
			});
		}
	});
};
exports.itemImageUpload=function(req,res,next){
	item_upload(req,res,function(err){
		if(err){
			console.log(err);
		    return res.json({
		    	code:-20,
		    	msg:'图片上传失败，仅限三张图片'
		    });
		}else{
			var uid=req.session.user.uid;
			var gid=req.params.gid;
			var gimage1=gid+'1.jpg';
			var gimage2=gid+'2.jpg';
			var gimage3=gid+'3.jpg';
			if(isNaN(gid)){
				return res.json({
					code:-20,
					msg:'请不要进行非法操作'
				});
			}
			var params=[gimage1,gimage2,gimage3,gid,uid];
			itemDao.addImageUrl(params,function(err,result){
				if(err){
					return res.json({
						code:-20,
						msg:'上传图片失败'
					});
				}else if(result.changedRows>0){
					return res.json({
						code:20,
						msg:'图片上传成功'
					});
				}else if(result.changedRows==0){
					return res.json({
						code:-20,
						msg:'没有此物品'
					});
				}
				else{
					return res.json({
						code:-20,
						msg:'未知错误，请重新提交'
					});
				}
			});
		}
	});
};
exports.itemChangeInfor=function(req,res,next){
	try{
		var gsum=req.body.sum;
		var gdescription=validator.trim(req.body.description);
		var gid=req.body.gid;
		var gprice=req.body.price;
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	if(isNaN(gsum)||isNaN(gid)||isNaN(gprice)){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	if(gsum<0){
		return res.json({
			code:-20,
			msg:'请输入正确数量'
		});
	}
	if(gprice<0||gprice>9999.9){
		return res.json({
			code:-20,
			msg:'不支持此金额'
		});
	}
	var uid=req.session.user.uid;
	var params=[gprice,gsum,gdescription,gid,uid];
	itemDao.updateSellGood(params,function(err,result){
		if(err){
			return res.json({
				code:-20,
				msg:'服务器出错'
			});
		}else if(result.changedRows==0){
			return res.json({
				code:-20,
				msg:'没有此物品'
			});
		}else if(result.changedRows>0){
			return res.json({
				code:20,
				msg:'更改物品信息成功'
			});
		}else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.itemDelete=function(req,res,next){
	try{
		var gid=req.body.gid;
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	if(isNaN(gid)){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	var uid=req.session.user.uid;
	var params=[gid,uid];
	orderDao.getGoodById(params,function(err,result){
		if(err){
			res.json({
				code:-20,
				msg:'服务器出错'
			});
		}else if(typeof result==='undefined' || result.length==0){
			 itemDao.itemDelete(params,function(err,result){
			 	if(result.changedRows>0){
			 		return res.json({
			 			code:20,
			 		    msg:'删除物品成功'
			 		});
			 	}else if(result.changedRows==0){
			 		return res.json({
			 			code:-20,
			 			msg:'删除物品失败'
			 		});
			 	}else{
			 		return res.json({
			 			code:-20,
			 			msg:'未知错误，请重新提交'
			 		});
			 	}
			 });
		}else if(result.length>0){
			return res.json({
				code:-20,
				msg:'此物品正处于交易中无法删除'
			});
		}else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.getItemByAll=function(req,res,next){
	try{
		var type=validator.trim(req.body.type);
		var handle=validator.trim(req.body.handle);
		var title=validator.trim(req.body.title);
		var price=req.body.price;
		var offset=req.params.page;
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	if(isNaN(price)|| isNaN(offset)){
		return res.json({
			code:20,
			msg:'请不要进行非法操作'
		});
	}
	var params={
		gtype:type,
		ghandle:handle,
		gtitle:title,
		order:price,
		offset:offset*20
	};
	itemDao.searchGood(params,function(err,result){
		if(err){
			console.log(err);
			return res.json({
				code:-20,
				msg:'未搜索到'
			})
		}else if(typeof result==='undefined' || result.length==0){
			return res.json({
				code:-20,
				msg:'没有数据了'
			});
		}else if(result.length>0){
			return res.json({
				code:20,
				msg:result
			});
		}else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};