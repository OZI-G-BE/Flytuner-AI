const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
const path = require("path");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const Myprompter = require("./functions/prompt.js")
const T = require("tesseract.js");


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

// let data;
// let dataBuffer;

app.post("/api/data", upload.single('uploadFile'),async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
            
        }

        // Parse the uploaded PDF file
        filepath = path.join(__dirname, "Files", req.file.filename)
        if (req.file.mimetype =="application/pdf") {
           const dataBuffer = fs.readFileSync(filepath); // get the file buffer
          const data = await pdfParse(dataBuffer);
            const AIres = await Myprompter.prompter(data.text, process.env.API_KEY);
                console.log(AIres)
            res.send(AIres);     
        }
        else if(req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg")
                    {
                   const  data =  await T.recognize(filepath,'eng')
                   const AIres = await Myprompter.prompter(data.data.text, process.env.API_KEY);

                    res.send(AIres);
                    }

        else{
           const  dataBuffer = fs.readFileSync(filepath, "utf-8");

           const AIres = await Myprompter.prompter(dataBuffer, process.env.API_KEY);
           console.log(AIres)
            res.send(AIres);
      
        }
       
fs.unlink(filepath, (err)=>{
    if (err){
        return console.log(err);
    }
 
})

       } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

app.listen(8000, ()=>{console.log("server running on port 8000")})
// module.exports = {
// data,
// dataBuffer,
// }