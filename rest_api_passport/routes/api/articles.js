const mongoose = require('mongoose');
const router = require('express').Router();
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');
const auth = require('../auth');
var logpbk = require('../../utils/logpbk');
const filelocation = 'routes/api/articles.js'

// route for get user feed
router.get('/feed', auth.required, function(req, res, next) {
    logpbk(filelocation + ' /feed get');
    let limit = 20;
    let query = {};
    let offset = 0;

    if(typeof req.query.limit !== 'undefined'){
        limit = req.query.limit;
    }

    if(typeof req.query.offset !== 'undefined'){
        offset = req.query.offset;
    }

    User.findById(req.payload.id).then(function(user) {
        if(!user) { return res.sendStatus(401); }

        Promise.all([
            Article.find({author: {$in: user.following}})
                .limit(Number(limit))
                .skip(Number(offset))
                .populate('author')
                .exec(),
            Article.count({author: {$in: following}})
        ]).then(function(results) {
            let articles = results[0];
            let articleCount = results[1];

            return res.json({
                articles: articles.map(function(article) {
                    return article.toJSONFor(user);
                }),
                articleCount: articleCount
            });
        });
    }).catch(next);
})

// route for creating new article 
// user must logged in, bcos need to set an author for the article
router.post('/create', auth.required, function(req, res, next) {
    logpbk(filelocation + ' /create post');
    User.findById(req.payload.id).then(function(user) {
        if (!user) { return res.sendStatus(401); }
        var article = new Article(req.body.article);
        article.author = user;
        return article.save().then(function() {
            return res.json({article: article.toJSONFor(user)})
        });
    }).catch(next);
});

// middleware to check if article is exist when request hit param :article
router.param('article', function(req, res, next, slug) {
    logpbk(filelocation + ' param article');
    Article.findOne({slug: slug})
        .populate('author')
        .then(function(article) {
            if (!article) {
                return res.sendStatus(404);
            }
            req.article = article;
            return next();
        }).catch(next);
});

// route for get article by slug
/* What we do here is use a Promise for Async action 
   which checks if there is a logged in user 
   and populates the autor field of req.article (article found by :article), 
   and returns the article displayed for user, or not (if there is no logged in user). */
router.get('/:article', auth.optional, function(req, res, next) {
    logpbk(filelocation + ' /:article get');
    Promise.all([
        req.payload ? User.findById(req.payload.id) : null,
        req.article.populate('author').execPopulate() // -> author is received from param middleware
    ]).then(function(results) {
        let user = results[0];
        return res.json({article: req.article.toJSONFor(user)});
    }).catch(next);
});

// route for update article
router.put('/:article', auth.required, function (req, res, next) {
    logpbk(filelocation + ' /:article put');
    User.findById(req.payload.id).then(function(user) {
        if(req.article.author._id.toString() === req.payload.id.toString()) {
            if(typeof req.body.article.title !== 'undefined') {
                req.article.title = req.body.article.title;
            }

            if(typeof req.body.article.description !== 'undefined') {
                req.article.description = req.body.article.description;
            }

            if(typeof req.body.article.body !== 'undefined') {
                req.article.body = req.body.article.body;
            }

            return req.article.save().then(function() {
                return res.json({article: req.article.toJSONFor(user)});
            });
        } else {
            return res.sendStatus(403);
        }
    }).catch(next);
});

// route for delete article
router.delete(':/article', auth.required, function(req, res, next) {
    logpbk(filelocation + ' /:article delete');
    User.findById(req.payload.id).then(function(user) {
        if(req.article.author._id.toString() === req.payload.id.toString()) {
            req.article.remove().then(function() {
                return res.sendStatus(204);
            });
        } else {
            return res.sendStatus(403);
        }
    }).catch(next);
});

// route for comment in an article
router.post('/:article/comments', auth.required, function(req, res, next) {
    logpbk(filelocation + ' /:article/comments post');
    User.findById(req.payload.id).then(function(user) {
        if(!user) { return res.sendStatus(401); }
        let comment = new Comment(req.body.comment);
        comment.author = user;
        comment.article = req.article;
        comment.save();
        req.article.comments.push(comment);
        return req.article.save().then(function() {
            return res.json({comment: comment.toJSONFor(user)});
        });
    }).catch(next);
});

// route for get comments in an article
router.get('/:article/comments', auth.optional, function(req, res, next) {
    logpbk(filelocation + ' /:article/comments get');
    Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user) {
        return req.article.populate({
            path: 'Comments',
            populate: { path: 'author' },
            options: {
                sort: {
                    createdAt: 'desc'
                }
            }
        }).execPopulate().then(function() {
            return res.json({ comments: req.article.comments.map(function(comment) {
                return comment.toJSONFor(user);
            })});
        });
    }).catch(next);
});

// middleware to check if comment exist when req hit param :comment
router.param('comment', function(req, res, next, id) {
    logpbk(filelocation + ' param comment');
    Comment.findById(id).then(function(comment) {
        if(!comment) { return res.sendStatus(404); }
        req.comment = comment;
        return next();
    }).catch(next);
});
// route for delete a comment in an article
router.delete('/:article/comments/:comment', auth.required, function(req, res, next) {
    logpbk(filelocation + ' /:article/comments/:comment delete');
    User.findById(req.payload.id).then(function(user) {
        if(req.comment.author._id.toString() === req.payload.id.toString()) {
            req.article.comments.remove(req.comment._id);
            return req.article.save().then(Comment.findOne({_id: req.comment._id}).remove().exec())
            .then(function() {
                return res.sendStatus(204);
            });
        } else {
            return res.sendStatus(403);
        }
    }).catch(next);
});

// route for favorit action an article
router.post('/:article/favorite', auth.required, function(req, res, next) {
    logpbk(filelocation + ' /:article/favorite post');
    User.findById(req.payload.id).then(function(user) {
        if(!user) { return res.sendStatus(401); }
        return user.favorite(req.article._id).then(function() {
            return req.article.updateFavoriteCount().then(function() {
                return res.json({article: req.article.toJSONFor(user)});
            })
        });
    }).catch(next);
});

// route for get articles
router.get('/', auth.optional, function(req, res, next) {
    logpbk(filelocation + ' / get');
    let limit = 20, offset = 0, query = {};
    if(typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }
    if(typeof req.query.offset !== 'undefined'){
        offset = req.query.offset;
    }
    if(typeof req.query.tag !== 'undefined'){
        query.tagList = {"$in": [req.query.tag]};
    }
    Promise.all([
        req.query.author ? User.findOne({username: req.query.author}) : null,
        req.query.favorited ? User.findOne({username: req.query.favorited}) : null,
    ]).then(function(results) {
        let favoriter = results[1]; //favorited results
        let author = results[0];

        if(author) { query.author = author._id; }
        
        if(favoriter) {
            query._id = {$in: favoriter.favorites};
        } else if(req.query.favorited) {
            query._id = {$in: []};
        }

        return Promise.all([
            Article.find(query)
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({createdAt: 'desc'})
                .populate('author')
                .exec(),
            Article.count(query).exec(),
            req.payload ? User.findById(req.payload.id) : null
        ]).then(function(results) {
            let articles = results[0];
            let articleCount = results[1];
            let user = results[2];

            return res.json({
                articles: articles.map(function(article) {
                    return article.toJSONFor(user);
                }),
                articleCount: articleCount
            });
        });
    }).catch(next);
});

module.exports = router;