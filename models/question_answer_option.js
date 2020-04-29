let mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.Promise = require('bluebird');

const quesAnsOptionSchema = new Schema({
	question_id: {type:String, required: true},
	option_data: {type:String, required: true}
});

const Question_Answer_Option = mongoose.model('Question_Answer_Option', quesAnsOptionSchema);

module.exports =  Question_Answer_Option;