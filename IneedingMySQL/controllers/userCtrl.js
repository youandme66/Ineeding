var userDao = require('../proxys/userDao');
var validator = require('validator');
var eventproxy = require('eventproxy');
var auth = require('../middlewares/auth');
var cookiecfg = require('../config/cookiecfg');
var allCfg=require('../config/allCfg');
var image_upload=require('../util/user_image_upload');
var user_upload=image_upload.single('user');
var date = new Date();
exports.userRgister=function(req,res,next){
	try{
	var uname=validator.trim(req.body.name);
	var uschool=validator.trim(req.body.school);
	var upassword=validator.trim(req.body.password);
	var uphone=validator.trim(req.body.phone);
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	var user_regx     =  /^[a-zA-Z0-9\-_\u4E00-\uFA29|\uE7C7-\uE7F3]{1,20}$/i;//支持1-20个中文,下划线，横杠组成的字符
    var is_phone_regx = /^\d{11}$/;
    var is_password   =/^[a-zA-Z0-9_#\$@!~\^\+]{8,16}$/;
    var ep=new eventproxy();
    ep.on('prop_err',function(msg){
		res.json({
			code:-20,
			msg:msg
		});
	});
	if ([uname, uschool,upassword,uphone].some(function(item) {
			return item === '';
		})) {
		ep.emit('prop_err', '信息不完整。');
		return;
	}
	if (!user_regx.test(uname)) {
		return ep.emit('prop_err', '用户名不合法。');
	}
	if (!is_phone_regx.test(uphone)) {
		ep.emit('prop_err', '手机号码不正确');
		return;
	}
	if (uname.length < 2) {
		ep.emit('prop_err', '用户名至少需要2个字符。');
		return;
	}
	if(upassword.length<8 || upassword.length>16){
		ep.emit('prop_err','密码必须在8至16位');
		return;
	}
	if(!is_password.test(upassword)){
		ep.emit('prop_err','密码不能有非法字符');
		return;
	}
	var aa =date.getFullYear()+ "-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
	var params=[uname,uschool,upassword,uphone,aa,aa];
	userDao.insert(params, function(err, result) {
		if (err) {
			console.log(err);
			if (err.errno == 1062) {
				return res.json({
					code: -20,
					msg: '手机号已被注册'
				});
			} else if (err.errno == 1452) {
				return res.json({
					code: -20,
					msg: '不存在此学校'
				});
			} else {
				return res.json({
					code: -20,
					msg: '注册失败'
				});
			}
		} else if (result.affectedRows> 0) {
			return res.json({
				code: 20,
				msg: '注册成功'
			});
		} else {
			console.log(result);
			return res.json({
				code: -20,
				msg: '未知错误，请重新提交'
			});
		}
	});
}
exports.getUser=function(req,res,next){
	var uid=req.session.user.uid;
	var params=[uid];
	userDao.getUserById(params,function(err,result){
		if(err){
			return res.json({
				code:-20,
				msg:'服务器出错'
			});
		}
		else if(typeof result==='undefined' || result.length==0){
			return res.json({
				code:-20,
				msg:'操作失败'
			});
		}
		else if(result.length>0){
			return res.json({
				code:20,
				msg:result
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.userSign=function(req,res,next){
	try{
	var uphone=validator.trim(req.body.phone);
	var upassword=validator.trim(req.body.password);
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		})
	}
	var is_phone_regx=/^\d{11}$/;
	var is_password   =/^[a-zA-Z0-9_#\$@!~\^\+]{8,16}$/;
	if(!is_phone_regx.test(uphone)){
		return res.json({
			code:-20,
			msg:'手机号码不正确'
		});
	}
	if(!is_password.test(upassword)){
		return res.json({
			code:-20,
			msg:'密码不能有非法字符'
		});
	}
	var params=[uphone,upassword];
	userDao.getUserByPassword(params,function(err,result){
		if(err){
			return res.json({
				code:500,
				msg:'服务器出错'
			});
		}
		else if(typeof result==='undefined' || result.length==0){
			return res.json({
				code:-20,
				msg:'用户名或密码错误'
			});
		}
		else if(result.length>0){
			auth.gen_session(result,res);
			req.session.user={
				uid:result[0].uid
			};
			console.log({code:20,msg:result});
			return res.json({
				code:20,
				msg:result
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.signOut=function(req,res,next){
	req.session.destroy();
	res.clearCookie(cookiecfg.auth_cookie_name, {
		path: '/'
	});
	return res.json({
		code: 10,
		msg: "注销成功"
	});
};
exports.adminSign=function(req,res,next){
	try{
	var auser=validator.trim(req.body.user);
	var apassword=validator.trim(req.body.password);
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		})
	}
	if ([auser,apassword].some(function(item) {
			return item === '';
		})){
		return res.json({
			code:-20,
			msg:'请输入完整信息'
		});
	}
	var params=[auser,apassword];
	userDao.getAdminByPassword(params,function(err,result){
		if(err){
			return res.json({
				code:500,
				msg:'服务器出错'
			});
		}
		else if(typeof result==='undefined' || result.length==0){
			return res.json({
				code:-20,
				msg:'用户名或密码错误'
			});
		}
		else if(result.length>0){
			auth.gen_session(result,res);
			req.session.user={
				uid:result[0].aid
			};
			return res.json({
				code:20,
				msg:'登录成功'
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.userUnblock=function(req,res,next){
	try{
		var uid=req.body.uid;
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	var params=[uid];
	userDao.userUnblock(params,function(err,result){
		if(err){
			return res.json({
				code:-20,
				msg:'服务器出错'
			});
		}
		else if(result.changedRows==0){
			return res.json({
				code:-20,
				msg:'解除冻结失败'
			});
		}
		else if(result.changedRows>0){
			return res.json({
				code:20,
				msg:'此用户解除冻结成功'
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.changeBlock=function(req,res,next){
	var ublock=req.params.flags;
	if(ublock!=0||ublock!=1){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	var params=[ublock];
	userDao.getUserBlock(params,function(err,result){
		if(err){
			return res.json({
				code:-20,
				msg:'服务器错误'
			});
		}
		else if(typeof result==='undefined' || result.length==0){
			return res.json({
				code:-20,
				msg:'没有此条件用户'
			});
		}
		else if(result.length>0){
			return res.json({
				code:20,
				msg:result
			});
		}
		else{
			return  res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.userBlock=function(req,res,next){
	try{
	var uid=req.body.uid;	
	}catch(e){
		return res.json({
			code:-20,
			msg:'请勿进行非法操作'
		});
	}
	var params=[uid];
	userDao.userblock(params,function(err,result){
		if(err){
			return res.json({
				code:-20,
				msg:'服务器错误'
			});
		}
		else if(result.changedRows==0){
			return res.json({
				code:-20,
				msg:'冻结此用户失败'
			});
		}
		else if(result.changedRows>0){
			return res.json({
				code:-20,
				msg:'冻结此用户成功'
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.adminSignout=function(req,res,next){
	req.session.destroy();
	res.clearCookie(cookiecfg.auth_cookie_name, {
		path: '/'
	});
	return res.json({
		code: 10,
		msg: "注销成功"
	});
};
exports.recharge=function(req,res,next){
	try{
		var umoney=req.body.money;
		// var upassword=validator.trim(req.body.password);
	}catch(e){
		return res.json({
			code:-20,
			msg:'请勿进行非法操作'
		});
	}
	// var is_password=/^[a-zA-Z0-9_#\$@!~\^\+]{8,16}$/;
	if(isNaN(umoney)){
		return res.json({
			code:-20,
			msg:'请输入正确金额'
		});
	}
	// if(!is_password.test(upassword)){
	// 	return res.json({
	// 		code:-20,
	// 		msg:'密码不能有非法字符'
	// 	});
	// }
	var uid=req.session.user.uid;
	var params=[umoney,uid];
	userDao.changeUmoney(params,function(err,result){
		if(err){
			console.log(err);
			return res.json({
				code:-20,
				msg:'服务器出错'
			});
		}
		else if(result.changedRows==0){
			return res.json({
				code:-20,
				msg:'充值失败'
			});
		}
		else if(result.changedRows>0){
			return res.json({
				code:20,
				msg:'充值成功'
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.userImage_upload=function(req,res,next){
	user_upload(req, res, function(err) {
		if (err) {
			return res.json({
				code: -20,
				msg: '图片上传失败'
			});
		} else {
           return res.json({
				code: -20,
				msg: '图片上传成功'
			});
			};
		});
};
exports.authuser=function(req,res,next){
	try{
    var schoolid=validator.trim(req.body.schoolid);
	var authname=validator.trim(req.body.authname);
	}catch(e){
		return res.json({
			code:-20,
			msg:'请勿进行非法操作'
		});
	}
	var is_schoolid=/^[0-9]{6,16}$/;
	if(!is_schoolid.test(schoolid)){
		return res.json({
			code:-20,
			msg:'学号不正确'
		});
	}
	var is_authname=/^[\u4E00-\uFA29|\uE7C7-\uE7F3]{2,10}$/;
	if(!is_authname.test(authname)){
		return res.json({
			code:-20,
			msg:'请填写本人姓名'
		});
	}
	var uid = req.session.user.uid;
	var filename = allCfg.image_fencrypt + uid + allCfg.image_aencrypt + '-' + allCfg.image_encrypt + allCfg.image_admin+'.jpg';
	var aa =date.getFullYear()+ "-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
	var params=[schoolid,filename,authname,aa,uid];
	userDao.addUserInformation(params,function(err,result){
		if(err){
			console.log(err);
			return res.json({
				code:-20,
				msg:'服务器出错'
			});
		}
		else if(result.changedRows==0){
			return res.json({
				code:-20,
				msg:'提交认证信息失败'
			});
		}
		else if(result.changedRows>0){
			req.session.user.uflags=1;
			return res.json({
				code:20,
				msg:'提交认证信息成功,请等待管理员认证'
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.userUpdatePassword=function(req,res,next){
	try{
		var old_password=validator.trim(req.body.old_password);
		var new_password=validator.trim(req.body.new_password);
	}catch(e){
		console.log(e);
		return res.json({
			code:-20,
			msg:'请勿进行非法操作'
		});
	}
	var is_password=/^[a-zA-Z0-9_#\$@!~\^\+]{8,16}$/;
	if(!is_password.test(old_password)){
		return res.json({
			code:-20,
			msg:'新密码格式不正确'
		});
	}
	var uid=req.session.user.uid;
	var params=[new_password,old_password,uid];
	userDao.changePassword(params,function(err,result){
		if(err){
			console.log(err);
			return res.json({
				code:-20,
				msg:'服务器出错'
			});
		}
		else if(result.changedRows==0){
			return res.json({
				code:-20,
				msg:'旧密码错误'
			});
		}
		else if(result.changedRows>0){
			req.session.user.uflags=1;
			return res.json({
				code:20,
				msg:'修改密码成功'
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});	
};
exports.userAuthByAdmin=function(req,res,next){
	userDao.getUserByFlags(function(err,result){
		if(err){
			console.log(err);
			return res.json({
				code:-20,
				msg:'服务器错误'
			});
		}
		else if(typeof result==='undefined' || result.length==0){
			return res.json({
				code:-20,
				msg:'所有用户都已实名制'
			});
		}
		else if(result.length>0){
			return res.json({
				code:20,
				src_image:allCfg.host_ip,
				msg:result
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};
exports.userChangeByAdmin=function(req,res,next){
	try{
		var uid=req.body.uid;
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	if(isNaN(uid)){
		return res.json({
			code:-20,
			msg:'错误指令'
		});
	}
	var params=[uid];
	userDao.changeUserFlags(params,function(err,result){
		if(err){
			console.log(err);
			return res.json({
				code:-20,
				msg:'服务器出错'
			});
		}
		else if(result.changedRows==0){
			return res.json({
				code:-20,
				msg:'此用户认证失败'
			});
		}
		else if(result.changedRows>0){
			return res.json({
				code:20,
				msg:'认证成功'
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	})
}
exports.adminSearchUser=function(req,res,next){
	try{
		var uphone=validator.trim(req.body.phone);
	}catch(e){
		return res.json({
			code:-20,
			msg:'请不要进行非法操作'
		});
	}
	var is_phone_regx=/^[0-9]{11}$/;
	if(!is_phone_regx.test(uphone)){
		return res.json({
			code:-20,
			msg:'请输入正确手机号'
		});
	}
	var params=[uphone];
	userDao.getUserByPhone(params,function(err,result){
		if(err){
			console.log(err);
			return res.json({
				code:-20,
				msg:'服务器错误'
			});
		}
		else if(typeof result==='undefined' || result.length==0){
			return res.json({
				code:-20,
				msg:'无此用户'
			});
		}
		else if(result.length>0){
			return res.json({
				code:20,
				msg:result
			});
		}
		else{
			return res.json({
				code:-20,
				msg:'未知错误，请重新提交'
			});
		}
	});
};