const router = require('express').Router();

router.use('/users', require('./users'));

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index.js /');
  //res.render('index', { title: 'Express' });
});

module.exports = router;
