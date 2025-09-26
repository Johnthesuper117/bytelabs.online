const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const speakBtn = document.getElementById('speakBtn');

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
