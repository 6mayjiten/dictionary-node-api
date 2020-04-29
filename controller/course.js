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
		for (const singleCourse of finalCourses){
			for(const subCourse of singleCourse.sub_course){
				await db.Ques_Level_Year.find({course_id: subCourse.parent_id, level_id: subCourse._id}, {
					year: 1,
					_id: 0
				}).distinct('year', function (error, year) {
					subCourse.availableYear = year;
				});
				let isCompleted = await isCourseCompleted(req.user_id, subCourse._id);
				subCourse.is_completed = isCompleted;
			}
		}
		res.status(200).json(finalCourses);
    }
}

combineCourses = async (courses, childCourses) => {
	return new Promise(resolve => {
		let finalCourses = [];
		for (const parentCourse of courses) {
			let childCourseList = [];
			for (const childCourse of childCourses) {
				let courseData = {};
				if(childCourse.parent_id == parentCourse._id)
				{
					courseData._id = childCourse._id;
					courseData.course_name = childCourse.course_name;
					courseData.parent_id = childCourse.parent_id;
					childCourseList.push(courseData);
				}
			}
			let objTOReturn = {
				main_course: parentCourse.course_name,
				sub_course: childCourseList,
			}
			finalCourses.push(objTOReturn)
		}
		resolve(finalCourses);
	})
}
