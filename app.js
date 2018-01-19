const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cfg = require('./config/index')
// const session = require('wafer-node-session');
// const RedisStore = require('connect-redis')(session);  //redis缓存

//连接mongodb开始------
const dbURI = 'mongodb://'+cfg.db_server+'/'+cfg.db;
mongoose.connect(dbURI);
const db =  mongoose.connection;
db.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
db.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});
mongoose.connection.on('open', function () {
    console.log('Mongoose connection is open now');
});
db.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
//连接mongodb结束------
const index = require('./routes/index');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 微信小程序 Node 会话管理中间件
// app.use(session({
//     // 小程序 appId
//     appId:   cfg.applet.AppID,
//     // 小程序 appSecret
//     appSecret: cfg.applet.AppSecret,
//     // 登录地址
//     loginPath: '/user/login',
//     // 会话存储
//     store: new RedisStore({ 
//         "zhoudali":"我还是很喜欢你的"
//     })
// }));
app.use('/', index);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
