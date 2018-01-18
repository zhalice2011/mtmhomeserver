var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cfg = require('./config/index')

//连接mongodb开始------
var dbURI = 'mongodb://'+cfg.db_server+'/'+cfg.db;
mongoose.connect(dbURI);
var db =  mongoose.connection;
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

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
