const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const speakBtn = document.getElementById('speakBtn');
const downloadBtn = document.getElementById('downloadBtn');

let voices = [];
const synth = window.speechSynthesis;

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

speakBtn.addEventListener('click', () => {
    if (textInput.value !== '') {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
        utterance.voice = voices.find(voice => voice.name === selectedVoiceName);
        synth.speak(utterance);
    }
});

downloadBtn.addEventListener('click', () => {
    if (textInput.value !== '') {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
        utterance.voice = voices.find(voice => voice.name === selectedVoiceName);

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const destination = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(destination.stream);
        const chunks = [];

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${textInput.value}.wav`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        };

        mediaRecorder.start();
        utterance.onend = () => {
            mediaRecorder.stop();
            audioContext.close();
        };
        
        const source = audioContext.createMediaStreamSource(destination.stream);
        source.connect(audioContext.destination);
        synth.speak(utterance);
    }
});
