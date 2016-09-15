var mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
    order: Number,
    name: String,
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'},
    opinions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Opinion'}]
});

mongoose.model('Ingredient', IngredientSchema);