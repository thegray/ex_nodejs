var passport = require('passport');
// todo Localstrategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var secret = require('../secret');

passport.use(new GoogleStrategy({
    clientID : secret.googleAuth.clientID,
    clientSecret: secret.googleAuth.clientSecret,
    callbackURL: secret.googleAuth.callbackURL,
    passReqToCallback: true
},
    function(accessToken, refreshToken, profile, done) {
        User.findOne({'google.id': profile.id})
            .then(function(user) {
                if (!user) { 
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.email = profile.emails[0].value;
                    newUser.google.name = profile.displayName;

                    newUser.save(function(err, savedUser) {
                        if (err) { console.log(err); }
                        return done(err, savedUser);
                    });
                } else {
                    return done(null, user);
                }
            }).catch(done);
}));