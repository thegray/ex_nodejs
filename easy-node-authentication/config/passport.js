var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {
    // passport session setup
    // required for persistent login sessions

    // serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    /* ------------- local signup ------------- */
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function (req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            User.findOne({ 'local.email' : email }, function(err, existingUser) {
                if (err)
                    return done(err);
                if (existingUser)
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                
                if (req.user) {
                    let user = req.user;
                    user.local.email = email;
                    user.local.password = user.generateHash(password);
                    user.save(function(err) {
                        if (err) throw err;
                        return done(null, user);
                    });
                } else {
                    // no user with that email, create the user
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    /* ------------- local login ------------- */
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        
        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' : email }, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Email/Password is wrong.'));
                
                return done(null, user);
            });
        });
    }));

    /* ---------------- google ---------------- */
    passport.use(new GoogleStrategy({
        clientID : configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            if (!req.user) {
                User.findOne({ 'google.id': profile.id }, 
                    function(err, user) {
                        if (err) return done(err);
                        if (user) {
                            // if there is a user id already but no token 
                            // (user was linked at one point and then removed)
                            if (!user.google.token) {
                                user.google.token = token;
                                user.google.name = profile.displayName;
                                user.google.email = profile.email[0].value;

                                user.save(function(err) {
                                    if (err) throw err;
                                    return done(null, user);
                                });
                            }
                            
                            return done(null, user);
                        } else {
                            var newUser = new User();
                            newUser.google.id = profile.id;
                            newUser.google.token = token;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value;

                            newUser.save(function(err) {
                                if (err) throw err;
                                return done(null, newUser);
                            })
                        }
                    });
            } else {
                // user already exists and is logged in, we have to link accounts
                var user = req.user;
                user.google.id = profile.id;
                user.google.token = token;
                user.google.name = profile.displayName;
                user.google.email = profile.emails[0].value;

                user.save(function(err) {
                    if (err) throw err;
                    return done(null, user);
                });
            }  
        })
    }));
};