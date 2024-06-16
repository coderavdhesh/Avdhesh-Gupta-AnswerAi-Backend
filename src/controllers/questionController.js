const Question = require('../models/question');
const aiService = require('../services/aiService');

const questionAskedByUser = async (req, res) => {
    console.log("Getting the answer of the question asked by Users : questionAskedByUser()"); 

    const { userId, question } = req.body;
    try {
        const answer = await aiService.getAnswer(question);
        const newQuestion = new Question({ userId, question, answer });
        await newQuestion.save();
        console.log("The answer Generated!");
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getListOfQuestionsByUserID = async (req, res) => {
    console.log("Getting list of questions asked the UsersID : getListOfQuestionsByUserID()"); 

    const { questionId } = req.params;
    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        console.log("The list of question generated!"); 
        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {questionAskedByUser, getListOfQuestionsByUserID};
