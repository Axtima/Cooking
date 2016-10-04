var mongoose = require('mongoose');


var AlertSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'},
    type: {
        type: String,
        enum : ['BEHAVIOR'],
        default : 'BEHAVIOR'
    },
    status: {
        type: String,
        enum : ['NEW', 'IGNORED', 'MISUSE', 'PROCESSED'],
        default : 'NEW'
    },
    creationDate: Date,
    comment: String
});

mongoose.model('Alert', AlertSchema);