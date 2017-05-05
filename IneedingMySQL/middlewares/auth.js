var validator   = require('validator');
var userDao     =require('../proxys/userDao');
var cookiecfg   = require('../config/cookiecfg');
exports.gen_session=function(user,res){
	var is_admin;
	var uflags;
  var ublock;
  var is_visted=1;
	if(user[0].uid){
		is_admin=0;
		uflags=user[0].uflags;
		ublock=user[0].ublock;
	}
	if(user[0].aid){
		is_admin=1;
		uflags=0;
		ublock=user[0].ublock;
	}
	var opts = {
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, //30天
    signed: true,
    httpOnly: false
  };
  res.cookie(cookiecfg.auth_cookie_name, {is_admin:is_admin,is_visted:is_visted,uflags:uflags,ublock:ublock}, opts);
};
exports.userRequired = function(req,res,next){
  if(!req.session.user){
  	return res.json({
  	code:-20,
  	msg:'对不起请登录'	
  });
  }
  if(req.signedCookies.INeeding.is_admin==1){
  	return res.json({
  		code:-20,
  		msg:'请以用户身份登录此页面'
  	});
  }
  var uid=req.session.user.uid;
  var params=[uid];
  userDao.userInformation(params,function(err,result){
    if(err){
      return res.json({
        code:-20,
        msg:'服务器出错'
      });
    }
    else if(typeof result==='undefined' || result.length==0){
      return res.json({
        code:-20,
        msg:'请不要进行非法操作'
      });
    }
    else{
      req.signedCookies.INeeding.uflags=result[0].uflags;
      req.signedCookies.INeeding.ublock=result[0].ublock;
      next();
    }
  });
};
exports.adminRequired = function(req,res,next){
  if(!req.session.user){
  	return res.json({
  	code:-20,
  	msg:'对不起请登录'	
  });
  }
  if(req.signedCookies.INeeding.is_admin==0){
  	return res.json({
  		code:-20,
  		msg:'请以管理员身份登录此页面'
  	});
  }
  next();
};
exports.userAuthened = function(req, res, next){
    if(req.signedCookies.INeeding.uflags==0){
      return res.json({
        code:-20,
        msg:"请实名认证后操作"
      });
    }
    next();
};
exports.blocked = function(req, res ,next){
	if(req.signedCookies.INeeding.ublock==1){
		return res.json({
			code:-20,
			msg:'你的账户已被冻结，请联系管理员！'
		});
	}
  next();
};
exports.isflags=function(req,res,next){
	if(req.signedCookies.INeeding.flags==0){
		return res.json({
			code:-20,
			msg:'需要实名认证'
		});
	}
	next();
};
exports.isPhoneBrowser = function(req, res, next){
  var deviceAgent = req.headers["user-agent"];
  var agentID = deviceAgent.match(/(iphone|ipod|ipad|Android)/);
  if(agentID !== '' && agentID){
    return next();
  }else{
    return res.json({
      code:-20,
      msg:'请使用手机登录'
    });
  }
  next();
};
exports.isBuy=function(req,res,next){
  var uid=req.session.user.uid;
  userDao.getUserById([uid],function(err,result){
    if(err){
      return res.json({
        code:-20,
        msg:'服务器出错'
      });
    }else{
      if(result[0].umoney<0){
        return res.json({
          code:-20,
          msg:'请及时缴已欠的费用,否则冻结此用户'
        });
      }else if(result[0].umoney==0){
        return res.json({
          code:20,
          msg:'您的余额已不足，请及时缴费'
        });
      }else{
        next();
      }
    }
  });
};