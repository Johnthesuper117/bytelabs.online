//how do I get this file to download a wav file based on the text input from tts.html?

document.addEventListener("DOMContentLoaded", () => {
    // Get references to all controls
    const textInput = document.getElementById("textInput"); // Text area for input
    const amplitudeInput = document.getElementById("amplitude"); // Amplitude slider
    const pitchInput = document.getElementById("pitch"); // Pitch slider
    const speedInput = document.getElementById("speed"); // Speed slider
    const voiceSelect = document.getElementById("voiceSelect"); // Voice dropdown
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

    // --- DOWNLOAD BUTTON FUNCTIONALITY ---
    // Use text2wav to generate WAV and download
    downloadBtn.addEventListener("click", async () => {
        const { text, amplitude, pitch, speed, voice } = getSettings();
        if (!text) {
            alert("Please enter text to convert to audio.");
            return;
        }
        try {
            // text2wav should be defined elsewhere and return base64 WAV
            const wavData = await text2wav(text, amplitude, pitch, speed, voice);
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
            a.download = "output.wav";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating WAV:", error);
            alert("Failed to generate audio. Please try again.");
        }
    })
});