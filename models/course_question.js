let mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.Promise = require('bluebird');

const courseQuestionSchema = new Schema({
    course_id: {type: String, required: true},
    level_id: {type: String, required: true},
    question_id: {type:String, required: true},
    year: {type:String, required: true}
    //timestamp: { type: Date, default: Date.now},
});

const Course_Question = mongoose.model('Course_Question', courseQuestionSchema);

module.exports =  Course_Question;
