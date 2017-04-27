var mongoose = require('mongoose');

module.exports = mongoose.model('Sentence', {
    id: Number,
    text: String,
    is_positive: Boolean,
    is_negative: Boolean,
    is_love: Boolean,
    is_hatred: Boolean,
    is_neutral: Boolean,
    has_appeard: Boolean,
    has_tagged: Boolean
});