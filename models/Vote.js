var mongoose = require('mongoose');

var VoteSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    creationDate: Date,
    up: Boolean
});

mongoose.model('Vote', VoteSchema);