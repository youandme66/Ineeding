var mysql=require('mysql');
var mysqlcfg=require('../config/mysqlcfg');
module.exports=function(){
	var pool=mysql.createPool(mysqlcfg);
	return pool;
}