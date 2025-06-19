import dotenv from 'dotenv';

dotenv.config({path: '../environment/.env'});
 //points to my file of environment variables

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { PassThrough } from 'stream';
import { pipeline } from 'stream/promises';
import fs from "fs";

// Configure via env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
const polly = new PollyClient({ region: process.env.AWS_REGION });


function splitText(text, maxLen = 2500) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLen) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      if (sentence.length > maxLen) {
        // Extremely long sentence: force‑split
        for (let i = 0; i < sentence.length; i += maxLen) {
          chunks.push(sentence.slice(i, i + maxLen));
        }
        continue;
      }
    }
    current += sentence;
  }
  if (current) chunks.push(current);
  return chunks;
}


export async function downloadAudio(text, mp3Path) {

    const parts = splitText(text, 2500);





  const streams = await Promise.all(parts.map(async (chunk) => {
  const { AudioStream } = await polly.send(
    new SynthesizeSpeechCommand({
    Text: chunk,
    OutputFormat: "mp3",
    VoiceId: "Joanna",
  })
);
return AudioStream
 
}));

   const writeStream = fs.createWriteStream(mp3Path);

  // Pipe the TTS stream to the file and wait for it to finish
 for (let i = 0; i < streams.length; i++) {
    await pipeline(
      streams[i],
      writeStream,
      { end: false }   // keep writing for the next chunks
    );
    console.log(`Wrote chunk ${i + 1}/${streams.length}`);
  }

  // Now that all chunks are in, close the file
  writeStream.end();
  console.log("Audio download complete:", mp3Path);

  return mp3Path;
}


// export  function downloadAudio(AIres, filepath, outputMp3Path){
//  return new Promise((resolve, reject) => {
// say.export(AIres,"",1,filepath,(err)=>{
//         if (err) return reject(err);


//         ffmpeg(filepath)
//         .toFormat('mp3')
//         .on('end', () => {
//             console.log('Conversion to MP3 complete.');
//             fs.unlinkSync(filepath); // Optional cleanup of WAV
//             resolve(outputMp3Path);
//         })
//         .on('error', (err) => {
//               console.error('FFmpeg error:', err);
//             })
//             .save(outputMp3Path);
//     });
// });

// }



