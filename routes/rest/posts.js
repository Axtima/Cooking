var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var router = express.Router();

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* Params */

router.param('post', function (req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('can\'t find post'));
        }

        req.post = post;
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
    Post.find(function (err, posts) {
        if (err) {
            return next(err);
        }

        res.json(posts);
    });
});

router.post('/', auth, function (req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;

    post.save(function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

router.get('/:post', function (req, res, next) {
    req.post.populate('comments', function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

router.put('/:post/upvote', auth, function (req, res, next) {
    req.post.upvote(function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

router.post('/:post/comments', auth, function (req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;

    comment.save(function (err, comment) {
        if (err) {
            return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(comment);
        });
    });
});

router.put('/:post/comments/:comment/upvote', auth, function (req, res, next) {
    req.comment.upvote(function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

module.exports = router;
