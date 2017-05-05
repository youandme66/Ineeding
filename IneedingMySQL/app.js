var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var RedisStore   = require('connect-redis')(session);
var auth         = require('./middlewares/auth');
var morgan       = require('morgan');
var io_redis     = require("socket.io-redis");
var http         = require('http');
var app          = express();
var server       = http.createServer(app);
var io           = require("socket.io")(server);
var route        = require('./web_router');
var cookiecfg    = require('./config/cookiecfg');
app.use(morgan('dev'));
/**
 * 配置cookies,session
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookiecfg.session_secret));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').renderFile);
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: cookiecfg.session_secret,
  store: new RedisStore({
    port: cookiecfg.redis_port,
    host: cookiecfg.redis_host
  })
}));
app.use(function(req, res, next) {    
    res.setHeader('Access-Control-Allow-Origin', '*');    
    res.header('Access-Control-Allow-Credentials', true);    
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
    next();    
});
app.use('/',route);
app.use(function(req, res, next) {
  var err = new Error('没有此页面');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
  	code:500,
  	msg:'没有此页面'
  })
});
if(!module.parent){
  server.listen(3000);
  console.log('listening ' + 3000);
}

module.exports = app;
