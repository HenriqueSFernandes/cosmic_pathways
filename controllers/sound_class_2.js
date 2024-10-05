import * as THREE from "three";

export default class AudioHandler {
  contructor(camera, audioFilePath,  volume =  0.9, loop = true) {
    this.audioListener = new THREE.AudioListener();
    
    this.sound = new THREE.Audio(this.audioListener);
    this.audioLoader = new THREE.AudioLoader();
    
    //handling inputs
    this.audioFilePath = audioFilePath;
    this.loop = loop;
    this.volume = volume;
    camera.add(this.audioListener);
  }

  loadAudio(){
    this.audioLoader.load(
      this.audioFilePath,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(this.loop);
        this.sound.setVolume(this.volume);

         
      },
      undefined,
      (err) => {
        console.log("Error loading audio file", err);
      }
    )
  }


  
}
