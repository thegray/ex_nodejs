const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcryptjs = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');
//const secret = require('../config/config').secret;

const UserSchema = new mongoose.Schema({
    local: {
        username: {type: String, unique: true, require: [true, "cannot be empty."], lowercase: true, index: true},
        email: {type: String, unique: true, required: [true, "cannot be empty."], lowercase: true, index: true},
        hash: {type: String, required: [true, "cannot be empty."]}
    },
    google: {
        id : String,
        token : String,
        email : String,
        name : String
    }
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: "is already taken."});

UserSchema.methods.getHash = function(password) {
    let salt = bcryptjs.genSaltSync(SALT_WORK_FACTOR);
    let hash = bcryptjs.hashSync(password, salt);
    if (hash !== 'undefined') {
        return hash;
    } else {
        console.log('bcryptjs hash undefined, hashing user failed!');
        return res.sendStatus(500);
    }
};

// bail this function, hash always fail
/*UserSchema.methods.generateHash = function(password) {
    console.log('start of hashing..');
    bcryptjs.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) { 
            return res.sendStatus(500);
        };
        bcryptjs.hash(password, salt, null, function(err, hashed) {
            console.log('pass: ', password);
            if (err) {
                console.log('err: ', err);
                return res.sendStatus(500);
            };
            console.log('end of hashing, hashed: ', hashed);
            this.local.hash = hashed;
        });
    });
};*/

UserSchema.methods.validPassword = function(password) {
    return bcryptjs.compareSync(password, this.local.hash);
};

UserSchema.methods.generateJWT = function() {
    console.log('User.js generateJWT');
    let today = new Date();
    let expirationDate = new Date(today);
    expirationDate.setDate(today.getDate()+1); // a day expire time

    return jwt.sign({
        id: this._id,
        email: this.local.username,
        expirationDate: parseInt(expirationDate.getTime() / 1000)
    }, "nanti_ganti");
};

UserSchema.methods.toAuthJSON = function() {
    console.log('User.js toAuthJSON');
    return {
        username: this.local.username,
        email: this.local.email,
        token: this.generateJWT()
    };
};

module.exports = mongoose.model('User', UserSchema);