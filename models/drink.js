/**
 * Created by Jungle on 07/10/2016.
 */

var mongoose = require('mongoose');

//define a schema for the drink model
//this and all other models inherit from mongoose.Schema
var drinkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please enter a name'
    },
    drinkType: {
        type: String,
        required: "Please choose a drink type"
    },
    size: {
        type: Number,
        required: 'Please enter the size'
    },
    units: {
        type: String,
        required: 'Please enter the unit'
    },
    alcoholPercentage: {
        type: Number,
        required: 'Please enter the alcohol %'
    }
});

// make the drinkSchema class public, under the name Drink
module.exports = mongoose.model('Drink', drinkSchema);