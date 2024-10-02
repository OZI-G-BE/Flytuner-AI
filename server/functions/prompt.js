const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config({path: "../environment/.env"});


async function prompter(prompt, apikey) {
    try {
        const genAI = new GoogleGenerativeAI(apikey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("explain the text below in 50 words or less\n" + prompt);
        return result.response.text();
    } catch (error) {
        console.log(error);

        return false;
    }

}


module.exports = {

    prompter,
}