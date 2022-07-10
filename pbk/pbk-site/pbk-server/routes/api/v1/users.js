const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

router.post('/create', function(req, res, next) {
  let newUser = new User({
    local: {
      username: req.body.username,
      email: req.body.email,
      hash: req.body.password
    }
  });

  newUser.local.hash = newUser.getHash(req.body.password);

  newUser.save(function(err) {
    if (err) { return next(err) };

    res.json({user: newUser.toAuthJSON()});
  });
});

router.post('/login', function(req, res, next) {
  if(!req.body.email){
    return res.status(422).json({errors: {email: "can't be blank."}});
  }

  if(!req.body.password){
    return res.status(422).json({errors: {password: "can't be blank."}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info) {
    if(err) {return next(err);}
    if(user) {
      console.log('login success!');
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next)
});

router.get('/:username', function(req, res, next) {
  User.findOne({'local.username' : req.params.username})
  .exec(function(err, found) {
    if(err) {return next(err); }
    if (found)
      res.status(200).send(found);
    else
      res.status(404).send({});
  })
});

router.get('/', function(req, res, next) {
  console.log('users: ', req.path);
  res.sendStatus(200);
});

module.exports = router;
