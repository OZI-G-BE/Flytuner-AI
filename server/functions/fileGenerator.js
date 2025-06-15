import { mdToPdf } from 'md-to-pdf'
import fs from 'fs';
import path from 'path';

export async function generatePdf(AIres,pdfPath)  {
    try{
   const result = await mdToPdf({content: AIres},
        { dest: pdfPath },
        {filename: pdfPath}).catch(console.error);    
      
        
         if (!result || !result.content) {
      throw new Error('md-to-pdf did not return any PDF content');
    }


        const pdfBuffer = result.content; // Assuming result.content is a Buffer

    const dir = fs.existsSync(pdfPath)
      ? null
      : fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

fs.writeFileSync(pdfPath, pdfBuffer);

        return pdfPath;
    }catch (error) {
        console.log(error);

        return false;
    }
}

