import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { marked } from 'marked';

import dotenv from 'dotenv';

dotenv.config({path: '../environment/.env'});
 //points to my file of environment variables



export function generatePdf(markdown, outputPath) {
  return new Promise((resolve, reject) => {
    // 1) Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // 2) Create PDFDocument and write stream
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // 3) Turn markdown into tokens
    const tokens = marked.lexer(markdown);

    // 4) Iterate tokens and render
    tokens.forEach(token => {
      switch (token.type) {
        case 'heading':
          const size = 24 - (token.depth - 1) * 3;
          doc.fontSize(size).text(token.text);
          // , { underline: token.depth === 1 }
          doc.moveDown(0.5);
          break;

        case 'paragraph':
          doc.fontSize(12).text(token.text);
          doc.moveDown();
          break;

        case 'list':
          token.items.forEach(item => {
            doc.fontSize(12).text(`• ${item.text}`, { indent: 15 });
          });
          doc.moveDown();
          break;

        // you can add blockquotes, code blocks, etc.
        default:
          break;
      }
    });

    // 5) Finalize
    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}





export async function generatjePdf(AIres,pdfPath)  {
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

