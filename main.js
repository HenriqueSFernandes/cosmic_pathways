import * as THREE from "three";
import AudioHandler from "./controllers/sound_class.js"; // Import your AudioHandler

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Instantiate the AudioHandler
const audioHandler = new AudioHandler(camera, "../sound/galaxy_2.mp3");

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// // Example of using setTimeout to change window location
// setTimeout(() => {
//     window.location.href = "https://example.com"; // Ensure correct property name
// }, 5000); // Change to your desired URL and time
