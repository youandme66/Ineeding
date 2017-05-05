var Dao=require('./Dao');
var pool=new Dao();
exports.insertSellGood=function(item_params,callback){
	var sql="insert into good(uid,gtitle,ghandle,gtype,gdescription,gprice,gsum,gcreate,gupdate) values(?,?,?,?,?,?,?,?,?)";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.addImageUrl=function(item_params,callback){
	var sql="update good set gimage1=?,gimage2=?,gimage3=?,gblock=0 where gid=? and uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.updateSellGood=function(item_params,callback){
	var sql="update good set gprice=?,gsum=gsum+?,description=? where gid=? and uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.deleteGoodById=function(item_params,callback){
	var sql="delete from good where gid=? and uid=?";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.getGoodById=function(item_params,callback){
	var sql="select * from good where gid=? and gsum>0";
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,item_params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};
exports.searchGood=function(item_params,callback){
	var sql="select * from good where gsum>0";
	var params=[];
	if(item_params.ghandle!="" && item_params.ghandle!=null){
		sql=sql+" and ghandle=?";
		params.push(item_params.ghandle);
	}
	if(item_params.gtype!="" && item_params.gtype!=null){
		sql=sql+" and gtype=?";
		params.push(item_params.gtype);
	}
	if(item_params.gtitle!="" && item_params.gtitle!=null){
		sql=sql+" and gtitle like concat('%',?,'%')";
		params.push(item_params.gtitle);
	}
	if(item_params.order!=null && item_params.order!=0){
		if(item_params.order<0){
			sql=sql+" order by gprice desc";
		}else{
			sql=sql+" order by gprice asc";
		}
	}
	params.push(item_params.offset);
	sql=sql+" limit ?,20";
	console.log(params);
	console.log(sql);
	pool.getConnection(function(err,connection){
		connection.connect();
		connection.query(sql,params,function(err,result){
			callback(err,result);
		});
		connection.release();
	});
};