import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';

const client = new textToSpeech.TextToSpeechClient();

export async function downloadAudio(text, mp3Path) {
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  });
  fs.writeFileSync(mp3Path, response.audioContent, 'binary');
  return mp3Path;
}



