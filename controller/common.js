let db = require('../models');
let Promise = require('promise');

isAlreadyAnswered = (questionId, userId, levelId) => {
	return new Promise(resolve => {
		db.Result.find({ user_id: userId, ques_id: questionId, course_id: levelId, is_answerd: true}).limit(1).exec((err, result) => {
			if (err) {
				return res.status(500).json({ error:true, message: "Something went wrong." });
			}
			if(result.length>0){
				resolve(true);
			}else{
				resolve(false);
			}
		});
	})
}

isCourseCompleted =  (user_id, level_id) => {
	return new Promise(resolve => {
		db.User_Course.find({ user_id: user_id, level_id: level_id}).limit(1).exec((err, result) => {
			if (err) {
				return res.status(500).json({ error:true, message: "Something went wrong." });
			}
			if(result !="") {
				console.log(" found course "+result);
				resolve(result.is_completed);
			}else{
				resolve(false);
			}
		});
	})
}

countQuestionAnswered =  (user_id, level_id) => {
	return new Promise(resolve => {
		db.Result.countDocuments({user_id: user_id, course_id: level_id,is_answerd: true},(err, count) => {
			if (err) {
				return res.status(500).json({ error:true, message: "Something went wrong." });
			}
			resolve(count);
		});
	})
}

makeCourseCompleted = (user_id, level_id, course_id) => {
	return new Promise(resolve => {
		db.User_Course.findOneAndUpdate({ user_id: user_id, course_id:course_id, level_id: level_id}, {is_completed: true},{upsert: true, new: true},
			(err, result) => {
			resolve(result.is_completed);
		});
	})
}