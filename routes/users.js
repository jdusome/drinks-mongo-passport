var express = require('express');
var router = express.Router();

//link the controller to the account model
var Account = require('../models/account');


//auth check
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else {
    res.redirect('/login');
  }
};

//Get users page, get route folder and callback function
router.get('/', isLoggedIn, function(req,res,next){
  //use the account model to query the db for account data
  Account.find(function(err, accounts)
  {
    if (err) {
      console.log(err);
      res.render('error');
    }

    else {
      //load the accounts page
      res.render('users', {
        title: 'Users',
        accounts: accounts,
        user: req.user
      });
    }
  });
});

module.exports = router;
