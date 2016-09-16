var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var router = express.Router();

var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Veuillez saisir tous les champs'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function (err) {
        if (err) {
            return next(err);
        }

        return res.json({token: user.generateJWT()})
    });
});

router.post('/login', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Veuillez saisir tous les champs'});
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;
