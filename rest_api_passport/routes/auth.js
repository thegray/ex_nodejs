const jwt = require('express-jwt');
const secret = require('../config/config').secret;

// function to check whether Token provided in sent request's header
// return it if exists, and null if none
function getTokenFromHeaders(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

// auth object, to be called in routes
var auth = {
    required: jwt({
        secret: secret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders
    }),
    optional: jwt({
        secret: secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeaders
    })
};

module.exports = auth;