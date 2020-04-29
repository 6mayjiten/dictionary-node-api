let express = require('express');
let router = express.Router();
let common_ctrl = require('../controller/common');
let verifyToken = require('../controller/verifyToken');
let dictionary_ctrl = require('../controller/english');
let math_ctrl = require('../controller/math');
let course_ctrl = require('../controller/course');
let auth_ctrl = require('../controller/auth');
let result_ctrl = require('../controller/result');

router.post('/register',auth_ctrl.register);
router.post('/login',auth_ctrl.login);
router.post('/verifyToken',auth_ctrl.verifyToken);

router.get('/courses', verifyToken, course_ctrl.get_course);

router.post('/word', verifyToken, dictionary_ctrl.get_word);
router.post('/math', verifyToken, math_ctrl.get_ques);

router.post('/save-spelling-response', verifyToken, result_ctrl.save_answer);
router.post('/save-math-response', verifyToken, result_ctrl.save_answer);

router.post('/get-result', verifyToken, result_ctrl.get_result);

module.exports = router;
