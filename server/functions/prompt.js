//-------------------------------------------CURRENT GOOGLE GEMINI CODE--------------------------------------------------------//
import { createPartFromUri, GoogleGenAI, Type  } from "@google/genai";
import * as fs from 'fs/promises';
import dotenv from 'dotenv';
import { File } from 'buffer';
import path from 'path'

dotenv.config({path: '../environment/.env'});



async function waitForFile(name) {
    const aiT = new GoogleGenAI({ apiKey: process.env.API_KEY});
    let status = await aiT.files.get({ name });
    while (status.state === 'PROCESSING') {
      await new Promise((r) => setTimeout(r, 2000));
      status = await aiT.files.get({ name });
    }
    if (status.state === 'FAILED') throw new Error(`${name} failed`);
    return status;
  }


export async function summarizeGemini(wordCount, normalFiles) {
    const aiT = new GoogleGenAI({ apiKey: process.env.API_KEY});



    const parts = await Promise.all(normalFiles.map(async (file) => {
        console.log(".\\" + file.path)
        const buffer = await fs.readFile(".\\" + file.path);
        return {
            inlineData: {
                mimeType: file.mimeType,
                data: buffer.toString('base64'),
            }
        };
    }));


//////////////////////////////////////////////////////////////////////////

    
////////////////////////////////////////////////////////////

// const uploads = await Promise.all(
//     docFiles.map(async (filePath) => {
//       // Read raw bytes
//       const buffer = await fs.readFile(filePath.path);
//       // Detect MIME type for .docx
//       const mimeType = filePath.mimeType
//       const fileName = filePath.name
//       const file = new File([buffer], fileName, { type: mimeType });
//       // Kick off upload
//       return aiT.files.upload({
//           file,
//           config: { displayName: fileName },
//       });
//     })
// );

// console.log('Uploads started:', uploads.map((u) => u.name));

// // 3) Wait for all to finish processing
// const processed = await Promise.all(
//     uploads.map((u) => waitForFile(u.name))
// );
// console.log("here!!!!x")

//   // 4) Create a “part” object for each
//   const docParts = processed.map(({ uri, mimeType }) =>{


//       createPartFromUri(uri, mimeType)
//     return {

//         fileData:{
//             fileUri: uri,
//             mimeType: mimeType
//         }
//     }
//   }
//   );



    // parts.push(...docResults)
    

    const content = [
        `explain all of the topics contained in the documents regardless of correlation and if it is a video or audio uploaded, summerize the contents in ${wordCount} words
        if it is a story then give an overview in  ${wordCount} words
        and also add a "\n" after every 80th character. and make sure to touch on every topic and heading and make sure to use ## to format the heading titles in markdown.
        And if you cannot find any topic in the document or any document at all, then please only say 
        "LOADING PLEASE WAIT..." and do not make up any topics.`,
        ...parts
        // , ...docParts
    ]
    
    const result = await aiT.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content});
        console.log(result.text)
        return result.text
    }
    
    export async function generateQuiz(questionCount, files){
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
            `generate a quiz on the topics contained in the documents regardless of correlation containing ${questionCount} well thought out questions with a single correct answer and 2 additional options that are wrong answers, make sure the correct answer is always the 3rd option`,
            ...parts
        ]
        
        const result = await aiT.models.generateContent({
            model: "gemini-2.0-flash",
            // gemini-2.5-pro-preview-03-25
            contents: content,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            'Question': {
                                type: Type.STRING,
                                description: 'a Question generated from the contents of the uploaded files for the quiz',
                                nullable: false,
                            },
                            'Answer': {
                                type: Type.STRING,
                                description: 'the answer to the question',
                                nullable: false,
                            },
                            'Options': {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING,
                                    description: 'the wrong options for the quiz question',
                                    nullable: false,
                                },
                            },
                            'Explanation':{
                                type: Type.STRING,
                                description:"An explanation of the correct answer",
                                nullable: false
                            }
                        },
                        required: ['Question', 'Answer', 'Options'],
                    },
                },
            },
        });
            
        return JSON.parse(result.text)
        }

        export async function generateFlashCards(cardCount,files){

            const aiT = new GoogleGenAI({ apiKey: process.env.API_KEY});
        
        const parts = await Promise.all(files.map(async (file) => {
            console.log(".\\" + file.path)
            const buffer = await fs.readFile(".\\" + file.path);
            return {
                inlineData: {
                    mimeType: file.mimeType,
                    data: buffer.toString('base64'),
                }
            };}))


            const content = [
                `generate ${cardCount} flashcards from the files, video or image uploaded with short questions and a single short answer for each question.
                the questions may include definitions, theories, observations calculations when applicable and facts from the file, video or image `,
                ...parts
            ]
            
            const result = await aiT.models.generateContent({
                model: "gemini-2.0-flash",
                // gemini-2.5-pro-preview-03-25
                contents: content,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                'Question': {
                                    type: Type.STRING,
                                    description: 'a short Question generated from the contents of the uploaded files',
                                    nullable: false,
                                            },
                                'Answer':{
                                    type: Type.STRING,
                                    description: 'a short answer to the corresponding question',
                                    nullable: false,
                                }
                                        },
                                        required: ['Question','Answer'],
                                },
                                    },
                        }
    ,
        })
        return JSON.parse(result.text)
}