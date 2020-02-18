var express = require('express');
var router = express.Router();
var verifyToken = require('../controller/verifyToken');
var dictionary_ctrl = require('../controller/english');
var course_ctrl = require('../controller/course');
var auth_ctrl = require('../controller/auth');
var result_ctrl = require('../controller/result');

router.post('/register',auth_ctrl.register);
router.post('/login',auth_ctrl.login);
router.post('/verifyToken',auth_ctrl.verifyToken);

router.get('/courses', verifyToken, course_ctrl.get_course);

router.post('/word', verifyToken, dictionary_ctrl.get_word);

router.post('/save-spelling-response', verifyToken, result_ctrl.save_answer);
router.post('/get-result', verifyToken, result_ctrl.get_result);

module.exports = router;
