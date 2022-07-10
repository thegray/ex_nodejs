const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const slug = require('slug');
const User = mongoose.model('User');

const ArticleSchema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true},
    title: String,
    description: String,
    body: String,
    tagList: [{type: String}],
    favoritesCount: {type: Number, default: 0},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {timestamps: true});

ArticleSchema.plugin(uniqueValidator, {message: "is already taken."});

// generate unique slug to url article
ArticleSchema.methods.slugify = function() {
    this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

// make sure the slug is always set
ArticleSchema.pre('validate', function(next) {
    if (!this.slug) {
        this.slugify();
    }
    return next();
});

ArticleSchema.methods.toJSONFor = function(user) {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tagList,
        favoritesCount: this.favoritesCount,
        favorited: user ? user.isFavorite(this._id) : false,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: this.author.toProfileJSONFor(user)
    };
};

ArticleSchema.methods.updateFavoriteCount = function() {
    var article = this;
    return User.count({favorites: {$in:[article._id]}}).then(function(count) {
        article.favoritesCount = count;
        return article.save();
    });
};

mongoose.model('Article', ArticleSchema);