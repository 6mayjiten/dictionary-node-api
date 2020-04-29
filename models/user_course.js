var mongoose = require('mongoose');
const { Schema } = mongoose;

// mongoose.Promise = global.Promise; Inserted the bluebird module here to fix warnings described in app.js
mongoose.Promise = require('bluebird');

const userCourseSchema = new Schema({
	user_id: { type: String, required: true },
	course_id: { type: String, required: true },
	level_id: { type: String, required: true },
	is_completed: {type: Boolean, required: true, default: false}
})

const User_Course = mongoose.model('User_Course', userCourseSchema);

module.exports =  User_Course;