const fs = require('fs');
const { mdToPdf } = require('md-to-pdf');




async function generatePdf(AIres,pdfPath)  {
    try{
        const pdf = await mdToPdf({content: AIres}, { dest: pdfPath },{filename: pdfPath}).catch(console.error);    
       
        return pdfPath;
    }catch (error) {
        console.log(error);

        return false;
    }
}

module.exports = {
generatePdf
}