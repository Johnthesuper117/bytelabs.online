(async () => {
    // get text from tts.html object with id "textInput"
    const textInput = document.getElementById("textInput");
    const text = textInput.value;
    // get variables from sliders and dropdown menu in tts.html
    const amplitude = document.getElementById("amplitude").value;
    const pitch = document.getElementById("pitch").value;
    const speed = document.getElementById("speed").value;
    const voice = document.getElementById("voiceSelect").value;
    // convert text to wav using text2wav with the above variables and store in a variable
    async function text2wav(text, amplitude, pitch, speed, voice) {
        const response = await fetch('https://api.example.com/text2wav', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                amplitude: amplitude,
                pitch: pitch,
                speed: speed,
                voice: voice
            })
        });
        const data = await response.json();
        return data.wav; // assuming the API returns a base64 encoded wav file
    }
    const wavData = await text2wav(text, amplitude, pitch, speed, voice);
    

    const apiKey = process.env.API_KEY;

    // speak text when speakBtn is clicked use text to speech synthesis
    const speakBtn = document.getElementById("speakBtn");
    speakBtn.addEventListener("click", () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === language);
        utterance.pitch = pitch;
        utterance.rate = speed;
        speechSynthesis.speak(utterance);
    });

    // download text as wav file when downloadBtn is clicked, use text2wav with the above variables
    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.addEventListener("click", async () => {
        const wavData = await text2wav(text, amplitude, pitch, speed, voice);
        const blob = new Blob([new Uint8Array(atob(wavData).split("").map(c => c.charCodeAt(0)))], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "speech.wav";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });


})();