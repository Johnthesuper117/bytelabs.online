(async () => {
    // get text from tts.html object with id "textInput"
    const textInput = document.getElementById("textInput");
    const text = textInput.value;
    // get variables from sliders and dropdown menu in tts.html
    const amplitude = document.getElementById("amplitude").value;
    const pitch = document.getElementById("pitch").value;
    const speed = document.getElementById("speed").value;
    const voice = document.getElementById("voiceSelect").value;
    // convert text to wav using text2wav with the above variables
    
    //download text as wav file when downloadBtn is clicked
    document.getElementById("downloadBtn").addEventListener("click", async () => {
        const text2wav = require('text2wav')
        let out = await text2wav(text, {
            voice: voice,
            amplitude: amplitude, 
            pitch: pitch, 
            speed: speed, 
            wordgap: 0, 
            capital: 0, 
            lineLength: 0, 
            encoding: 1, 
            hasTags: false, 
            noFinalPause: false, 
            punct: false
        })
        //create blob from out
        const blob = new Blob([out], {type: 'audio/wav'});
        //create url from blob
        const url = URL.createObjectURL(blob);
        //create a element
        const a = document.createElement('a');
        //set href to url
        a.href = url;
        //set download attribute to filename
        a.download = `${text}.wav`;
        //click a element
        a.click();
        //revoke url
        URL.revokeObjectURL(url);
    });

    // speak text when speakBtn is clicked
    document.getElementById("speakBtn").addEventListener("click", async () => {
        const text2wav = require('text2wav')
        let out = await text2wav(text, {
            voice: voice,
            amplitude: amplitude, 
            pitch: pitch, 
            speed: speed, 
            wordgap: 0, 
            capital: 0, 
            lineLength: 0, 
            encoding: 1, 
            hasTags: false, 
            noFinalPause: false, 
            punct: false
        })
        //create blob from out
        const blob = new Blob([out], {type: 'audio/wav'});
        //create url from blob
        const url = URL.createObjectURL(blob);
        //create audio element
        const audio = new Audio(url);
        //play audio
        audio.play();
        //revoke url after audio is done playing
        audio.onended = () => {
            URL.revokeObjectURL(url);
        }
    });
})()