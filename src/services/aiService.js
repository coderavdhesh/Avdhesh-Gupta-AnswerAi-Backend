const Anthropic = require('@anthropic-ai/sdk');
const dotenv = require('dotenv')

dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.API_KEY,
});

const getAnswer = async (question) => {
    try {
        const response = await anthropic.messages.create({
            model: 'claude-3-opus-20240229',
            max_tokens: 1024,
            messages: [
                { "role": "user", "content": `${question}` }
            ]
        });
        console.log(response);
        // return response;
        return response.content[0].text.trim();
    } catch (error) {
        throw new Error('Error generating answer from AI service:'+ error);
    }
};

module.exports = { getAnswer };