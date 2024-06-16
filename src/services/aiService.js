const axios = require('axios');

const getAnswer = async (question) => {
    try {
        // const response = await callAnthropicAPI(question);

        return "You are a very good question!";
        
        // return response;
        // return response.data.choices[0].text.trim();
    } catch (error) {
        throw new Error('Error generating answer from AI service:'+ error);
    }
};

module.exports = { getAnswer };


// const axios = require('axios');

// const getAnswer = async (question) => {
//     try {
//         const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
//             prompt: question,
//             max_tokens: 100
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//             }
//         });
//         return response.data.choices[0].text.trim();
//     } catch (error) {
//         throw new Error('Error generating answer from AI service');
//     }
// };

// module.exports = { getAnswer };

