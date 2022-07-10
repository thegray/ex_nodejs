var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var Post = require('./models/Post');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my_test1'
});

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');

var app = express();

app.set('port', 3000);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static(path.join(__dirname, 'public')));

con.connect(function(err){
    if (err)
        throw err;

    console.log("Connect to db is okay!");
})

app.use(function(req, res, next){
    req.con = con;
    next();
});

app.use('/', indexRouter);
app.use('/posts', postsRouter);

app.use(function(req, res, next){
    next(createError(404));
});

app.listen(app.get('port'), () => console.log("App started on port ${app.get('port')}"));