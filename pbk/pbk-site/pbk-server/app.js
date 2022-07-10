const createError = require('http-errors');
const express = require('express');
var path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('./models/User');
require('./config/passport');

const indexRouter = require('./routes/api/v1');

var app = express();

const mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/pbk_server';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('App.js default error 404!');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('App.js error handler!');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
