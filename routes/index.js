var express = require('express');
var router = express.Router();
var dictionary_ctrl = require('../controller/dictionary');

router.get('/',dictionary_ctrl.get_word);
router.post('/save-response',dictionary_ctrl.save_response);


module.exports = router;
