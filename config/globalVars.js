/**
 * Created by Jungle on 07/10/2016.
 */

// object holding global variables module.exports means make a public object
module.exports = {
    //db: 'mongodb://localhost/comp2068-fri'
    db: 'mongodb://jdusome:shadowferal4@ds013848.mlab.com:13848/comp2068-fri',
    //random string used to salt our passwords
    secret: 'Yo Its Ya Boi J-Dizzle wut wut 12345',
    ids: {
        //set up OAUTH variables
        //facebook = made up values
        facebook: {
            clientID: '123456789',
            clientSecret: '098321dn023nd03d223d',
            //this is where facebook will redirect user on successful login
            callbackURL: 'https://drinks-application.herokuapp.com/facebook/callback'
        },

        github: {
            clientID: 'bcf98e57345699a97a60',
            clientSecret: 'efc2842bf9c2b6d54339c47d57605dac6d8c748b',
            //this is where facebook will redirect user on successful login
            callbackURL: 'https://drinks-application.herokuapp.com/github/callback'
        }
    }
};
