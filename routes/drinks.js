/**
 * Created by Jungle on 07/10/2016.
 */

var express = require('express');
//requires the express router to look up and route URLs
var router = express.Router();

//link the controller to the drink model
var Drink = require('../models/drink');

//auth check
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    }
    else {
        res.redirect('/login');
    }
};

//Get main drinks page, get route folder and callback function
router.get('/', isLoggedIn, function(req,res,next){
    //use the drink model to qery the db for drink data
    Drink.find(function(err, drinks)
    {
        if (err) {
            console.log(err);
            res.render('error');
        }

        else {
            //load the drinks page
            res.render('drinks', {
                title: 'All the Booze That\'s Fit to Drink',
                drinks: drinks,
                user: req.user
            });
        }
    });
});

/* GET drinks/add where show form*/
router.get('/add', isLoggedIn, function(req, res, next){
    res.render('add-drink', {
        title: 'Add a New Drink',
        user: req.user
    });
});

/* POST /drinks/add - process the form submission */
router.post('/add', isLoggedIn, function(req,res,next){
    //get input and use mongoose to insert to the db
    //we pass in object, then callback function
    Drink.create( {
        name: req.body.name,
        drinkType: req.body.drinkType,
        size: req.body.size,
        units: req.body.units,
        alcoholPercentage: req.body.alcoholPercentage
    }, function(err, Drink) {
        if (err){
            console.log(err);
            res.render('error', {message: 'Could not Add Drink'});
        }

        else {
            res.redirect('/drinks');
        }
    });
});

/* GET /drinks/delete/_id - process delete */
/* the : means that it is a variable */
router.get('/delete/:_id', isLoggedIn, function (req, res, next){
    //get the id from the URL
    //creates a local variable with the same name
    var _id = req.params._id;

    // delete the document with this _id
    Drink.remove( { _id: _id}, function(err){
        if(err) {
            console.log(err);
            res.render('error', {
                message: 'Could not Delete Drink',
                error: err
            });
        }

        else{
            res.redirect('/drinks');
        }
    });
});

/* GET /drinks/_id - display edit page & fill with values */
router.get('/:_id', isLoggedIn, function (req, res, next){
    //get the id from the URL
    var _id = req.params._id;

    //use Mongoose to get the selected drink document
    Drink.findById({ _id: _id}, function(err, drink){
        if (err) {
            console.log(err);
            res.render('error', {
                messge: 'Could not Load Drink',
                error: err
            });
        }

        else {
            res.render('edit-drink', {
                title: 'Edit a Drink',
                drink: drink,
                user: req.user
            });
        }
    });
});

/* POST /drinks/id - process form submission & update selected doc */
/* we post to the URL, the URL doesnt change */
router.post('/:_id', isLoggedIn, function(req, res, next){
    //get ID from the URL
    var _id = req.params._id;

    // instantiate and populate a new drink object
    var drink = new Drink({
        _id: _id,
        name: req.body.name,
        drinkType: req.body.drinkType,
        size: req.body.size,
        units: req.body.units,
        alcoholPercentage: req.body.alcoholPercentage
    });

    //update the drink
    Drink.update({ _id: _id}, drink, isLoggedIn, function(err){
        if (err){
            console.log(err);
            res.render('error', {
                message: 'Could not Update Drink',
                error: err
            });
        }
        else {
            res.redirect('/drinks');
        }
    });
});

//make public
module.exports = router;