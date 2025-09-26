const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const speakBtn = document.getElementById('speakBtn');
const downloadBtn = document.getElementById('downloadBtn');

let voices = [];
const synth = window.speechSynthesis;

//list available voices and populate the select dropdown
function populateVoiceList() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = ''; // Clear previous options
    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
}

// Populate voices when they are loaded or when the page loads
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoiceList;
} else {
    populateVoiceList(); // Fallback for browsers that don't fire onvoiceschanged
}

//Button to speak the text
speakBtn.addEventListener('click', () => {
    if (textInput.value !== '') {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
        utterance.voice = voices.find(voice => voice.name === selectedVoiceName);
        synth.speak(utterance);
    }
});

//Button to download the speech as an audio file fully supported in Chrome and Edge
downloadBtn.addEventListener('click', () => {
    if (textInput.value !== '') {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
        utterance.voice = voices.find(voice => voice.name === selectedVoiceName);

        // Create a temporary audio context and destination
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const destination = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(destination.stream);
        const chunks = [];

        // Connect the utterance to the destination
        const sourceNode = audioContext.createMediaStreamSource(destination.stream);
        sourceNode.connect(audioContext.destination);
        mediaRecorder.ondataavailable = event => {
            chunks.push(event.data);
        };

        //audio recording and download logic
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'tts_output.wav';
            document.body.appendChild(a);

            a.click();

            chunks.length = 0;
            window.URL.revokeObjectURL(url);
        };

        // Start recording
        mediaRecorder.start();

        // Speak the utterance
        synth.speak(utterance);
        
        // Stop recording when the utterance ends
        utterance.onend = () => {
            mediaRecorder.stop();
            audioContext.close();
        };

        const source = audioContext.createMediaStreamSource(destination.stream);
        source.connect(audioContext.destination);
        synth.speak(utterance);
    }
});// Note: Downloading TTS output directly is not natively supported in browsers.
// This implementation uses MediaRecorder to capture the audio output.