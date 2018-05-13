var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var expressValidator =require('express-validator');
var passportStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;
const { body } = require('express-validator/check');
//const { checkSchema } = require('express-validator/check');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//app.use(multer({dest:'./uploads'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handler Session
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//validator
app.post('/recover-password', body().isEmail(), (req, res) => {
  // Assume the validity was already checked
  User.recoverPassword(req.body).then(() => {
    res.send('Password recovered!');
  });
});

//falsh
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*',function (req, res, next) {
  res.locals.users = req.users || null;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
