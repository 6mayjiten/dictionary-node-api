var mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.Promise = require('bluebird');

const examQuestionSchema = new Schema({
    question: {type: String, required: true},
    description: {type:String, required: true},
    //img: {data: Buffer, contentType: String}
    //timestamp: { type: Date, default: Date.now},
});

const Exam_Question = mongoose.model('Exam_Question', examQuestionSchema);

module.exports =  Exam_Question;
