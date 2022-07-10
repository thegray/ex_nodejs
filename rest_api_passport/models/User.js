const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config/config').secret;

const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, require: [true, "cannot be empty."], lowercase: true, index: true},
    email: {type: String, unique: true, required: [true, "cannot be empty."], lowercase: true, index: true},
    salt: String,
    hash: String,
    favorites: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Article'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }]
}, {timestamps: true});

// validate uniqueness of email or something
UserSchema.plugin(uniqueValidator, {message: "is already taken."});

// set hash password
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

// checker if req's password is same with user's password in db
UserSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

// create JSON web token expire 60 days
// will be stored and user in frontend's window.localstorage()
UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate()+60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
};

// return specified user's properties
UserSchema.methods.toAuthJSON = function() {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT()
    };
};

UserSchema.methods.toProfileJSONFor = function(user) {
    return {
        username: this.username,
        following: user ? user.isFollowing(this._id) : false
    };
};

// method for add id of a article to user favorite
UserSchema.methods.favorite = function(id) {
    if(this.favorites.indexOf(id) === -1) {
        this.favorites.push(id);
    }
    return this.save();
};

// method for remove favorite
UserSchema.methods.unfavorite = function(id) {
    this.favorites.remove(id);
    return this.save();
};

// method check if id is already in array favorites (if user already favorite an article)
UserSchema.methods.isFavorite = function(id) {
    return this.favorites.some(function(favoriteId) {
        return id.toString() === favoriteId.toString();
    });
};

UserSchema.methods.follow = function(id) {
    if(this.following.indexOf(id) === -1) {
        this.following.push(id);
    }
    return this.save();
};

UserSchema.methods.unfollow = function(id) {
    this.following.remove(id);
    return this.save();
};

UserSchema.methods.isFollowing = function(id) {
    return this.following.some(function(followId) {
        return id.toString() === followId.toString();
    });
};

mongoose.model('User', UserSchema);