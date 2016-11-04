var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
//add reference to the new drinks controller
var drinks = require('./routes/drinks');

var app = express();

// use mongoose to connect to mongodb
var mongoose = require('mongoose');
var config = require('./config/globalVars');
mongoose.connect(config.db);

//include passport packages
var passport = require('passport');
var session = require ('express-session');
var flash = require('connect-flash');
//instantiated to a class within the package (local Strategy)
var localStrategy = require('passport-local').Strategy;


//initialize the passport packages for authentication
//creates and stores messages that can be displayed on different pages
app.use(flash());

app.use(session({
  secret: config.secret,
  //refresh session every time user reloads the page (don't time user out if active)
  resave: true,
  //dont initialize the session until someone signs up or logs in
  saveUninitialized: false
}));

//initialize passport and session class
app.use(passport.initialize());
app.use(passport.session());

//link to the account model we're going to build
var Account = require('./models/account');
passport.use(Account.createStrategy());

// read/write users between passport and mongodb
//will keep track of users between all pages of the application
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//////////////////////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
// tell the application to use the drink controller for URL's starting with "/drinks"
app.use('/drinks', drinks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
