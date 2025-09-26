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
    

    const text2wav = require('text2wav')
    let out = await text2wav(text, {
        voice: 'en', 
        amplitude: 1.0, 
        pitch: 100, 
        speed: 100, 
        wordgap: 0, 
        capital: 0, 
        lineLength: 0, 
        encoding: 1, 
        hasTags: false, 
        noFinalPause: false, 
        punct: false
    })
})()