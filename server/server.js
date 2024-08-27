const express = require("express");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const multer = require("multer");
const app = express();
const path = require("path");
const fs = require("fs");
const corsOptions = {
    origin:["http://localhost:5173"]
}




const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"Files");
    },

    filename:(req,file,cb)=>{
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
})


const upload = multer({storage:storage})

app.use(express.json());
app.use(cors(corsOptions));





app.post("/api/data", upload.single('uploadFile'),async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
            
        }

        // Parse the uploaded PDF file
        filepath = path.join(__dirname, "Files", req.file.filename)
        const dataBuffer = fs.readFileSync(filepath); // get the file buffer
        const data = await pdfParse(dataBuffer);
        res.send(data);
        console.log("PDF Content:", data.text); // log the parsed content
       } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

app.listen(8000, ()=>{console.log("server running on port 8000")})