var db = require('../models');
var Promise = require('promise');

module.exports = {
	get_course: async (req, res) => {
		let parentCourseList = await db.Course.find({parent_id:""}, function(error, courses) {
	        if (error) {
				res.status(500).json({error: true, message: "Something Went Wrong."});
				return;
			}
	        return courses;
		})
		let childCourseList = await db.Course.find({parent_id:{ $ne: ""}}, function(error, childCourses) {
			if (error) {
				res.status(500).json({error: true, message: "Something Went Wrong."});
				return;
			}
			return childCourses;
		})
		let finalCourses = await combineCourses(parentCourseList,childCourseList);
		console.log(finalCourses);
		res.status(200).json(finalCourses);
    }
}

combineCourses = async (courses, childCourses) => {
	return new Promise(resolve => {
		let finalCourses = [];
		courses.forEach((parentCourse, index) => {
			let childCourseList = [];
			childCourses.forEach(childCourse => {
				if(childCourse.parent_id == parentCourse._id)
				{
					childCourseList.push(childCourse)
				}
			})
			let objTOReturn = {
				main_course: parentCourse.course_name,
				sub_course: childCourseList
			}
			finalCourses.push(objTOReturn)
		})
		resolve(finalCourses);
	})
}

