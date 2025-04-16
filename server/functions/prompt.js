// import OpenAI from "openai";
// const {OpenAI} = require("openai")


//-------------------------------------------CURRENT GOOGLE GEMINI CODE--------------------------------------------------------//
import { createPartFromUri, GoogleGenAI } from "@google/genai";
// import fs from "fs"
import * as fs from 'fs/promises';
import dotenv from 'dotenv';

import mime from "mime";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY});

dotenv.config({
    path: '../environment/.env'
});

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY});


async function geminiAPI() {
const outputSize = 200
const fullPrompt = "guilty gear"
    const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `explain the text below in ${outputSize} words
          and also add a "\n" after every 80th character. and make sure to touch on every topic and heading
         \n  ${fullPrompt}`});

         console.log(result.text)
    return result
}

// geminiAPI()






export async function summarizeGemini(wordCount, files){
    const aiT = new GoogleGenAI({ apiKey: process.env.API_KEY});
    
    const parts = await Promise.all(files.map(async (file) => {
        console.log(".\\" + file.path)
        const buffer = await fs.readFile(".\\" + file.path);
        return {
            inlineData: {
                mimeType: file.mimeType,
                data: buffer.toString('base64'),
            }
        };
    }));
    const content = [
         `explain all of the topics contained in the documents regardless of correlation in ${wordCount} words
                 and also add a "\n" after every 80th character. and make sure to touch on every topic and heading.
                 And if you cannot find any topic in the document or any document at all, then please only say 
                 "LOADING PLEASE WAIT..." and do not make up any topics.`,
                 ...parts
     ]

    const result = await aiT.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content});
    
        return result.text
}


// geminiAPI();
//-------------------------------------------CURRENT GOOGLE GEMINI CODE--------------------------------------------------------//

let fileIDs=[];
let imgIDs=[];




//-------------------------------------------UNUSED OPEN AI CODE--------------------------------------------------------//
// let globOpenai = new OpenAI
// let assistant
// let VS
// async function aiFileUpload(prompts, apikey, projkey, orgkey) {
    //     const openai = new OpenAI({
        //         project: projkey,
        //         organization: orgkey,
        //         apiKey: apikey
        //     });
        
        //     try {
            //         fullResponse = ""
            //         fileIDs = []
            //         imgIDs = []
            //         for(const prompt of prompts){
                //             //    console.log(prompt)
                //           const uploadedFile = await openai.files.create({
                    //                 file: fs.createReadStream(prompt),
                    //                 purpose: "user_data",
                    //             })
                    //             fileIDs.push(uploadedFile.id)
                    //         }
                    //         console.log(fileIDs);
                    
                    //         if(VS == undefined){
                        //         VS = await openai.vectorStores.create({
                            //             name: "My Docs",
                            //             file_ids: fileIDs,
                            //             // deleteIn: "1d" // Expires after 1 day
                            //         });}
                            
                            
                            //         globOpenai = openai
                            //         return [VS, fileIDs];
                            //     } catch (error) {
                                //         console.log(error);
                                //         return false;
                                //     }
                                
                                // }
                                
                                // async function removeFilesAndVS(vectorStore,tempFileIDS){
                                    
                                
    // // ── Option B: Parallel deletion ──
    // await globOpenai.vectorStores.del(vectorStore);
    // console.log(`VS assistant ${vectorStore} deleted`);
    
    
    // await Promise.all(
        //   tempFileIDS.map(id =>
            //     globOpenai.files
            //     .del(id)
            //     .then(() => console.log(`File ${id}`))
            // )
            // );
            // console.log("All specified files have been deleted.");
            // console.log("All specified VS have been deleted.");
            // return("files cleared")
            // }
            // async function Prompter(outputSize) {
                
            //     try{
            //         if(assistant == undefined){
                //             assistant = await globOpenai.beta.assistants.create({
                    
                //                 name: "PDF Assistant",
                //                 model: "gpt-3.5-turbo",
                
                //                 instructions: `explain all of the topics contained in the documents regardless of correlation in ${outputSize} words
                //                 and also add a "\n" after every 80th character. and make sure to touch on every topic and heading.
                //                 And if you cannot find any topic in the document or any document at all, then please only say 
                //                 "LOADING PLEASE WAIT..." and do not make up any topics.`,
                //                 tools: [{ type: "file_search" }],
                //                 tool_resources: {
                    //                     file_search: {
                        //                         vector_store_ids: [VS.id]
                        //                     }
                        //                 }
                        //                 // stream: true,
                        //             });
                        //         }
                        //         const thread = await globOpenai.beta.threads.create();  
                        //         // 5️⃣ Add our “user” message (i.e. the same instructions we gave above)
                        //         await globOpenai.beta.threads.messages.create(thread.id, {
                            //             role: "user",
                            //             content: assistant.instructions
                            //         });  
                            
                            //         // 6️⃣ Start a run
                            //         const run = await globOpenai.beta.threads.runs.create(thread.id, {
                                //             assistant_id: assistant.id
                                //         });  
                                
                                //         // 7️⃣ Poll until it’s done
                                //         let status = run;
                                //         while (status.status !== "completed") {
            //             await new Promise(r => setTimeout(r, 1000));
            //             status = await globOpenai.beta.threads.runs.retrieve(thread.id, run.id);
            //         }  
            
            //             // 8️⃣ List messages and pull out the assistant’s reply
            //             const msgs = await globOpenai.beta.threads.messages.list(thread.id);
            //             const assistantMsg = msgs.data.find(m => m.role === "assistant");
            
            //             const answer = assistantMsg?.content?.[0]?.text ?? "";
            //             await globOpenai.beta.threads.del(thread.id);
            //             console.log(`Deleted thread ${thread.id}`);
            
            //             return answer.value;
            //         }catch (error) {
                //             console.log("HEEEERRRRREEE FUCKFACE\n"+ error);}
                //         }
                // //OPEN AI//
                // async function OpenAiprompter() {
                    
                //     const openai = new OpenAI({
                    //         organization: process.env.OPENAI_ORG_ID,
                    //         project: process.env.OPENAI_PROJ_ID,
                //         apiKey: process.env.OPENAI_API_KEY
                //     });
                
                //     const response = await openai.responses.create({
                    //         model: "gpt-4o-mini",
                //         input:[{ role: 'user', content: 'explain what guity gear is' }],
                // // stream: true,
                // });
                
                // console.log(response.output_text);
                // }    
                
                // ///TEST AREA////
                
                // async function testPrompt(){
                
                // try {
                    // const genAI = new GoogleGenerativeAI(process.env.API_KEY);
                    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    // const result = await model.generateContent("what is guilty gear");
                    // console.log(result.response.text());
                    // } catch (error) {
                        // console.log(error);
                        
                        // return false;
                        // }
                        
                        // }    
                        // export async function updateVS(vectorStore,tempFileIDS){
                        //     console.log(VS.id)
                        //             await globOpenai.vectorStores.del(vectorStore.id);
                        //             console.log(tempFileIDS)
                        //             console.log(vectorStore.id)
                        //             VS = await globOpenai.vectorStores.create({
                        //                 name: "My Docs",
                        //                 file_ids: tempFileIDS,
                        //                 // deleteIn: "1d" // Expires after 1 day
                        //             });
                        //             return VS
                        //         }
                                
                        //  
                        //-------------------------------------------UNUSED OPEN AI CODE--------------------------------------------------------//