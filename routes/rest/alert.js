var express = require('express');
var mongoose = require('mongoose');
var jwt = require('express-jwt');

var router = express.Router();

var Alert = mongoose.model('Alert');
var User = mongoose.model('User');
var Recipe = mongoose.model('Recipe');

var auth = jwt({secret: 'SECRET', userProperty: 'loggedInUser'});

/* Params */

router.param('alert', function (req, res, next, id) {
    var query = Alert.findById(id);

    query.exec(function (err, alert) {
        if (err) {
            return next(err);
        }
        if (!alert) {
            return next(new Error('can\'t find alert'));
        }

        req.alert = alert;
        return next();
    });
});

router.param('recipe', function (req, res, next, id) {
    var query = Recipe.findById(id);

    query.exec(function (err, recipe) {
        if (err) {
            return next(err);
        }
        if (!recipe) {
            return next(new Error('can\'t find recipe'));
        }

        req.recipe = recipe;
        return next();
    });
});

/* Get */

router.get('/', function (req, res, next) {
    Alert.find().populate('user').exec(function (err, alerts) {
        if (err) {
            return next(err);
        }
        res.json(alerts);
    });
});

/* Create alert on recipe */

router.post('/', auth, function (req, res, next) {
    
    // Création de l'alerte
    var alert = new Alert(req.body);
    alert.user = req.loggedInUser._id;
    alert.creationDate = new Date();
    alert.save(function (err, alertData) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        res.json(alertData);
    });
});

router.post('/status/:alert', auth, function (req, res, next) {

    // Modification du statut
    var alert = req.alert;
    alert.status = req.body.newStatus;
    alert.save(function (err, alertData) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        res.json(alertData);
    });
});

router.delete('/:alert', auth, function (req, res, next) {

    // Suppression de l'alerte
    var alert = req.alert;
    
    alert.remove(function (err) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        return res.sendStatus(204);
    });
});

module.exports = router;
