const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config({path: "../environment/.env"});//test


async function prompter(prompt, apikey) {
    try {
        const genAI = new GoogleGenerativeAI(apikey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("explain the text below in 500 words\n" + prompt);
        return result.response.text();
    } catch (error) {
        console.log(error);

        return false;
    }

}
///TEST AREA////

async function testPrompt(){

    try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("what is guilty gear");
        console.log(result.response.text());
    } catch (error) {
        console.log(error);
    
        return false;
    }

}    
// testPrompt();
module.exports = {

    prompter,
}