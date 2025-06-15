import { mdToPdf } from 'md-to-pdf'
import fs from 'fs';
import path from 'path';

export async function generatePdf(AIres,pdfPath)  {
    try{

    const folder = path.dirname(pdfPath);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }


   const result = await mdToPdf(
    {content: AIres},
        { dest: pdfPath },
    );    
      
        
         if (!result || !result.content) {
      throw new Error('md-to-pdf did not return any PDF content');
    }


        const pdfBuffer = result.content; // Assuming result.content is a Buffer

        return pdfBuffer;
    }catch (error) {
        console.log(error);

        return false;
    }
}

