const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    local: {
        username: {type: String, unique: true, require: [true, "cannot be empty."], lowercase: true, index: true},
        password: {type: String, unique: true, required: [true, "cannot be empty."], lowercase: true, index: true},
        salt: String,
        hash: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
}, {timestamps: true});

mongoose.model('User', UserSchema);