const express = require('express');
const { questionAskedByUser, getListOfQuestionsByUserID } = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, questionAskedByUser);
router.get('/:questionId', authMiddleware, getListOfQuestionsByUserID);

module.exports = router;
