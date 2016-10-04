var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: String,
    creationDate: Date,
    score: Number,
    alert: Boolean
});

mongoose.model('Comment', CommentSchema);