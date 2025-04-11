require("dotenv").config({path: "./environment/.env"});
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Myprompter = require("./functions/prompt.js")
const pdfGen = require("./functions/fileGenerator.js")
const audioGen = require("./functions/audioGenerator.js")
const connectDB = require("./config/db.js");

// UNUSED
const T = require("tesseract.js");
const PrompterModel = require("./models/Prompter.model.js");
const fs = require("fs");
const pdfParse = require("pdf-parse");
// UNUSED

const app = express();
const corsOptions = {origin:"http://localhost:5173",}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{cb(null,'Files/'); },
    
    filename:(req,file,cb)=>{ cb(null, file.fieldname + '-' +Date.now() + path.extname(file.originalname));}
})


const upload = multer({storage:storage})
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

let outputSize;


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
        // Parse the uploaded PDF file
        // filepath = path.join(__dirname, "Files", req.file.filename)


        const uploadedFiles = req.files.map((file) => ({
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
          }));

        
    

const dataBuffer = [];
    for (let i = 0; i < uploadedFiles.length; i++) {
    dataBuffer.push(uploadedFiles[i].path); // push the buffer to the array
   }

   // use a prompter model that saves a property called databuffer, which is an array of file paths String
//    const newPrompter = await new PrompterModel({
//     arrayOfPaths: dataBuffer,
//     status: "scheduled"
//    }).save();


//    res.send(newPrompter);

   // also add a property of status: "scheduled"
   // res.send({})

    const aiFiles = await Myprompter.aiFileUpload(dataBuffer, process.env.OPENAI_API_KEY,process.env.OPENAI_PROJ_ID,process.env.OPENAI_ORG_ID);
   if (aiFiles){
       const isUploaded = true
       res.send({isUploaded});     
    for (let i = 0; i < uploadedFiles.length; i++) {
        fs.unlinkSync(uploadedFiles[i].path)
       }
   }
   globAIFiles = aiFiles;
    
    // pdfDownload = await pdfGen.generatePdf(AIres,pdfPath);
    // audioDownload = audioGen.downloadAudio(AIres,audioPath);    

    } catch (error) {
        console.error("Error processing file:", error);
        
        if (!res.headersSent) {
            res.status(500).json({ message: "An error occurred", error: error.message });
        }
    }
});


app.get('/api/summarize', async (req, res) => {
   try{
    if (!req.body) {
        return res.status(400).json({ message: "No file uploaded" });        
    }
    
        const wordCount = req.query.size;
       if (!wordCount) {
           return res.status(400).json({ message: "Missing required parameters." });
       }
       const summary = await Myprompter.Prompter(globAIFiles,wordCount);
       res.send({summary})
   }catch (error){
    res.status(500).json({ message: "An error occurred", error: error.message });
    
   }
});


app.listen(8000, async ()=>{

    console.log("server running on port 8000")
    await connectDB()
})
