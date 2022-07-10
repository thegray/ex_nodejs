const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');

const app = express();

app.use(session({
    genid: (req) => {
        console.log('inside session middleware');
        console.log(req.sessionID);
        return uuid();
    },
    secret: 'abcd',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    console.log('inside homepage callback');
    console.log(req.sessionID);
    res.send(`home page.`);
});

app.listen(3000, () => {
    console.log('Server run on port 3000');
});