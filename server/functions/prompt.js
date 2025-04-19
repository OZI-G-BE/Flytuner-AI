//-------------------------------------------CURRENT GOOGLE GEMINI CODE--------------------------------------------------------//
import { createPartFromUri, GoogleGenAI } from "@google/genai";
import * as fs from 'fs/promises';
import dotenv from 'dotenv';
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY});

dotenv.config({path: '../environment/.env'});


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
        if it is a story then give an overview in  ${wordCount} words
        and also add a "\n" after every 80th character. and make sure to touch on every topic and heading and make sure to use ## to format the heading titles in markdown.
        And if you cannot find any topic in the document or any document at all, then please only say 
        "LOADING PLEASE WAIT..." and do not make up any topics.`,
        ...parts
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
            `generate a quiz on the topics contained in the documents regardless of correlation containing ${questionCount} well thought out questions
surround each of the question texts in between @ and % and the option 1 with the & symbol on the left and - symbol on the right, option 2 with the ; symbol on its left and : symbol on its right
and option 3 which is always the correct optionshould be surrounded by the _ symbol on the left and the = symbol on the right
do not repeat a surrounding for the options within the same question
THIS PART IS IMPORTANT PLEASE: MAKE SURE ALL THE SYMBOLS MENTIONED ONLY APPEAR ${questionCount} TIMES IN THE ENTIRE QUIZ`,
            ...parts
        ]
        
        const result = await aiT.models.generateContent({
            model: "gemini-2.0-flash",
            contents: content});
            
            return result.text
        }

    //-------------------------------------------CURRENT GOOGLE GEMINI CODE--------------------------------------------------------//
    
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
        // geminiAPI();
