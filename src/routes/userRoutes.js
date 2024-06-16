const express = require('express');
const { getUserProfileByUserID, getListOfQuestionsByUserID, getAllUsers, createUser, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


// retrive all users
router.get('/', authMiddleware, getAllUsers)

// Route to retrieve a single user profile by userId
router.get('/:userId', authMiddleware, getUserProfileByUserID);

// Route to retrieve questions related to a user by userId
router.get('/:userId/questions', authMiddleware, getListOfQuestionsByUserID);

// create new user
router.post('/newUser', createUser);

module.exports = router;
