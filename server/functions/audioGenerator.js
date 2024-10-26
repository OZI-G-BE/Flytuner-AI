const say = require("say");
const ffmpeg = require('fluent-ffmpeg');
function playAudio(AIres){

        say.speak(AIres)
        // console.log(window.speechSynthesis.speaking)
}

function stopAudio(){
    say.stop();
}

function downloadAudio(AIres, filepath){

    say.export(AIres,"",1,filepath,function(err)
    {if (err){
        console.error(err)
    }})
return filepath;

}



module.exports = {

    playAudio,
    downloadAudio,
    stopAudio

}