var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var nodemailer = require('nodemailer');
var async = require('async');
var nconf = require('nconf');

// Chargement de la configuration
nconf.add('common', {type: 'file', file: 'config.json'});
nconf.add('local', {type: 'file', file: 'config-local.json'});
nconf.load();
  
require('./models/User');
require('./models/Recipe');
require('./models/Step');
require('./models/Ingredient');
require('./models/Comment');
require('./models/Trick');
require('./models/Vote');
require('./models/Glossary');

require('./config/passport');

mongoose.connect('mongodb://localhost/cooking');
mongoose.set('debug', true);

var routes = require('./routes/index');
var userRoutes = require('./routes/rest/user');
var recipeRoutes = require('./routes/rest/recipe');
var glossaryRoutes = require('./routes/rest/glossary');
var commentRoutes = require('./routes/rest/comment');

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

         
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/rest/recipe', recipeRoutes);
app.use('/rest/user', userRoutes);
app.use('/rest/glossary', glossaryRoutes);
app.use('/rest/comment', commentRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000);

module.exports = app;
