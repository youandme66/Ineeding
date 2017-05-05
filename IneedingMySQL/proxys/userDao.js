var Dao=require('./Dao');
var pool=new Dao();
exports.insert=function(user_params,callback){
	var sql="insert into user(uname,uschool,upassword,uphone,ucreate,uupdate) values(?,?,encode(?,'xianfeng'),?,?,?)";
	pool.getConnection(function(err,connection){
	connection.connect();
	connection.query(sql,user_params,function(err,result){
           callback(err,result);
	});	
	connection.release();
	});
};
exports.getUserById=function (user_params,callback) {
	var sql='select uname,uschool,uphone,ulevel,umoney,uschoolid,authname from user where uid=?';
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.getUserByPassword=function(user_params,callback){
	var sql="select uid,uname,ulevel,uphone,uflags,ublock,umoney from user where uphone=? and decode(upassword,'xianfeng')=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.userUnblock=function(user_params,callback){
	var sql="update user set ublock=0 where uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.userblock=function(user_params,callback){
	var sql="update user set ublock=1 where uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.getAdminByPassword=function(user_params,callback){
	var sql="select aid,ablock from admin where auser=? and apassword=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.getUserBlock=function(user_params,callback){
	var sql="select uid,uname,uschool,uphone,udescription,uschoolid,uimage from user where ublock=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.changeUmoney=function(user_params,callback){
	var sql="update user set umoney=umoney+? where uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.addUserInformation=function(user_params,callback){
	var sql="update user set uschoolid=?,uimage=?,authname=?,uupdate=? where uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.changePassword=function(user_params,callback){
	var sql="update user set upassword=encode(?,'xianfeng') where decode(upassword,'xianfeng')=? and uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.getUserByFlags=function(callback){
	var sql="select uid,uphone,uname,uschoolid,uimage,authname from user where uflags=0 and authname!=''"
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.changeUserFlags=function(user_params,callback){
	var sql="update user set uflags=1 where uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
	});
};
exports.userInformation=function(user_params,callback){
	var sql='select ublock,uflags from user where uid=?';
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.getUserByPhone=function(user_params,callback){
	var sql='select uid,uname,uphone,uschool from user where uphone=?';
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
	});
};
exports.getUserUid2=function(user_params,callback){
	var sql="select uid2 from user where uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,user_params,function(err,result){
			callback(err,result);
		});
	});
};