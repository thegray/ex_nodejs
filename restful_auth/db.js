var mongoose = require('mongoose');

// https://stackoverflow.com/questions/35813584/invalid-schema-expected-mongodb
mongoose.connect('mongodb://localhost:27017/restful_auth');

// https://stackoverflow.com/questions/20360531/mongoose-connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('connected to db!');
});

exports.test = function(req, res) {
    res.render('test');
};