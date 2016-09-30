var mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
    order: Number,
    name: String,
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}
});

mongoose.model('Ingredient', IngredientSchema);