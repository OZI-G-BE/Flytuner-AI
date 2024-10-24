// import OpenAI from "openai";
const {OpenAI} = require("openai")//
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({path: "../environment/.env"});

//GOOGLE GEMENI//
async function prompter(prompt, apikey, outputSize, paragraphs, pages) {
    try {
        const genAI = new GoogleGenerativeAI(apikey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`explain the text below in ${outputSize} words and separate it in ${paragraphs} paragraph title sections
             and ${pages} pages if and only if necessary to do so depending on the word count
              and also add a "\n" after every 80th character
             \n  ${prompt}`);
        return result.response.text();
    } catch (error) {
        console.log(error);

        return false;
    }

}




//OPEN AI//
async function OpenAiPrompter() {
    
    const openai = new OpenAI({
        organization: process.env.OPENAI_ORG_ID,
        project: process.env.OPENAI_PROJ_ID,
    });
    
    
    
    const client = openai;
    
    const response = await client.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-4o-mini'
    });
console.log(response._request_id)
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
//OpenAiPrompter();
module.exports = {

    prompter,
}