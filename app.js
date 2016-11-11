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

//configure facebook login
var facebookStrategy = require('passport-facebook').Strategy;

passport.use(new facebookStrategy({
  clientID: config.ids.facebook.clientID,
  clientSecret: config.ids.facebook.clientSecret,
  callbackURL: config.ids.facebook.callbackURL
}, function(accessToken, refreshToken, profile, cb) {
      //what to do when facebook returns the profile
      //returns profile, and callback function
      //check if this facebook profile is already in our accounts collection
      Account.findOne({oauthID: profile.id}, function (err, user) {
        if (err) {
          console.log(err);
        }
        else {
          //if the user already exists, continue
          if (user !== null) {
            //run callback and whatever else happens after, send back the user account
            //we send user to the next page (drink or wherever they are going after redirect)
            cb(null, user);
          }
          else {
            //valid user but not yet in mongoDB. add the user
            user = new Account({
              oauthID: profile.id,
              //this will be different on github, they have a username field instead
              username: profile.displayName,
              created: Date.now()
            });
            //try to save the new user
            user.save(function(err){
              if (err){
                console.log(err);
              }
              else {
                cb(null, user);
              }
            });
          }
        }
      });
    }
));

//configure Github login
var githubStrategy = require('passport-github').Strategy;

passport.use(new githubStrategy({
      clientID: config.ids.github.clientID,
      clientSecret: config.ids.github.clientSecret,
      callbackURL: config.ids.github.callbackURL
    }, function(accessToken, refreshToken, profile, cb) {
      //what to do when github returns the profile
      //returns profile, and callback function
      //check if this github profile is already in our accounts collection
      Account.findOne({oauthID: profile.id}, function (err, user) {
        if (err) {
          console.log(err);
        }
        else {
          //if the user already exists, continue
          if (user !== null) {
            //run callback and whatever else happens after, send back the user account
            //we send user to the next page (drink or wherever they are going after redirect)
            cb(null, user);
          }
          else {
            //valid user but not yet in mongoDB. add the user
            user = new Account({
              oauthID: profile.id,
              //this will be different on github, they have a username field instead
              username: profile.username,
              created: Date.now()
            });
            //try to save the new user
            user.save(function(err){
              if (err){
                console.log(err);
              }
              else {
                cb(null, user);
              }
            });
          }
        }
      });
    }
));

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
