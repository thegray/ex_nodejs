const router = require('express').Router();
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  console.log('users.js /');
});

// route for auth using google
// could be '/api/auth/google/start/' or others
router.post('/auth/google/start', // change to GET to test lol
    passport.authenticate('google', { 
      session: false, 
      scope: ['profile', 'email']
}));

// callback from google
router.get('/auth/google/callback', 
  passport.authenticate('google', {session: false}), );

module.exports = router;
