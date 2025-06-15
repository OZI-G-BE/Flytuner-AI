import express, {json, static as static_} from "express";
import cors from "cors";
import multer, { diskStorage } from "multer";
import { extname } from "path";
import { summarizeGemini,generateQuiz,generateFlashCards } from "./functions/prompt.js";
import { generatePdf } from "./functions/fileGenerator.js";
import { downloadAudio } from "./functions/audioGenerator.js";
import { readFileSync, unlinkSync } from "fs";
import dotenv from 'dotenv';
import {connectDB,FileModel} from "./config/db.js";
import path from "path";
import fs from "fs";

// UNUSED
// import { mdToPdf } from 'md-to-pdf'
// import T from "tesseract.js";
// import PrompterModel from "./models/Prompter.model.js";
// import pdfParse from "pdf-parse";
// UNUSED


if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './environment/.env' });
}

const app = express();

const allowed = (process.env.CORS_ORIGIN || '').split(',');
app.use(cors({
  origin: allowed,
  credentials: true,
}));

const PORT = process.env.PORT || 8000;
const storage = diskStorage({
    destination:(req,file,cb)=>{cb(null,'Files/'); },
    
    filename:(req,file,cb)=>{ cb(null, file.originalname + '-' +Date.now() + extname(file.originalname));}
})


const upload = multer({storage:storage})



app.use(json());
app.use(static_('public'));

// DOWNLAODS//

app.get('/api/download/pdf/:id', async (req, res) => {
  const file = await FileModel.findById(req.params.id);
  if (!file) return res.status(404).send("Not found");

  res.set({
    'Content-Type': file.pdf.contentType,
    'Content-Disposition': `attachment; filename="${file.pdf.filename}"`,
  });

  res.send(file.pdf.data);
});

app.get('/api/download/audio/:id', async (req, res) => {
  const file = await FileModel.findById(req.params.id);
  if (!file) return res.status(404).send("Not found");

  res.set({
    'Content-Type': file.audio.contentType,
    'Content-Disposition': `attachment; filename="${file.audio.filename}"`,
  });

  res.send(file.audio.data);
});





    //RECIEVE FRONTEND DATA//
app.post('/api/data', upload.array('uploadFile'),async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No file uploaded" });      
        }
      const uploadedFiles = req.files
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
       const removeFiles = req.body.selectedFiles;
        const delMDBFiles = req.body.id;
        // console.log(uploadedFiles.length)
        const len = removeFiles.length
        for (let i = 0; i < len; i++) {
console.log(i)
            unlinkSync(removeFiles[i].path)
            console.log("file removed: ", removeFiles[i])
        }  
        

 const doc = await FileModel.findByIdAndDelete(delMDBFiles);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    
    
    // res.json({ message: 'Deleted successfully' });
    res.send({removed: true})
    }catch (error){
        res.status(500).json({ message: "An error occurred", error: error.message });
        console.log(error)
    }
});

app.post('/api/summarize',  upload.array('uploadFile'), async (req, res) => {
    try{
        const wordCount = req.body.size;
        const allFiles = req.body.selectedFiles;
        if (!wordCount || !allFiles) {
            return res.status(400).json({ message: "Missing required parameters." });}
        
        let summary;
        const externalKey = req.body.API_KEY;
        if (externalKey === undefined || externalKey === null || externalKey == '') {
            summary = await summarizeGemini(wordCount, allFiles);
        }else{
            summary = await summarizeGemini(wordCount, allFiles, externalKey);
        }
        
        if(req.body.id){
            const doc = await FileModel.findByIdAndDelete(req.body.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
        }

    let pdfDownload 
    let audioDownload
    let outputMp3Path
    let pdfPath
    
 const uploadDir = path.join(process.cwd(), 'Files');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
    const in24h = new Date(Date.now() + 24*60*60*1000);
    const timestamp = Date.now();
    
    const pdfName = `${timestamp}outputPDF.pdf`
        
    const outputMp3Name = `${timestamp}outputAudio.mp3`
        
     pdfPath   = path.join(process.cwd(), 'Files', pdfName);
      
       outputMp3Path   = path.join(process.cwd(), 'Files', outputMp3Name);

        //change it to normal text before entering the audio function
        pdfDownload = await generatePdf(summary,pdfPath);
        console.log("passed pdf gen")
        audioDownload = await downloadAudio(summary,outputMp3Path); 
        console.log("passed audio gen")


        console.log('App working directory is:', process.cwd());

console.log('generatePdf wrote to:', pdfPath);
console.log('pdf file exists?', fs.existsSync(pdfPath));

console.log('generateAudio wrote to:', outputMp3Path);
console.log('audio file exists?', fs.existsSync(outputMp3Path));

        const pdfBuffer =  pdfDownload;
        console.log("pdf buffer read")

        const audioBuffer = fs.readFileSync(outputMp3Path);
        console.log("audio buffer read")

        const title = `Summary-${timestamp}`;
        
        const fileDoc = new FileModel({
            title,
            summary,
            pdf: {
                data: pdfBuffer,
                contentType: "application/pdf",
                filename: `${timestamp}.pdf`
            },
    audio: {
        data: audioBuffer,
        contentType: "audio/wav",
        filename: `${timestamp}.mp3`
    },

    expireAt: in24h,
});

await fileDoc.save();

unlinkSync(pdfDownload);
unlinkSync(outputMp3Path);


        res.send({summary, issummed:true, id: fileDoc._id});
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

            let quiz;
            const externalKey = req.body.API_KEY;
        if (externalKey === undefined || externalKey === null || externalKey == '') {
            quiz = await generateQuiz(questionCount, files);
        }else{
            quiz = await generateQuiz(questionCount, files, externalKey);
        }
        
        
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
        const externalKey = req.body.API_KEY;

           let flashCardArray;
        if (externalKey === undefined || externalKey === null || externalKey == '') {
            flashCardArray = await generateFlashCards(cardCount, files)
        }else{
            flashCardArray = await generateFlashCards(cardCount, files,externalKey);
        }
        

        res.send({flashCardArray})
    }
        catch(error){
            console.log(error)
            res.status(500).json({ message: "An error occurred", error: error.message});
        }


        
})

app.post('/api/saveApiKey', async (req, res) => {
    try{
        externalKey = req.body.extAPIKey;

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "An error occurred", error: error.message });
    }})

    
    app.listen(PORT, async ()=>{
        
        await connectDB()
    console.log(`server running on port ${PORT}`)
    console.log(`the allowed origins are: ${allowed}`)
})
