
import * as THREE from "three";
import AudiHandler from "./controllers/sound_class_2.js";

// Scene, camera, renderer setup
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
const sound1 = new AudiHandler(camera, "../sound/galaxy_2.mp3");
window.addEventListener("click", () => {
  sound1.loadAudio();
  setTimeout(() => {
    window.location.href = "./views/solar.html";
  }, 5000);
});

// Add a rotating cube to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

// Variables to track intersection state
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedObject = null; // Store the currently hovered object

// Handle mouse movement
window.addEventListener("mousemove", onMouseMove, false);

function onMouseMove(event) {
  // Convert mouse coordinates to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the mouse position
  raycaster.setFromCamera(mouse, camera);

  // Get the list of intersected objects
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    // Get the first intersected object
    const firstIntersected = intersects[0].object;

    if (intersectedObject !== firstIntersected) {
      // Mouse just entered a new object
      if (intersectedObject) {
        // Reset the color of the previously intersected object
        intersectedObject.material.color.set(0x00ff00); // Reset to the original color
        console.log("Mouse left the object:", intersectedObject);
      }

      // Highlight the new intersected object
      firstIntersected.material.color.set(0xffff00); // Set color to yellow
      intersectedObject = firstIntersected; // Update the tracked intersected object
      console.log("Mouse entered:", firstIntersected);
    }
  } else {
    if (intersectedObject) {
      // Mouse left the current object
      intersectedObject.material.color.set(0x00ff00); // Reset the color to original
      console.log("Mouse left the object:", intersectedObject);
      intersectedObject = null; // No object is intersected now
    }
  }
}

// Animate the cube
function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// Start the animation loop
renderer.setAnimationLoop(animate);
