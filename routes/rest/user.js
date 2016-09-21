var express = require('express');
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var passport = require('passport');

var router = express.Router();

var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* Params */

router.param('user', function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('can\'t find user'));
        }

        req.user = user;
        return next();
    });
});

/* GET users listing. */

router.get('/', function (req, res, next) {
    User.find().exec(function (err, users) {
        if (err) {
            return next(err);
        }
        res.json(users);
    });
});

router.get('/:user', function (req, res, next) {
    req.user.hash = null;
    req.user.salt = null;
    res.json(req.user);
});

router.post('/register', function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'Veuillez saisir tous les champs'});
    }

    User.findOne({email: req.body.email}, function (err, user) {
        if (user) {
            return next(res.status(400).json({message: 'Cette adresse email est déjà utilisée'}));
        }
        user = new User();

        user.email = req.body.email;
        user.active = true;
        
        user.setPassword(req.body.password);

        user.save(function (err) {
            if (err) {
                return next(err);
            }

            return res.json({token: user.generateJWT()})
        });
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

router.post('/:user', auth, function (req, res, next) {
    
    // Mise à jour de l'utilisateur
    var user = req.user;
    user.email = req.body.email;
    user.active = req.body.active;
    
    user.save(function (err, userData) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        res.json(userData);
    });
});

router.post('/password/:user', auth, function (req, res, next) {
    
    // Mise à jour du mot de passe de l'utilisateur
    var user = req.user;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    
    user.save(function (err, userData) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        res.json(userData);
    });
});

module.exports = router;
