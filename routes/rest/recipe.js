var express = require('express');
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var multer = require('multer');

var router = express.Router();

var Recipe = mongoose.model('Recipe');
var Ingredient = mongoose.model('Ingredient');
var Step = mongoose.model('Step');
var Trick = mongoose.model('Trick');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'loggedInUser'});

var storage = multer.diskStorage({//multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({//multer settings
    storage: storage
}).single('file');

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

router.param('trick', function (req, res, next, id) {
    var query = Trick.findById(id);

    query.exec(function (err, trick) {
        if (err) {
            return next(err);
        }
        if (!trick) {
            return next(new Error('can\'t find trick'));
        }

        req.trick = trick;
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
    Recipe.find()
            .populate('ingredients')
            .populate('steps')
            .populate({path: 'comments', populate: { path: 'user'}})
            .populate({path: 'tricks', populate: { path: 'user'}})
            .exec(function (err, recipes) {
                if (err) {
                    return next(err);
                }
                res.json(recipes);
            });
});

router.get('/search', function (req, res, next) {

    var searchText = req.query.searchText;
    // Remove quotes
    searchText = searchText.replace(/['"]+/g, '');
    Recipe.find({title: {$regex: searchText, $options: 'i'}})
            .populate('ingredients')
            .populate('steps')
            .populate({path: 'comments', populate: { path: 'user'}})
            .populate({path: 'tricks', populate: { path: 'user'}})
            .exec(function (err, recipes) {
                if (err) {
                    return next(err);
                }
                res.json(recipes);
            });
});

/**
 * Création d'une recette
 */
router.post('/', auth, function (req, res, next) {
    createOrUpdateRecipe(req, res, next);
});

/**
 * Modification d'une recette
 */
router.post('/:recipe', auth, function (req, res, next) {
    createOrUpdateRecipe(req, res, next);
});

createOrUpdateRecipe = function (req, res, next) {
    // Récupération des valeurs à partir de la requête
    var steps = req.body.steps;
    var ingredients = req.body.ingredients;

    // Création des ingrédients
    Ingredient.create(ingredients, function (err, ingredientsData) {
        if (err) {
            return next(err);
        }
        // Création des étapes
        Step.create(steps, function (err, stepsData) {
            // Gestion des erreurs
            if (err) {
                return next(err);
            }

            // Transformation des objets associés en liste d'ids
            var stepIds = [];
            if (stepsData && stepsData.constructor === Array) {
                stepIds = stepsData.map(function (stepData) {
                    return stepData._id;
                });
            }
            var ingredientIds = [];
            if (ingredientsData && ingredientsData.constructor === Array) {
                ingredientIds = ingredientsData.map(function (ingredientData) {
                    return ingredientData._id;
                });
            }

            // Création de la recette
            var recipe = req.recipe;
            if (recipe) {
                recipe.title = req.body.title;
                recipe.active = req.body.active;
                recipe.version = req.body.version;
                recipe.cost = req.body.cost;
                recipe.duration = req.body.duration;
                recipe.difficulty = req.body.difficulty;
                recipe.lastModificationUser = req.loggedInUser._id;
                recipe.lastModificationDate = new Date();
            } else {
                recipe = new Recipe(req.body);
                recipe.creationUser = req.loggedInUser._id;
                recipe.creationDate = new Date();
            }

            recipe.steps = stepIds;
            recipe.ingredients = ingredientIds;

            recipe.save(function (err, recipe) {
                // Gestion des erreurs
                if (err) {
                    return next(err);
                }

                Recipe.findOne(recipe).populate('steps').populate('ingredients').exec(function (err, recipe) {
                    // Gestion des erreurs
                    if (err) {
                        return next(err);
                    }

                    // Association de la recette sur les étapes créées
                    Step.update({_id: {"$in": stepIds}}, {recipe: recipe._id}, {multi: true}, function (err, stepsData) {
                        // Gestion des erreurs
                        if (err) {
                            return next(err);
                        }
                        Ingredient.update({_id: {"$in": ingredientIds}}, {recipe: recipe._id}, {multi: true}, function (err, ingredientsData) {
                            // Gestion des erreurs
                            if (err) {
                                return next(err);
                            }
                            res.json(recipe);
                        });
                    });
                });
            });
        });
    });
};

router.get('/:recipe', function (req, res, next) {
    req.recipe.populate([
        'ingredients',
        'steps',
        {path: 'comments', populate: { path: 'user'}},
        {path: 'tricks', populate: { path: 'user'}}
    ], function(err, recipe) {
        if (err) {
            return next(err);
        }

        res.json(recipe);
    });
});

router.post('/upload/:recipe/step/:stepOrder', auth, function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        // Récupération de l'étape
        Step.findOne({
            'recipe': req.recipe._id,
            'order': req.params.stepOrder
        }, function (err, step) {
            if (err) {
                return handleError(err);
            }
            step.imageName = req.file.filename;
            step.save(function (err, step) {
                if (err) {
                    return next(err);
                }
                res.json({error_code: 0, err_desc: null});
            });
        });
    });
});

router.post('/upload/:recipe', auth, function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        req.recipe.imageName = req.file.filename;
        req.recipe.save(function (err, recipe) {
            if (err) {
                return next(err);
            }
            res.json({error_code: 0, err_desc: null});
        });
    });
});

router.post('/trick/downvote/:trick', auth, function (req, res) {
    
    // Récupération des valeurs à partir de la requête
    var trick = req.trick;
    trick.score = trick.score - 1;

    // Création de l'astuce
    trick.save(function (err, trickData) {
        if (err) {
            return next(err);
        }
        res.json(trickData);
    });
});

router.post('/trick/upvote/:trick', auth, function (req, res) {
    
    // Récupération des valeurs à partir de la requête
    var trick = req.trick;
    trick.score = trick.score + 1;

    // Création de l'astuce
    trick.save(function (err, trickData) {
        if (err) {
            return next(err);
        }
        res.json(trickData);
    });
});

router.post('/trick/:recipe', auth, function (req, res) {
    
    // Récupération des valeurs à partir de la requête
    var recipe = req.recipe;

    var trick = new Trick(req.body);
    trick.recipe = recipe._id;
    trick.user = req.loggedInUser._id;
    trick.creationDate = new Date();
    trick.score = 0;
    
    // Création de l'astuce
    trick.save(function (err, trickData) {
        if (err) {
            return next(err);
        }
        recipe.tricks.push(trickData._id);
        recipe.save(function (err, recipe) {
            // Gestion des erreurs
            if (err) {
                return next(err);
            }
            res.json(recipe);
        });
    });
});

module.exports = router;
