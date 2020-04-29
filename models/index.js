let User = require('./user');
let English = require('./english');
let Result = require('./result');
let Course = require('./course');
let Ques = require('./question');
let Ques_Level_Year = require('./course_question');
let User_Course = require('./user_course');
let Ques_Option = require('./question_answer_option');
let Ques_Answer = require('./question_answer');

module.exports =  {
    User,English,Result,Course,Ques,Ques_Level_Year,User_Course,Ques_Option,Ques_Answer
}

console.log('Executing Model: index.js ...');
