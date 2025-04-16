import say from "say";
function playAudio(AIres){

        say.speak(AIres)
        // console.log(window.speechSynthesis.speaking)
}

function stopAudio(){
    say.stop();
}

export function downloadAudio(AIres, filepath){

    say.export(AIres,"",1,filepath,function(err)
    {if (err){
        console.error(err)
    }})
return filepath;

}


