import { mdToPdf } from 'md-to-pdf'
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: '../environment/.env'});
 //points to my file of environment variables



export async function generatePdf(AIres,pdfPath)  {
    try{




   const result = await mdToPdf(
    {content: AIres},
        { dest: pdfPath },
    );    
      
        
         if (!result || !result.content) {
      throw new Error('md-to-pdf did not return any PDF content');
    }


        const pdfBuffer = result.content; // Assuming result.content is a Buffer
console.log("pdf buffer generated"+ pdfBuffer);
        return pdfPath;
    }catch (error) {
        console.log(error);

        return false;
    }
}

