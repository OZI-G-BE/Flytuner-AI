const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Myprompter = require("./functions/prompt.js")
const pdfGen = require("./functions/fileGenerator.js")
const T = require("tesseract.js");

const app = express();

require("dotenv").config({path: "./environment/.env"});


const corsOptions = {
    origin:["http://localhost:5173"]
}




const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"Files");
    },

    filename:(req,file,cb)=>{
        // console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
})


const upload = multer({storage:storage})
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

let outputSize;
let paragraphs;
let pages;

let pdfDownload;
let pdfPath = 'public/outputPDF.pdf';

app.get('/api/data/download', (req, res) => {
   
    res.download(pdfDownload); // Prompts a download in the frontend
});

app.get("/api/data/params",async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "No file uploaded" });        
        }
        outputSize = req.query.size;
        paragraphs = req.query.paragraphs;
        pages = req.query.pages
        res.send("recieved data")
    
    }
    catch(error){

    }
    })
    

app.post("/api/data", upload.single('uploadFile'),async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
            
        }

        // Parse the uploaded PDF file
        filepath = path.join(__dirname, "Files", req.file.filename)
        if (req.file.mimetype =="application/pdf") {
           const dataBuffer = fs.readFileSync(filepath); // get the file buffer
           
           fs.unlinkSync(filepath, (err)=>{
            if (err){
                return console.log(err);
            }
         
        })
          
           const data = await pdfParse(dataBuffer);
            const AIres = await Myprompter.prompter(data.text, process.env.API_KEY,outputSize,paragraphs,pages);
                // console.log(AIres)
              pdfDownload = await pdfGen.generatePdf(AIres,pdfPath);
           
              
            res.send({AIres});     
        }
        else if(req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg")
                    {
                   const  data =  await T.recognize(filepath,'eng')

                   fs.unlinkSync(filepath, (err)=>{
                    if (err){
                        return console.log(err);
                    }
                 
                })


                   const AIres = await Myprompter.prompter(data.data.text, process.env.API_KEY,outputSize,paragraphs,pages);
                   pdfDownload = await pdfGen.generatePdf(AIres,pdfPath);
              
                   res.send({AIres});   
                    }

        else{
           const  dataBuffer = fs.readFileSync(filepath, "utf-8");

           fs.unlinkSync(filepath, (err)=>{
            if (err){
                return console.log(err);
            }
         
        })


           const AIres = await Myprompter.prompter(dataBuffer, process.env.API_KEY,outputSize,paragraphs,pages);
           
           pdfDownload = await pdfGen.generatePdf(AIres,pdfPath);
           res.send({AIres});  
      
        }
       


       } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});



app.listen(8000, ()=>{console.log("server running on port 8000")})
