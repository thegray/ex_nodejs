var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

var User = require('./User');

// create (create new user)
router.post('/', function(req, res) {
    console.log("incoming post request.");
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    },
    function(err, user) {
        if (err)
        {
            console.log("error create a user!!");
            return res.status(500).send("Error adding the information to database.")
        }
        res.status(200).send(user);
    });
});

// read (return users in db)
router.get('/', function(req, res) {
    console.log("incoming get request.");
    User.find({}, function (err, users) {
        if (err)
            return res.status(500).send("Error getting informations");
        res.status(200).send(users);
    });
});

// get a single user
router.get('/:id', function(req, res) {
    console.log("incoming get by id request..");
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log("error in db..");
            return res.status(500).send("Error getting the user.");
        }
        if (!user) {
            console.log("No user by id: " + req.params.id);
            return res.status(404).send("No user found.");
        }
        res.status(200).send(user);
    });
});

// delete a user
router.delete('/:id', function (req, res) {
    console.log("incoming delete by id request..");
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) {
            console.log("Error delete in db..");
            return res.status(500).send("Error delete in server.");
        }
        res.status(200).send("User " + user.name +" was deleted.");
    });
});

// update a single user
router.put('/:id', function (req, res) {
    console.log("incoming update by id request..");
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, 
        function (err, user) {
            if (err) {
                console.log("Error update in db");
                return res.status(500).send("Error update in server");
            }
            res.status(200).send(user);
        });
});

module.exports = router;