var mongoose = require('mongoose');

var GlossarySchema = new mongoose.Schema({
    title: {type: String},
    terms: [{type: String}],
    definition: String
});

mongoose.model('Glossary', GlossarySchema);