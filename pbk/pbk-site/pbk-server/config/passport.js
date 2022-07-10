const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, done){
    User.findOne({'local.email': email}).then(function(user) {
        if(!user || !user.validPassword(password)){
            return done(null, false, {errors: {"email or password":"is invalid."}})
        }
        return done(null, user);
    }).catch(done);
}));