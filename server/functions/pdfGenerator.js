const express = require("express");
const cors = require("cors");
const { jsPDF } = require("jspdf");
const path = require("path");
const fs = require("fs");


const app = express();
const corsOptions = {
    origin:["http://localhost:5173"]
}
app.use(express.json());
app.use(cors(corsOptions));



function generatePdf(AIres, filename) {
    const doc = new jsPDF();
doc.text(AIres, 10, 10);
doc.save(filename);
filepath = path.join(__dirname,"./",filename)

return filepath
}

module.exports = {
generatePdf
}