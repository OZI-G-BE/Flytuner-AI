import dotenv from 'dotenv';

import express, {json, static as static_} from "express";
import cors from "cors";
import multer, { diskStorage } from "multer";
import { extname } from "path";
import { summarizeGemini,generateQuiz } from "./functions/prompt.js";
import { generatePdf } from "./functions/fileGenerator.js";
import { downloadAudio } from "./functions/audioGenerator.js";
// import {connectDB} from "./config/db.js";

// UNUSED
// import T from "tesseract.js";
// import PrompterModel from "./models/Prompter.model.js";
// import pdfParse from "pdf-parse";
import { unlinkSync } from "fs";
// UNUSED

dotenv.config({
  path: './environment/.env'
});
const app = express();
const corsOptions = {origin:"http://localhost:5173",}

const storage = diskStorage({
    destination:(req,file,cb)=>{cb(null,'Files/'); },
    
    filename:(req,file,cb)=>{ cb(null, file.originalname + '-' +Date.now() + extname(file.originalname));}
})


const upload = multer({storage:storage})
app.use(json());
app.use(cors(corsOptions));
app.use(static_('public'));

let outputSize;
let uploadedFiles = []; // might be overwritten by update vs / Done button fix that

let pdfDownload;
let audioDownload;

let globAIFiles = [];
let pdfPath = 'public/outputPDF.pdf';
let audioPath = 'public/outputAudio.wav'


// DOWNLAODS//

app.get('/api/data/download/pdf', (req, res) => {
    res.download(pdfDownload); // Prompts a download in the frontend
});

app.get('/api/data/download/audio', (req, res) => {
    res.download(audioDownload); // Prompts a download in the frontend
});

app.get('/api/data/download/audio/playAudio', (req, res) => {/* logic to play a sound*/});


    //RECIEVE FRONTEND DATA//
app.post('/api/data', upload.array('uploadFile'),async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No file uploaded" });      
        }
        uploadedFiles = req.files
const dataBuffer = [];
    for (let i = 0; i < uploadedFiles.length; i++) {
    dataBuffer.push({path: uploadedFiles[i].path,
                     name: uploadedFiles[i].originalname,
                     mimeType: uploadedFiles[i].mimetype,
                     checked: true}
                    ); // push the buffer to the array
   }
       res.send({isUploaded:true , dataBuffer});     
    
} catch (error) {
    console.error("Error processing file:", error);
    if (!res.headersSent) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
}
});


app.post('/api/removeFile', async (req, res) => {
    try{
        // console.log(uploadedFiles.length)
        const len = uploadedFiles.length
        for (let i = 0; i < len; i++) {
console.log(i)
            unlinkSync(uploadedFiles[i].path)
            console.log("file removed: ", uploadedFiles[i])
        }        
        res.send({removed: true})
    }catch (error){
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

app.post('/api/summarize', async (req, res) => {
    try{
        const wordCount = req.body.size;
        const files = req.body.selectedFiles;
        if (!wordCount || !files) {
            return res.status(400).json({ message: "Missing required parameters." });
        }
        const summary = await summarizeGemini(wordCount, files);
        pdfDownload = await generatePdf(summary,pdfPath);
        audioDownload = downloadAudio(summary,audioPath);    
        res.send({summary})
    }catch (error){
        console.log(error)
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

app.post('/api/generateQuiz', async (req, res) => {
    try{
        const questionCount = req.body.size;
        const files = req.body.selectedFiles;
        if (!questionCount || !files) {
            return res.status(400).json({ message: "Missing required parameters." });
        }
        const quiz = await generateQuiz(questionCount, files);
        
        const quizData = [...quiz.matchAll(/@([\s\S]*?)%/g)].map(m => m[1].trim()); //array of questions
        const quizans1 = [...quiz.matchAll(/&([\s\S]*?)-/g)].map(m => m[1].trim()); //array of answer1s
        const quizans2 = [...quiz.matchAll(/;([\s\S]*?):/g)].map(m => m[1].trim()); //array of answer2s
        const quizans3 = [...quiz.matchAll(/_([\s\S]*?)=/g)].map(m => m[1].trim()); //array of answer3s [correct answers]
        const quizObj = []
        for(let i = 0; i< quizData.length;i++){

            quizObj.push({questions: quizData[i], ans: [[quizans1[i],  false], [quizans2[i], false], [quizans3[i], true]] })
        }

        // pdfDownload = await generatePdf(quiz,pdfPath);
        // audioDownload = downloadAudio(quiz,audioPath);    
        console.log(quiz)
        res.send({quizObj})
    }catch (error){
        console.log(error)
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
})

app.listen(8000, async ()=>{
    
    console.log("server running on port 8000")
    // await connectDB()
})