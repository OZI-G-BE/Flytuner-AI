// import mdToPdf from md-to-pdf




export async function generatePdf(AIres,pdfPath)  {
    try{
    await mdToPdf({content: AIres}, { dest: pdfPath },{filename: pdfPath}).catch(console.error);    
       
        return pdfPath;
    }catch (error) {
        console.log(error);

        return false;
    }
}

