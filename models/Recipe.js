var mongoose = require('mongoose');

var RecipeSchema = new mongoose.Schema({
    title: String,
    imageName: String,
    creationDate: Date,
    creationUser: String,
    lastModificationDate: Date,
    lastModificationUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    duration: Number,
    version: Number,
    difficulty: Number,
    cost: Number,
    points: Number,
    ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
    steps: [{type: mongoose.Schema.Types.ObjectId, ref: 'Step'}],
    opinions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Opinion'}],
    removed: Boolean
});

/*
PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};
*/

mongoose.model('Recipe', RecipeSchema);