
// Wait for DOM to load before running code
document.addEventListener("DOMContentLoaded", () => {
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
            // Call backend API to generate WAV using text2wav
            const response = await fetch("/api/text2wav", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, amplitude, pitch, speed, voice })
            });
            if (!response.ok) {
                throw new Error("Failed to generate WAV from server");
            }
            // Expecting { wav: "<base64string>" }
            const result = await response.json();
            const wavData = result.wav;
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
            const a = document.createElement("a");
            a.href = url;
            a.download = `${textInput.value}.wav`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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