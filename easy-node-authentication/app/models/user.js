var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema
var userSchema = mongoose.Schema({
    local : {
        email : String,
        password : String
    },
    google : {
        id : String,
        token : String,
        email : String,
        name : String
    }
});

// methods
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// expose this to app
module.exports = mongoose.model('User', userSchema);