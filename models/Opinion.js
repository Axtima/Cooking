var mongoose = require('mongoose');

var OpinionSchema = new mongoose.Schema({
    author: String,
    lastModificationDate: Date,
    text: String,
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'},
    step: {type: mongoose.Schema.Types.ObjectId, ref: 'Step'}
});

mongoose.model('Opinion', OpinionSchema);