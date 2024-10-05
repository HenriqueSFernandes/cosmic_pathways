import * as THREE from "three";

export default class AudioHandler {
  constructor(camera, audioFilePath, volume = 0.9, loop = true) {
    this.audioListener = new THREE.AudioListener(); // Create an AudioListener
    camera.add(this.audioListener); // Add listener to the camera

    this.sound = new THREE.Audio(this.audioListener); // Create Audio object
    this.audioLoader = new THREE.AudioLoader(); // Create AudioLoader

    this.audioFilePath = audioFilePath; // Path to the audio file
    this.volume = volume; // Volume level
    this.loop = loop; // Looping setting

    this.loadAudio(); // Load audio when instance is created
  }

  // Method to load the audio file
  loadAudio() {
    this.audioLoader.load(
      this.audioFilePath,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(this.loop);
        this.sound.setVolume(this.volume);

        console.log("Audio loaded and playing.");
        this.playSound();

        // Add a 1-second delay for background sound function
        setTimeout(() => this.sound_bckg(), 1000);
      },
      undefined,
      (err) => {
        console.error("Error loading audio file:", err);
      },
    );
  }

  // Method to play the sound
  playSound() {
    this.sound.play();
  }

  // Method to handle background sound logic
  sound_bckg() {
    console.log("Background sound logic");

    // Check if the AudioContext is suspended and resume if necessary
    if (THREE.AudioContext.getContext().state === "suspended") {
      THREE.AudioContext.getContext()
        .resume()
        .then(() => {
          this.playSound(); // Play sound after resuming
        });
    } else {
      this.playSound(); // Play sound if AudioContext is active
    }
  }
}

