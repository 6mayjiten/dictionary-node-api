let mongoose = require('mongoose');
const { Schema } = mongoose;

// mongoose.Promise = global.Promise; Inserted the bluebird module here to fix warnings described in app.js
mongoose.Promise = require('bluebird');

const quesAnswerSchema = new Schema({
	question_id: {type:String, required: true},
	answer_option_id: {type:String, required: true}
});

const Question_Answer = mongoose.model('Question_Answer', quesAnswerSchema);

module.exports =  Question_Answer;