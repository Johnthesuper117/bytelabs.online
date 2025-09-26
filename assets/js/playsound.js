// Function to play a sound from a given source
function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

// Play multiple sounds from an array of sources
function playMultipleSounds(sources) {
  sources.forEach(src => {
    const audio = new Audio(src);
    audio.play();
  });
}

// Example usage:
// playSound('path/to/sound.mp3');
// playMultipleSounds(['path/to/sound1.mp3', 'path/to/sound2.mp3']);