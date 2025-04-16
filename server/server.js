import dotenv from 'dotenv';

import express, {json, static as static_} from "express";
import cors from "cors";
import multer, { diskStorage } from "multer";
import { extname } from "path";
import { summarizeGemini} from "./functions/prompt.js";
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
let uploadedFiles = [];

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

        // summarizeGemini(100, uploadedFiles)
 

const dataBuffer = [];
    for (let i = 0; i < uploadedFiles.length; i++) {
    dataBuffer.push({path: uploadedFiles[i].path,
                     name: uploadedFiles[i].originalname,
                     mimeType: uploadedFiles[i].mimetype,
                     checked: true}
                    ); // push the buffer to the array

    
   }
   
   
   

       res.send({isUploaded:true , dataBuffer});     
 
    
    //globAIFiles = allResults;
    
    
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
        // console.log("vectorStore", globAIFiles[0])
        pdfDownload = await generatePdf(summary,pdfPath);
        audioDownload = downloadAudio(summary,audioPath);    
        res.send({summary})
    }catch (error){
        console.log(error)
        res.status(500).json({ message: "An error occurred", error: error.message });
        
    }
});


app.post('/api/updateVS', async (req, res)=>{
    try {
        if (!req.body) {
            return res.status(400).json({ message: "No file uploaded" });        
        }
        
        //    console.log("fileIDs", fileIDs)
        // console.log(globAIFiles[0])
        uploadedFiles = req.body.selectedFiles
        globAIFiles[0] = response
        res.send(globAIFiles[0])
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
})



app.listen(8000, async ()=>{
    
    console.log("server running on port 8000")
    // await connectDB()
})


// use a prompter model that saves a property called databuffer, which is an array of file paths String
//    const newPrompter = await new PrompterModel({
    //     arrayOfPaths: dataBuffer,
    //     status: "scheduled"
    //    }).save();
    
    
    //    res.send(newPrompter);
    
    // also add a property of status: "scheduled"
    // res.send({})
    //REFACTORED OPEN AI CODE//
    //const aiFiles = await Myprompter.aiFileUpload(dataBuffer, process.env.OPENAI_API_KEY,process.env.OPENAI_PROJ_ID,process.env.OPENAI_ORG_ID);
    //REFACTORED OPEN AI CODE//