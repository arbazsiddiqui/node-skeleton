var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
    text:  {required: true, type: String},
    status: Boolean,
    email : String
});