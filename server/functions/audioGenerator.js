import say from "say";

export function downloadAudio(AIres, filepath){

    say.export(AIres,"",1,filepath,function(err)
    {if (err){
        console.error(err)
    }})
return filepath;
}