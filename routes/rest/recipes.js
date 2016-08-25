var express = require('express');
var mongoose = require('mongoose');
var jwt = require('express-jwt');

var router = express.Router();

var Recipe = mongoose.model('Recipe');
var Step = mongoose.model('Step');
var Opinion = mongoose.model('Opinion');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* Params */

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

router.get('/', function (req, res, next) {
    Recipe.find().exec(function (err, recipes) {
        if (err) {
            return next(err);
        }
        res.json(recipes);
    });
});

router.get('/full', function (req, res, next) {
    Recipe.find().populate('steps').exec(function (err, recipes) {
        if (err) {
            return next(err);
        }
        res.json(recipes);
    });
});

router.post('/', auth, function (req, res, next) {
    
    // Création des étapes
    var steps = req.body.steps;
    Step.create(steps, function(err, stepsData) {
        // Gestion des erreurs
        if (err) {
            return next(err);
        }
        var stepIds = stepsData.map(function(stepData) {
            return stepData._id;
        });
        // Création de la recette
        var recipe = new Recipe(req.body);
        recipe.steps = stepIds;
        recipe.author = req.payload.username;
        recipe.save(function (err, recipeData) {
            // Gestion des erreurs
            if (err) {
                return next(err);
            }
            res.json(recipeData);
        });
    }); 
});


router.get('/:recipe', function (req, res, next) {
    req.recipe.populate('comments', function (err, recipe) {
        if (err) {
            return next(err);
        }

        res.json(recipe);
    });
});

router.put('/:recipe/upvote', auth, function (req, res, next) {
    req.recipe.upvote(function (err, recipe) {
        if (err) {
            return next(err);
        }

        res.json(recipe);
    });
});

router.post('/:recipe/comments', auth, function (req, res, next) {
    var comment = new Comment(req.body);
    comment.recipe = req.recipe;
    comment.author = req.payload.username;

    comment.save(function (err, comment) {
        if (err) {
            return next(err);
        }

        req.recipe.comments.push(comment);
        req.recipe.save(function (err, recipe) {
            if (err) {
                return next(err);
            }

            res.json(comment);
        });
    });
});

router.put('/:recipe/comments/:comment/upvote', auth, function (req, res, next) {
    req.comment.upvote(function (err, recipe) {
        if (err) {
            return next(err);
        }

        res.json(recipe);
    });
});

module.exports = router;
