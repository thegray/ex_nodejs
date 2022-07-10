const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('User');
const passport = require('passport');
var logpbk = require('../../utils/logpbk');
const filelocation = 'routes/api/users.js'

// create user, setting its fields
// save it and returning it as json
router.post('/users/create', function(req,res,next) {
    logpbk(filelocation + ' /users post');
    let user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save().then(function(){
        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

// login user
// return the logged in user if success
router.post('/users/login', function(req,res,next) {
    logpbk(filelocation + ' /users/login post');
    if(!req.body.user.email){
        return res.status(422).json({errors: {email: "can't be blank."}});
    }

    if(!req.body.user.password){
        return res.status(422).json({errors: {password: "can't be blank."}});
    }

    passport.authenticate('local', {session: false}, function(err, user, info){
        if(err){return next(err);}

        if(user){
            user.token = user.generateJWT();
            return res.json({user: user.toAuthJSON()});
        } else {
            return res.status(422).json(info);
        }
    })(req,res,next)
});

// get user profile, use authentication if logged in
router.get('/user', auth.required, function(req,res,next) {
    logpbk(filelocation + ' /users get');
    User.findById(req.payload.id).then(function(user){
        if(!user){return res.sendStatus(401);}

        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

// update user
router.put('/user', auth.required, function(req,res,next) {
    logpbk(filelocation + ' /users put');
    User.findById(req.payload.id).then(function(user){
        if(!user){return res.sendStatus(401);}

        if(typeof req.body.user.username !== 'undefined'){
            user.username = req.body.user.username;
        }
        if(typeof req.body.user.email !== 'undefined'){
            user.email = req.body.user.email;
        }
        if(typeof req.body.user.password !== 'undefined'){
            user.setPassword(req.body.user.password);
        }

        return user.save().then(function(){
            return res.json({user: user.toAuthJSON()});
        });
    }).catch(next);
});

// middleware to show errors at validating
router.use(function(err,req,res,next) {
    logpbk(filelocation + ' validator middleware');
    if(err.name === 'ValidationError') {
        return res.json({
            errors: Object.keys(err.errors).reduce(function(errors ,key){
                errors[key] = err.errors[key].message;
                return errors;
            }, {})
        });
    }
    return next(err);
});

module.exports = router;