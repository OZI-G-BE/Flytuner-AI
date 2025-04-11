// import OpenAI from "openai";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {OpenAI} = require("openai")
require("dotenv").config({path: "../environment/.env"});
const fs = require("fs");

//GOOGLE GEMENI//
// const genAI = new GoogleGenerativeAI(apikey);
// // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// for(let i = 0; i < prompt.length; i++){fullPrompt = fullPrompt.concat(`\n${prompt[i]}`)}

// console.log(fullPrompt)

// console.log(fullPrompt)

// const result = await model.generateContent(`explain the text below in ${outputSize} words and separate it in ${paragraphs} paragraph title sections
//      and ${pages} pages if and only if necessary to do so depending on the word count
//       and also add a "\n" after every 80th character. and make sure to touch on every topic and heading
//      \n  ${fullPrompt}`);
// return result.response.text();
let globOpenai = new OpenAI
const fileIDs=[];
const imgIDs=[];

async function aiFileUpload(prompts, apikey, projkey, orgkey) {
    const openai = new OpenAI({
        project: projkey,
        organization: orgkey,
        apiKey: apikey
    });

    try {
        fullResponse = ""
        for(const prompt of prompts){
            //    console.log(prompt)
          const uploadedFile = await openai.files.create({
                file: fs.createReadStream(prompt),
                purpose: "user_data",
            })
            fileIDs.push(uploadedFile.id)
            console.log(uploadedFile);
        }
        
        
        const vectorStore = await openai.vectorStores.create({
            name: "My Docs",
            file_ids: fileIDs,
        });
        
        globOpenai = openai
        return [vectorStore, fileIDs];
    } catch (error) {
        console.log(error);

        return false;
    }

}



async function Prompter(vectorStore, outputSize) {

try{
    const assistant = await globOpenai.beta.assistants.create({
            
        name: "PDF Assistant",
            model: "gpt-4o-mini",

            instructions: `explain all of the topics contained in the documents regardless of correlation in ${outputSize} words
                            and also add a "\n" after every 80th character. and make sure to touch on every topic and heading.
                            And if you cannot find any topic in the document or sny document at all, then please only say 
                            "I cannot find any topic in the document" and do not make up any topics.`,
                            tools: [{ type: "file_search" }],
                            tool_resources: {
                                file_search: {
                                  vector_store_ids: [vectorStore[0].id]
                                }
                              }
            // stream: true,
        });

        const thread = await globOpenai.beta.threads.create();  
          // 5️⃣ Add our “user” message (i.e. the same instructions we gave above)
          await globOpenai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: assistant.instructions
          });  
      
          // 6️⃣ Start a run
          const run = await globOpenai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id
          });  
      
          // 7️⃣ Poll until it’s done
          let status = run;
          while (status.status !== "completed") {
            await new Promise(r => setTimeout(r, 1000));
            status = await globOpenai.beta.threads.runs.retrieve(thread.id, run.id);
          }  
      
          // 8️⃣ List messages and pull out the assistant’s reply
          const msgs = await globOpenai.beta.threads.messages.list(thread.id);
          const assistantMsg = msgs.data.find(m => m.role === "assistant");
        
            const answer = assistantMsg?.content?.[0]?.text ?? "";
            
        //   console.log(vectorStore[0].id);
          return answer.value;
}catch (error) {
    console.log(error);}
    }



//OPEN AI//
async function OpenAiprompter() {
    
    const openai = new OpenAI({
        organization: process.env.OPENAI_ORG_ID,
        project: process.env.OPENAI_PROJ_ID,
        apiKey: process.env.OPENAI_API_KEY
    });

const response = await openai.responses.create({
        model: "gpt-4o-mini",
        input:[{ role: 'user', content: 'explain what guity gear is' }],
        // stream: true,
    });

    console.log(response.output_text);






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
// OpenAiprompter();
module.exports = {

    aiFileUpload,
    Prompter,
}