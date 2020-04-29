let mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.Promise = require('bluebird');

const QuestionSchema = new Schema({
    question: {type: String, required: true},
    description: {type:String, required: true},
    //img: {data: Buffer, contentType: String}
    //timestamp: { type: Date, default: Date.now},
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports =  Question;
