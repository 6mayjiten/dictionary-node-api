var mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.Promise = require('bluebird');

const courseSchema = new Schema({
    course_name: {type: String, required: true, unique:true},
    parent_id: {type:String, required: true},
});

const Course = mongoose.model('Course', courseSchema);

module.exports =  Course;
