var mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.Promise = require('bluebird');

const resultSchema = new Schema({
    user_id: {type: String, required: true},
    course_id: {type: String, required: true},
    ques_id: { type: String, required: true},
    wrong_count:{type: Number, required: true, default: 0},
    is_answerd: {type: Boolean, required: true, default: false}
});

const Result = mongoose.model('Result', resultSchema);

module.exports =  Result;
