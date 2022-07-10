var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({message:'under constructions'});
});

router.use('/users', require('./users'));
router.use('/tes', require('./tes'));

module.exports = router;
