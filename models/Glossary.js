var mongoose = require('mongoose');

var GlossarySchema = new mongoose.Schema({
    terms: [{type: String}],
    definition: String
});

mongoose.model('Glossary', GlossarySchema);