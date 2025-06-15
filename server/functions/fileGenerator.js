import { mdToPdf } from 'md-to-pdf'
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: '../environment/.env'});
 //points to my file of environment variables



export async function generatePdf(AIres,pdfPath)  {
    try{




   await mdToPdf({content: AIres},{ dest: pdfPath });    

        console.log('PDF generated at:', pdfPath);
        console.log('PDF file exists?', fs.existsSync(pdfPath));
        return pdfPath;
    }catch (error) {
        console.log(error);
        console.error('Error generating PDF:', pdfPath, error);
        return false;
    }
}

