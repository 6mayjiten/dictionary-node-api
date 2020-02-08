var db = require('../models');
var Promise = require('promise');

module.exports = {
  get_course: (req, res, next) => {
    db.Course.find({}, function(error, courses) {
      if (error) {
				res.status(500).json({error: true, message: "Something Went Wrong."});
				return;
			}
      res.status(200).json(courses);
    })
  }
}
