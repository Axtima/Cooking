var mongoose = require('mongoose');

var StepSchema = new mongoose.Schema({
    order: Number,
    author: String,
    imageName: String,
    lastModificationDate: Date,
    description: String,
    opinions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Opinion'}],
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}
});

mongoose.model('Step', StepSchema);