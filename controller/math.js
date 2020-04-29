let db = require('../models');
let Promise = require('promise');

module.exports = {
	get_ques: async (req, res) => {
		if (!req.body.course_id || !req.body.level_id) {
			return res.status(400).json({error: true, message: "Missing one of the required parameter (course_id, level_id)."});
		}

		let course_id= req.body.course_id, level_id= req.body.level_id, year= req.body.year;
		let filter = year?{course_id:course_id,level_id:level_id, year:year}:{course_id:course_id,level_id:level_id};
		let count = await totalMathCount(filter);
		console.log(count);

		if(await countQuestionAnswered(req.user_id, level_id) !== count) {
			let quesJson = [];
			let isAsked = false;
			do {
				console.log("in loop");
				quesJson = await getRandomQues(count, filter);
				isAsked = await isAlreadyAnswered(quesJson._id, req.user_id, req.body.level_id);
			} while (isAsked);
			await db.Result.find({
				user_id: req.user_id,
				ques_id: quesJson._id,
				course_id: req.body.level_id
			}).then((resultRes) => {
				if (resultRes.length < 1) {
					const resultObj = new db.Result({
						ques_id: quesJson._id,
						user_id: req.user_id,
						course_id: req.body.level_id,
					});
					resultObj.save().then((resultRes1) => {
						mathResponse(quesJson.question_id, resultRes1._id, res);
					}).catch((err) => {
						return res.status(500).json({
							message: "Something went wrong",
							error: true
						});
					});
				} else if (resultRes.length > 0) {
					mathResponse(quesJson.question_id, resultRes[0]._id, res);
				} else {
					return res.status(500).json({error: true, message: "Something went wrong."});
				}
			}).catch(err => {
				return res.status(500).json({
					message: "Something went wrong",
					error: true
				});
			})
		}else{
			await makeCourseCompleted(req.user_id, level_id, course_id);
			return res.status(200).json({
				message: "Course Completed.",
				completed: true
			})
		}
	}
}

totalMathCount = async (filter) => {
	return new Promise(resolve => {
		db.Ques_Level_Year.countDocuments(filter,(err, count) => {
			if (err) {
				return res.status(500).json({ error:true, message: "Something went wrong." });
			}
			resolve(count);
		});
	})
}

getRandomQues = async (count, filter) => {
	var random = Math.floor(Math.random() * count);
	return new Promise(resolve => {
		db.Ques_Level_Year.findOne(filter).skip(random).exec((err, mathData) => {
			if (err) {
				return res.status(500).json({ error:true, message: "Something went wrong." });
			}
			resolve(mathData);
		})
	})
}

mathResponse = async (question_id, result_id, res) => {
	let options = await getAllOption(question_id, res);
	let answer_option_id = await getAnswerOption(question_id, res);
	db.Ques.find({_id: question_id}).then((quesRes) => {
		return res.status(200).json({ques: quesRes[0], options: options, answer: answer_option_id, result_id: result_id});
	}).catch((err) => {
		return res.status(500).json({
			message: "Something went wrong",
			error: true
		});
	});
}

getAllOption = async (question_id, res) => {
	return new Promise(resolve => {
		db.Ques_Option.find({question_id:question_id}).then((options) => {
			resolve(options);
		}).catch((err) => {
			return res.status(500).json({
				message: "Something went wrong",
				error: true
			});
		});
	})
}

getAnswerOption = async (question_id, res) => {
	return new Promise(resolve => {
		db.Ques_Answer.find({question_id:question_id}).then((answer) => {

			if(answer.length>0){
				resolve(answer[0].answer_option_id);
			}else {
				resolve("");
			}
		}).catch((err) => {
			return res.status(500).json({
				message: "Something went wrong",
				error: true
			});
		});
	})
}