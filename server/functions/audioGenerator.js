import dotenv from 'dotenv';

dotenv.config({path: '../environment/.env'});
 //points to my file of environment variables

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import fs from "fs";

// Configure via env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
const polly = new PollyClient({ region: process.env.AWS_REGION });


export async function downloadAudio(text, mp3Path) {
  const cmd = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Joanna",
  });

  const { AudioStream } = await polly.send(cmd);
   const writeStream = fs.createWriteStream(mp3Path);

  // Pipe the TTS stream to the file and wait for it to finish
  await new Promise((resolve, reject) => {
    AudioStream.pipe(writeStream)
      .on("finish", resolve)
      .on("error", reject);
  });

  return mp3Path;
}






