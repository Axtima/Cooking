var express = require('express');
var mongoose = require('mongoose');
var jwt = require('express-jwt');

var router = express.Router();

var Comment = mongoose.model('Comment');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* Params */

router.param('comment', function (req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error('can\'t find comment'));
        }

        req.comment = comment;
        return next();
    });
});

/* Requests */

router.get('/recipe/:recipeId', function (req, res, next) {
    Comment.findOne({recipe:req.params.recipeId}).exec(function (err, comments) {
        if (err) {
            return next(err);
        }
        res.json(comments);
    });
});

router.post('/', auth, function (req, res, next) {
    
    // Création du commentaire
    var comment = new Comment(req.body);
    comment.save(function (err, commentData) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        res.json(commentData);
    });
});

router.delete('/:comment', function (req, res, next) {

    // Suppression du commentaire
    var comment = req.comment;
    
    comment.remove(function (err) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        return res.sendStatus(204);
    });
});

module.exports = router;
