const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const router = require('express').Router();

router.get('/', function(req, res, next) {
    Article.find().distinct('tagList').then(function(tags) {
        return res.json({tags: tags});
    }).catch(next);
});

module.exports = router;