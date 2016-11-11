/**
 * Created by Jungle on 04/11/2016.
 */

var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

//username and password are automatically defined in passport if we use local strategy
var accountSchema = new mongoose.Schema({
    //empty schema is okay
    oauthID: String,
    created: Date
});

//passport local model will use the accountSchema when storing user accounts
//will inherit all functions of passport local mongoose
accountSchema.plugin(plm);

//make this public
module.exports = mongoose.model('Account', accountSchema);