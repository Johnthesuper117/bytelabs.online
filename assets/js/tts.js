
// Wait for DOM to load before running code
document.addEventListener("DOMContentLoaded", () => {
    // set up text2wav
    const text2wav = require('text2wav')

    // Get references to all controls
    const textInput = document.getElementById("textInput"); // Text area for input
    const amplitudeInput = document.getElementById("amplitude"); // Amplitude slider
    const pitchInput = document.getElementById("pitch"); // Pitch slider
    const speedInput = document.getElementById("speed"); // Speed slider
    const voiceSelect = document.getElementById("voiceSelect"); // Voice dropdown
    const speakBtn = document.getElementById("speakBtn"); // Speak button
    const downloadBtn = document.getElementById("downloadBtn"); // Download button

    // Helper to get current values from controls
    function getSettings() {
        return {
            text: textInput.value,
            amplitude: parseFloat(amplitudeInput.value),
            pitch: parseFloat(pitchInput.value),
            speed: parseFloat(speedInput.value),
            voice: voiceSelect.value
        };
    }

    // --- SPEAK BUTTON FUNCTIONALITY ---
    // Use browser's SpeechSynthesis API to speak text aloud
    speakBtn.addEventListener("click", () => {
        const { text, pitch, speed, voice } = getSettings();
        if (!text) {
            alert("Please enter text to speak.");
            return;
        }
        // Find a matching voice for the selected language
        const voices = window.speechSynthesis.getVoices();
        // Try to match by language code or name
        let selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(voice));
        if (!selectedVoice) selectedVoice = voices[0]; // fallback
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.pitch = pitch / 100; // SpeechSynthesis expects 0-2, slider is 50-200
        utterance.rate = speed; // 0.5-2
        window.speechSynthesis.speak(utterance);
    });

    // --- DOWNLOAD BUTTON FUNCTIONALITY ---
    // Use text2wav to generate WAV and download
    downloadBtn.addEventListener("click", async () => {
        const { text, amplitude, pitch, speed, voice } = getSettings();
        if (!text) {
            alert("Please enter text to convert to audio.");
            return;
        }
        try {
            // Expecting { wav: "<base64string>" }
            const result = await response.json();
            const wavData = result.wav;
            let out = await text2wav(textInput.value, {
                amplitude: amplitude,
                pitch: pitch,
                speed: speed,
                voice: voice
            });
            (async () => {
                const text2wav = require('text2wav')
                let out = await text2wav(text)
                // out is of type Uint8Array
                const assert = require('assert')
                assert.equal(out[0], 82) //R
                assert.equal(out[1], 73) //I
                assert.equal(out[2], 70) //F
                assert.equal(out[3], 70) //F
            })()
            out.download(`${textInput.value}.wav`);
            try {
            // Convert base64 to binary
            const binary = atob(wavData);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            // Create blob and download
            const blob = new Blob([bytes], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            out.href = url;
            out.download = `${textInput.value}.wav`;
            document.body.appendChild(out);
            out.click();
            document.body.removeChild(out);
        }
        catch (error) {
            console.error("Error generating WAV:", error);
            alert("Failed to generate audio. Please try again.");
        }
    }
    catch (error) {
        console.error("Error calling text2wav API:", error);
        alert("Failed to contact server. Please try again.");
    }
});
});

// --- DEBUGGING: LOG SETTINGS ON CHANGE ---
// Add listeners to log changes for debugging
[textInput, amplitudeInput, pitchInput, speedInput, voiceSelect].forEach(el => {
    el.addEventListener("input", () => {
        console.log("Current settings:", getSettings());
    });
});

// --- OPTIONAL: PRELOAD VOICES FOR SPEECHSYNTHESIS ---
// Some browsers need this to load voices
window.speechSynthesis.onvoiceschanged = () => {
    console.log("Available voices:", window.speechSynthesis.getVoices());
};

// --- COMMENTS ---
// All major actions are commented above. Each event handler is explained.
// getSettings() always fetches latest values from controls.
// Speak uses browser TTS, Download uses text2wav (must be defined elsewhere).
// Debug logs help trace user input and settings.