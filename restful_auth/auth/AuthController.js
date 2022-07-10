var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var VerifyToken = require('./VerifyToken');

router.post('/register', function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    },
    function (err, user) {
        if (err)
            return res.status(500).send("Error registering user");
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400
        });

        res.status(200).send({ auth: true, token: token });
    });
});

router.get('/me', VerifyToken, function (req, res, next) {
        console.log('incoming get request in me');
        User.findById(req.userId, 
            { password: 0 }, // projetion, omit the password
            function (err, user) {
                if (err) {
                    console.log('err1');
                    return res.status(500).send("Error in server.");
                }
                if (!user) {
                    console.log('user not found');
                    return res.status(404).send("Error user not found");
                }
                console.log('call middleware example..');
                //res.status(200).send(user); //change to below
                next(user);
        });
    });

router.post('/login', function(req, res) {
    User.findOne({ email:req.body.email }, function (err, user) {
        if (err)
            return res.status(500).send('Error on the server.');
        if (!user)
            return res.status(404).send('No user found.');

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid)
            return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id:user._id }, config.secret, {
            expiresIn: 86400
        });

        res.status(200).send({ auth: true, token: token });
    });
});

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null, message: "logout" });
});

// middleware function example
router.use(function (user, req, res, next) {
    console.log('middleware example called');
    res.status(200).send(user);
});

module.exports = router;