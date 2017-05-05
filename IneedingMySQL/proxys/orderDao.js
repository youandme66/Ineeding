var Dao=require('./Dao');
var async=require('async');
var util=require('../util/util');
var pool=new Dao();
exports.getGoodById=function(item_params,callback){
	var sql="select * from orders where gid=? and oflags=0";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.addOrder=function(params1,params2,params3,callback){
	var sqlParamsEntity=[];
	var sql1="insert into orders(uid1,uid2,gid,onum,oprice,ocreate,oupdate) values(?,?,?,?,?,?,?)";
	var sql2="update good set gsum=gsum-?,gupdate=? where gid=?";
	var sql3="update user set umoney=umoney-?,uupdate=? where uid=?";
	sqlParamsEntity.push(util.getNewSqlParam(sql1,params1));
	sqlParamsEntity.push(util.getNewSqlParam(sql2,params2));
	sqlParamsEntity.push(util.getNewSqlParam(sql3,params3));
	pool.getConnection(function(err,connection){
		if(err){
			return callback(err,null);
		}
		connection.beginTransaction(function(err){
			if(err){
				return callback(err,null);
			}
			var funcAr=[];
			sqlParamsEntity.forEach(function(sql_param){
				var temp=function(cb){
					var sql=sql_param.sql;
					var param=sql_param.params;
					connection.query(sql,param,function(tErr,rows,fields){
						if(tErr){
							connection.rollback(function(){
								console.log("事务失败,"+sql_param+"Error,"+tErr);
								throw tErr;
							});
						}else{
							return cb(null,'ok');
						}
					});
				};
				funcAr.push(temp);
			});
			async.series(funcAr,function(err,result){
				if(err){
					connection.rollback(function(err){
						connection.release();
						return callback(err,null);
					});
				}else{
					connection.commit(function(err,info){
						if(err){
							connection.rollback(function(err){
								connection.release();
								return callback(err,null);
							});	
						}else{
							connection.release();
							return callback(null,info);
						}
					});
				}
			});
		});
	});
};
exports.getOrderPriceById=function(item_params,callback){
	var sql="select * from orders where oid=? and oflags=0 and uid1=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.getOrderPriceByStatus=function(item_params,callback){
	var sql="select * from orders where oid=? and oflags=? and ostatus=? and uid1=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.getOrderPriceByStatus1=function(item_params,callback){
	var sql="select * from orders where oid=? and oflags=? and ostatus=? and uid2=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.orderOver=function(params1,params2,params3,params4,callback){
	var sqlParamsEntity=[];
	var sql1="update user set umoney=umoney+? where uid=?";
	var sql2="update admin set amoney=amoney+? where auser='liuzhihao'";
	var sql3="update orders set oflags=1,oupdate=? where oid=?";
	sqlParamsEntity.push(util.getNewSqlParam(sql1,params1));
	sqlParamsEntity.push(util.getNewSqlParam(sql1,params2));
	sqlParamsEntity.push(util.getNewSqlParam(sql2,params3));
	sqlParamsEntity.push(util.getNewSqlParam(sql3,params4));
	pool.getConnection(function(err,connection){
		if(err){
			return callback(err,null);
		}
		connection.beginTransaction(function(err){
			if(err){
				return callback(err,null);
			}
			var funcAr=[];
			sqlParamsEntity.forEach(function(sql_param){
				var temp=function(cb){
					var sql=sql_param.sql;
					var param=sql_param.params;
					connection.query(sql,param,function(tErr,rows,fields){
						if(tErr){
							connection.rollback(function(){
								console.log("事务失败,"+sql_param+"Error,"+tErr);
								throw tErr;
							});
						}else{
							return cb(null,'ok');
						}
					});
				};
				funcAr.push(temp);
			});
			async.series(funcAr,function(err,result){
				if(err){
					connection.rollback(function(err){
						connection.release();
						return callback(err,null);
					});
				}else{
					connection.commit(function(err,info){
						if(err){
							connection.rollback(function(err){
								connection.release();
								return callback(err,null);
							});	
						}else{
							connection.release();
							return callback(null,info);
						}
					});
				}
			});
		});
	});
};
exports.orderOver2=function(params1,params2,params3,callback){
	var sqlParamsEntity=[];
	var sql1="update user set umoney=umoney+? where uid=?";
	var sql2="update admin set amoney=amoney+? where auser='liuzhihao'";
	var sql3="update orders set oflags=1,oupdate=? where oid=?";
	sqlParamsEntity.push(util.getNewSqlParam(sql1,params1));
	sqlParamsEntity.push(util.getNewSqlParam(sql2,params2));
	sqlParamsEntity.push(util.getNewSqlParam(sql2,params3));
	pool.getConnection(function(err,connection){
		if(err){
			return callback(err,null);
		}
		connection.beginTransaction(function(err){
			if(err){
				return callback(err,null);
			}
			var funcAr=[];
			sqlParamsEntity.forEach(function(sql_param){
				var temp=function(cb){
					var sql=sql_param.sql;
					var param=sql_param.params;
					connection.query(sql,param,function(tErr,rows,fields){
						if(tErr){
							connection.rollback(function(){
								console.log("事务失败,"+sql_param+"Error,"+tErr);
								throw tErr;
							});
						}else{
							return cb(null,'ok');
						}
					});
				};
				funcAr.push(temp);
			});
			async.series(funcAr,function(err,result){
				if(err){
					connection.rollback(function(err){
						connection.release();
						return callback(err,null);
					});
				}else{
					connection.commit(function(err,info){
						if(err){
							connection.rollback(function(err){
								connection.release();
								return callback(err,null);
							});	
						}else{
							connection.release();
							return callback(null,info);
						}
					});
				}
			});
		});
	});
};
exports.returnGood=function(params1,params2,params3,callback){
	var sqlParamsEntity=[];
	var sql1="update good set gsum=gsum+? where gid=?";
	var sql2="update user set umoney=umoney+? where uid=?";
	var sql3="update orders set oflags=-1 where oid=?";
	sqlParamsEntity.push(util.getNewSqlParam(sql1,params1));
	sqlParamsEntity.push(util.getNewSqlParam(sql2,params2));
	sqlParamsEntity.push(util.getNewSqlParam(sql3,params3));
	pool.getConnection(function(err,connection){
		if(err){
			return callback(err,null);
		}
		connection.beginTransaction(function(err){
			if(err){
				return callback(err,null);
			}
			var funcAr=[];
			sqlParamsEntity.forEach(function(sql_param){
				var temp=function(cb){
					var sql=sql_param.sql;
					var param=sql_param.params;
					connection.query(sql,param,function(tErr,rows,fields){
						if(tErr){
							connection.rollback(function(){
								console.log("事务失败,"+sql_param+"Error,"+tErr);
								throw tErr;
							});
						}else{
							return cb(null,'ok');
						}
					});
				};
				funcAr.push(temp);
			});
			async.series(funcAr,function(err,result){
				if(err){
					connection.rollback(function(err){
						connection.release();
						return callback(err,null);
					});
				}else{
					connection.commit(function(err,info){
						if(err){
							connection.rollback(function(err){
								connection.release();
								return callback(err,null);
							});	
						}else{
							connection.release();
							return callback(null,info);
						}
					});
				}
			});
		});
	});
};
exports.orderReceive=function(params1,callback){
	var sql="update orders set ostatus=1 where oid=? and ostatus=0 and oflags=0 and uid2=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,params1,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.orderRefuse=function(params1,params2,params3,callback){
	var sqlParamsEntity=[];
	var sql1="update good set gsum=gsum+? where gid=?";
	var sql2="update user set umoney=umoney+? where uid=?";
	var sql3="update orders set oflags=-1,ostatus=-1 where oid=?";
	sqlParamsEntity.push(util.getNewSqlParam(sql1,params1));
	sqlParamsEntity.push(util.getNewSqlParam(sql2,params2));
	sqlParamsEntity.push(util.getNewSqlParam(sql3,params3));
	pool.getConnection(function(err,connection){
		if(err){
			return callback(err,null);
		}
		connection.beginTransaction(function(err){
			if(err){
				return callback(err,null);
			}
			var funcAr=[];
			sqlParamsEntity.forEach(function(sql_param){
				var temp=function(cb){
					var sql=sql_param.sql;
					var param=sql_param.params;
					connection.query(sql,param,function(tErr,rows,fields){
						if(tErr){
							connection.rollback(function(){
								console.log("事务失败,"+sql_param+"Error,"+tErr);
								throw tErr;
							});
						}else{
							return cb(null,'ok');
						}
					});
				};
				funcAr.push(temp);
			});
			async.series(funcAr,function(err,result){
				if(err){
					connection.rollback(function(err){
						connection.release();
						return callback(err,null);
					});
				}else{
					connection.commit(function(err,info){
						if(err){
							connection.rollback(function(err){
								connection.release();
								return callback(err,null);
							});	
						}else{
							connection.release();
							return callback(null,info);
						}
					});
				}
			});
		});
	});
};
exports.getOrderWay1=function(item_params,callback){
	var sql="select * from orders where oflags=? and ostatus=? and uid1=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.getOrderWay2=function(item_params,callback){
	var sql="select * from orders where oflags=? and ostatus=? and uid2=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};