const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Question = require('../models/question');
const mongoose = require('mongoose')

const getUserProfileByUserID = async (req, res) => {
    const { userId } = req.params;
    console.log(`Getting the User Profile, by asking it's UserID- "${userId}" : getUserProfileByUserID()`); 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("The profile of user found sucessfully!"); 
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getListOfQuestionsByUserID = async (req, res) => {

    const {userId } = req.params;
    console.log(`Getting the list of question asked by the UserID- "${userId}" : getListOfQuestionsByUserID()`); 

    try {
        const questions = await Question.find({ userId });
        res.status(200).json(questions);
        console.log("The list of the questions found sucessfully!"); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Retrieve all users
const getAllUsers = async (req, res) => {
    console.log("Getting the info of all the Users : getAllUsers()"); 
    try {
        const users = await User.find().select('-password');
        console.log("The list of all users generated, sucessfully!"); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    console.log("Creating new User in our Database : createUser()"); 

    const {username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });

        await user.save();
        console.log("Hey, one new member added in your family :)"); 
        res.status(201).json({ message: `${username} registered successfully` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { getUserProfileByUserID, getListOfQuestionsByUserID, getAllUsers, createUser };
