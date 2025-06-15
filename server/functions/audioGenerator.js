process.platform = 'linux';
import say from "say";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';


export  function downloadAudio(AIres, filepath, outputMp3Path){
 return new Promise((resolve, reject) => {
say.export(AIres,"",1,filepath,(err)=>{
        if (err) return reject(err);


        ffmpeg(filepath)
        .toFormat('mp3')
        .on('end', () => {
            console.log('Conversion to MP3 complete.');
            fs.unlinkSync(filepath); // Optional cleanup of WAV
            resolve(outputMp3Path);
        })
        .on('error', (err) => {
              console.error('FFmpeg error:', err);
            })
            .save(outputMp3Path);
    });
});




}