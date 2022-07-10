const mongoose = require('mongoose');
const User = mongoose.model('User');
const router = require('express').Router();
const auth = require('../auth');
var logpbk = require('../../utils/logpbk');
const filelocation = 'routes/api/profiles.js'

// anytime hit request to /:username route, 
// check if :username exist or not
// request will contain only username
// then check if user exist using that username
// found user then forwarded using next() to route /:username
router.param('username', function(req, res, next, username) {
    logpbk(filelocation + ' param username');
    User.findOne({username: username}).then( (user) => {
        if (!user) { return res.sendStatus(404); }
        req.profile = user;
        return next();
    }).catch(next);
});

// check if user by id exist
router.get('/:username', auth.optional, function(req, res, next) {
    logpbk(filelocation + ' /:username get');
    if (req.payload) {
        User.findById(req.payload.id).then(function(user) {
            if (!user) { return res.json({
                profile: req.profile.toProfileJSONFor(false)
            }); }
            return res.json({
                profile: req.profile.toProfileJSONFor(user)
            });
        }).catch(next);
    } else {
        return res.json({
            profile: req.profile.toProfileJSONFor(false)
        });
    }
});

// route for follow a user
router.post('/:username/follow', auth.required, function(req, res, next) {
    logpbk(filelocation + ' /:username/follow post');
    User.findById(req.payload.id).then(function(user) {
        if(!user) { return res.sendStatus(401); }
        return user.follow(req.profile._id).then(function() {
            return res.json({profile: req.profile.toProfileJSONFor(user)});
        });
    }).catch(next);
});

// route for unfollow a user
router.delete('/:username/follow', auth.required, function(req, res, next) {
    logpbk(filelocation + ' /:username/follow delete');
    User.findById(req.payload.id).then(function(user) {
        if(!user) { return res.sendStatus(401); }
        return user.unfollow(req.profile._id).then(function() {
            return res.json({profile: req.profile.toProfileJSONFor(user)});
        });
    }).catch(next);
})

module.exports = router;