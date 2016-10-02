var express = require('express');
var mongoose = require('mongoose');
var jwt = require('express-jwt');

var router = express.Router();

var Comment = mongoose.model('Comment');
var Recipe = mongoose.model('Recipe');

var auth = jwt({secret: 'SECRET', userProperty: 'loggedInUser'});

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

/* Create comment on recipe */

router.post('/recipe/:recipe', auth, function (req, res, next) {
    
    // Création du commentaire
    var comment = new Comment(req.body);
    comment.recipe = req.recipe;
    comment.user = req.loggedInUser._id;
    comment.creationDate = new Date();
    comment.save(function (err, commentData) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        req.recipe.comments.push(commentData._id);
        req.recipe.save(function (err, recipe) {
            // Gestion des erreurs
            if (err) {
                return next(err);
            }
            res.json(commentData);
        });
    });
});

router.delete('/:comment', auth, function (req, res, next) {

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
