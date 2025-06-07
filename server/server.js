import express, {json, static as static_} from "express";
import cors from "cors";
import multer, { diskStorage } from "multer";
import { extname } from "path";
import { summarizeGemini,generateQuiz,generateFlashCards } from "./functions/prompt.js";
import { generatePdf } from "./functions/fileGenerator.js";
import { downloadAudio } from "./functions/audioGenerator.js";
import { unlinkSync } from "fs";
import dotenv from 'dotenv';



// UNUSED
// import {connectDB} from "./config/db.js";
// import { mdToPdf } from 'md-to-pdf'
// import T from "tesseract.js";
// import PrompterModel from "./models/Prompter.model.js";
// import pdfParse from "pdf-parse";
// UNUSED


dotenv.config({
  path: './environment/.env'
});

const app = express();
const corsOptions = {origin:"https://flytuner-ai.onrender.com",}
const PORT = process.env.PORT || 8000;
const storage = diskStorage({
    destination:(req,file,cb)=>{cb(null,'Files/'); },
    
    filename:(req,file,cb)=>{ cb(null, file.originalname + '-' +Date.now() + extname(file.originalname));}
})


const upload = multer({storage:storage})


app.use(json());
app.use(cors(corsOptions));
app.use(static_('public'));

let uploadedFiles = []; // might be overwritten by update vs / Done button fix that

let pdfDownload;
let audioDownload;
let pdfPath
let audioPath

// let mimeTypesArray = [
//     	"application/javascript",
// 	"text/x-python",
// 	"text/x-java-source",
//     "text/x-csrc",
// 	"text/x-c++src",
// 	"application/typescript",
//     "image/gif",
// 	"image/svg+xml",
// 	"image/bmp",
// 	"image/tiff",
// 	"image/vnd.microsoft.icon",
// 	"audio/ogg",
// 	"audio/opus",
// 	"video/webm",
// 	"video/x-msvideo",
// 	"video/quicktime",
// 	"video/x-ms-wmv",
// 	"video/x-matroska",
// 	// "text/markdown",
// 	"text/html",
// 	"application/xml",
// 	"text/csv",
// 	"application/rtf",
// 	"application/x-yaml",
// 	"application/json",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// "application/vnd.openxmlformats-officedocument.presentationml.presentation",
// "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// ];

// DOWNLAODS//

app.get('/api/data/download/pdf', (req, res) => {
    res.download(pdfDownload); // Prompts a download in the frontend
});

app.get('/api/data/download/audio', (req, res) => {
    res.download(audioDownload); // Prompts a download in the frontend
});




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
        if(pdfDownload || audioDownload){
            unlinkSync(pdfDownload)
            unlinkSync(audioDownload)
        }
        pdfDownload = null;
        audioDownload = null;
        res.send({removed: true})
    }catch (error){
        res.status(500).json({ message: "An error occurred", error: error.message });
        console.log(error)
    }
});




// const docFiles = []
// const normalFiles = []
    //   for(let i = 0; i < allFiles.length; i++) {
    //         if (mimeTypesArray.includes(allFiles[i].mimeType)){
    //             docFiles.push(allFiles[i])
    //         }else{
    //             normalFiles.push(allFiles[i])
    //             console.log(allFiles[i].mimeType)
    //         }
    //     }




app.post('/api/summarize', async (req, res) => {
    try{
        const wordCount = req.body.size;
        const allFiles = req.body.selectedFiles;
        if (!wordCount || !allFiles) {
            return res.status(400).json({ message: "Missing required parameters." });}
        const summary = await summarizeGemini(wordCount, allFiles);
        
        pdfPath = "public/"+Date.now()+"outputPDF.pdf";
        audioPath = "public/"+Date.now()+"outputPDF.wav"

        if (pdfDownload || audioDownload) {
            unlinkSync(pdfDownload);
            unlinkSync(audioDownload);}
         pdfPath = "public/"+Date.now()+"outputPDF.pdf";
         audioPath = "public/"+Date.now()+"outputPDF.wav"

        pdfDownload = await generatePdf(summary,pdfPath);
        //change it to normal text before entering the audio function
        audioDownload = downloadAudio(summary,audioPath);    
        res.send({summary, issummed:true})
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
            return res.status(400).json({ message: "Missing required parameters." }); }
        const quiz = await generateQuiz(questionCount, files);
        
        const quizData = [] //array of questions
        const quizans1 = [] //array of answer1s
        const quizans2 = []; //array of answer2s
        const quizans3 = []; //array of answer3s [correct answers]
        const ansExplained = []; // array of the answer explanatoins
        const quizObj = [] // redistributed properties of quiz

        for(let i = 0; i< quiz.length;i++){
        quizData.push(quiz[i].Question)
        quizans1.push(quiz[i].Options[0])
        quizans2.push(quiz[i].Options[1])
        quizans3.push(quiz[i].Answer)
        ansExplained.push(quiz[i].Explanation)
    }
    for(let i = 0; i< quiz.length;i++){
    quizObj.push({questions: quizData[i],
        ans: [[quizans1[i],  false],[quizans2[i], false], [quizans3[i], true]],
        Explanations: ansExplained[i] })
    }  
        console.log(quiz)
        res.send({quizObj})
    }catch (error){
        console.log(error)
        res.status(500).json({ message: "An error occurred", error: error.message});
    }
})


app.post('/api/generateFlashCards', async(req,res)=>{
    try{
        const cardCount = req.body.size;
        const files = req.body.selectedFiles;
        if (!cardCount || !files) {
            return res.status(400).json({ message: "Missing required parameters." });
        }
        const flashCardArray = await generateFlashCards(cardCount, files);  

        res.send({flashCardArray})
    }
        catch(error){
            console.log(error)
            res.status(500).json({ message: "An error occurred", error: error.message});
        }


        
})
app.listen(PORT, async ()=>{
    
    console.log(`server running on port ${PORT}`)
    // await connectDB()
})
