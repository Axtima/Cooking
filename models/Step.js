var mongoose = require('mongoose');

var StepSchema = new mongoose.Schema({
    order: Number,
    imageName: String,
    description: String,
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'},
    opinions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Opinion'}]
});

mongoose.model('Step', StepSchema);