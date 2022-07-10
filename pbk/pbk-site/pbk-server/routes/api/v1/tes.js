const router = require('express').Router();

router.get('/', function(req, res, next) {
    console.log('tes: ' + req.url);
    res.sendStatus(200);
});

module.exports = router;