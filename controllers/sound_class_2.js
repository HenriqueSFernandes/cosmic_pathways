import * as THREE from "three";

export default class AudiHandler {
  constructor(camera, audioFilePath, volume = 0.9, loop = true) {
    this.audioListener = new THREE.AudioListener();

    this.sound = new THREE.Audio(this.audioListener);
    this.audioLoader = new THREE.AudioLoader();
    console.log(this.audioLoader);

    //handling inputs
    this.audioFilePath = audioFilePath;
    this.loop = loop;
    this.volume = volume;
    camera.add(this.audioListener);
  }

  loadAudio() {
    console.log(this.audioLoader);
    this.audioLoader.load(
      this.audioFilePath,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(this.loop);
        this.sound.setVolume(this.volume);

        this.sound_bckg();
        console.log("Audio loaded and playing.");
      },
      undefined,
      (err) => {
        console.log("Error loading audio file", err);
      },
    );
  }

  sound_bckg() {
    console.log("Background sound logic");

    // Check if the AudioContext is suspended and resume if necessary
    if (THREE.AudioContext.getContext().state === "suspended") {
      THREE.AudioContext.getContext()
        .resume()
        .then(() => {
          this.sound.play(); // Play sound after resuming
        });

    } else {
      this.sound.play(); // Play sound after resuming
    }
  }
}
