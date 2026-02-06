# Soundboard Setup Guide

## Initial Setup

1. Place your audio files in `./assets/sounds/`
2. Run the generator:
   ```bash
   python3 ./bin/soundList.py "./assets/sounds/"
   ```
   This creates `public/soundboard.json` with all sound files.

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000/soundboard` to see your buttons.

## How It Works

- `bin/soundList.py` scans `assets/sounds/` and generates `public/soundboard.json`
- The soundboard page fetches this JSON and renders buttons
- Each button plays the corresponding sound file
- On commit, GitHub Actions auto-regenerates the JSON

## Supported Formats

MP3, WAV, OGG, WebM, and any format your browser supports.
