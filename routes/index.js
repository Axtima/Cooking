var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var router = express.Router();

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* 
 * GET home page. 
 */
router.get('/', function (req, res, next) {
    res.render('index', {title: ''});
});

/* 
 * GET admin page. 
 */
router.get('/admin', function (req, res, next) {
    res.render('admin', {title: ''});
});

module.exports = router;
