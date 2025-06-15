import dotenv from 'dotenv';

dotenv.config({path: '../environment/.env'});
 //points to my file of environment variables

import fs from 'fs';
import AWS from 'aws-sdk';

// Configure via env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
const polly = new AWS.Polly();

export async function downloadAudio(text, mp3Path) {
  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Joanna', // or other supported voices
  };
  const { AudioStream } = await polly.synthesizeSpeech(params).promise();
  fs.writeFileSync(mp3Path, AudioStream);
  return mp3Path;
}






