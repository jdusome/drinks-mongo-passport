var express = require('express');
var router = express.Router();

//link to the account model for reg and login
var Account = require('../models/account');

//reference passport
var passport = require('passport');

//reference flash
var flash = require('connect-flash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Lesson 8',
    message: 'Passport Authentication (Local) - Part 1',
    user: req.user

  });
});

//Get Register
router.get('/register', function(req, res, next){
  res.render('register', {
    title: 'Register',
    user: req.user
  });
});

//POST Register
router.post('/register', function(req, res, next){
  //use the Account model and passport to create a new user
  Account.register(new Account({username: req.body.username}),
  req.body.password,
      function (err, account){
        if(err){
          console.log(err);
          res.redirect('/register');
        }
        else {
          res.redirect('/login');
        }
      });
});

//Get Login
router.get('/login', function(req, res, next){
  //set messages as any session messages, if not empty
  var messages = req.session.messages || []; //flash.message;

  //clear session messages
  req.session.messages = [];

  res.render('login', {
    title: 'Login',
    messages: messages,
    user: req.user
  });
});

//POST Login
//local is our strategy
router.post('/login', passport.authenticate('local',{
  successRedirect: '/drinks',
    failureRedirect: '/login',
  //displays a failure message if the login fails
  failureMessage: 'Invalid Login',
  failureFlash: true
}));

//GET Logout

router.get('/logout', function(req, res, next){
  //log the user out and redirect to homepage, res.logout is built in respond function
  req.logout();
  res.redirect('/');
});

module.exports = router;
