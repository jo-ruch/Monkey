var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var keyRouter = require('./routes/keys');
let apiRouter = require('./routes/api');

var app = express();

mongoose.connect('mongodb://mongo:27017/monkey', {useNewUrlParser: true}).catch(function(err) {
    console.error("Failed to connect to MongoDB");
    console.log(err)
    process.exit(1);
});

app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/keys', keyRouter);
app.use('/api', apiRouter);

module.exports = app;
