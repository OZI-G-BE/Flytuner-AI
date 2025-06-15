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
  // AudioStream is a ReadableStream or Uint8Array depending on runtime
  // If it's a Uint8Array in Node.js:
  fs.writeFileSync(mp3Path, AudioStream);
  return mp3Path;
}






