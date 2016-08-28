var express = require('express');
var mongoose = require('mongoose');
var jwt = require('express-jwt');

var router = express.Router();

var Glossary = mongoose.model('Glossary');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* Params */

router.param('glossary', function (req, res, next, id) {
    var query = Glossary.findById(id);

    query.exec(function (err, glossary) {
        if (err) {
            return next(err);
        }
        if (!glossary) {
            return next(new Error('can\'t find glossary'));
        }

        req.glossary = glossary;
        return next();
    });
});

/* Requests */

router.get('/', function (req, res, next) {
    Glossary.find().exec(function (err, glossaries) {
        if (err) {
            return next(err);
        }
        res.json(glossaries);
    });
});

router.post('/', auth, function (req, res, next) {
    
    // Création de l'entrée de glossaire
    var glossary = new Glossary(req.body);
    glossary.save(function (err, glossaryData) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        res.json(glossaryData);
    });
});


router.get('/:glossary', function (req, res, next) {
    res.json(req.glossary);
});

module.exports = router;
