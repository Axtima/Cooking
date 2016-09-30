var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'},
    content: String,
    creationDate: Date,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    score: Number,
    alert: Boolean
});

mongoose.model('Comment', CommentSchema);