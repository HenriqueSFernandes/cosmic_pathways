import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as planetController from "./controllers/planetController.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

// Scene, camera, renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100000000000,
);
camera.position.set(0, 15000000, 150000000);

const renderer = new THREE.WebGLRenderer();
renderer.sortObjects = false;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0, 0, 0);
// controls.autoRotate = 1;
controls.update();

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	0.3, // Strength of the bloom
	0.2, // Bloom radius
	0.85, // Threshold
);
composer.addPass(bloomPass);

// const rgbeLoader = new RGBELoader();
// rgbeLoader.load("./assets/hdr/sky.hdr", function(texture) {
// 	texture.mapping = THREE.EquirectangularReflectionMapping; // Set the mapping type for the environment
//
// 	scene.background = texture; // Set the HDR as background
// 	scene.environment = texture; // Set the HDR for reflections/environment lighting
// });

const AU = 15000000;
const sun = planetController.createPlanet(
	6963400,
	64,
	32,
	"./assets/textures/sun_texture.jpg",
);

const mercury = planetController.createPlanet(
	243900,
	64,
	32,
	"./assets/textures/mercury_texture.jpg",
	{ x: 0.39 * AU + 10000000, y: 0, z: 0 },
);

const venus = planetController.createPlanet(
	605100,
	64,
	32,
	"./assets/textures/venus_texture.jpg",
	{ x: 0.72 * AU + 10000000, y: 0, z: 0 },
);

const earth = planetController.createPlanet(
	637100,
	64,
	32,
	"./assets/textures/earth_texture.jpg",
	{ x: AU + 10000000, y: 0, z: 0 },
);

const mars = planetController.createPlanet(
	338900,
	64,
	32,
	"./assets/textures/mars_texture.jpg",
	{ x: 1.52 * AU + 10000000, y: 0, z: 0 },
);

const jupiter = planetController.createPlanet(
	2800000,
	64,
	32,
	"./assets/textures/jupiter_texture.jpg",
	{ x: 4.3 * AU + 10000000, y: 0, z: 0 },
);

const saturn = planetController.createPlanet(
	2400000,
	64,
	32,
	"./assets/textures/saturn_texture.jpg",
	{ x: 6 * AU + 10000000, y: 0, z: 0 },
);

const uranus = planetController.createPlanet(
	1000000,
	64,
	32,
	"./assets/textures/uranus_texture.jpg",
	{ x: 8.72 * AU, y: 0, z: 0 },
);

const neptune = planetController.createPlanet(
	1000000,
	64,
	32,
	"./assets/textures/neptune_texture.jpg",
	{ x: 11 * AU, y: 0, z: 0 },
);

const planets = [
	sun,
	mercury,
	venus,
	earth,
	mars,
	jupiter,
	saturn,
	uranus,
	neptune,
];

const orbits = [
	planetController.createOrbit(0.39 * AU + 10000000),
	planetController.createOrbit(0.72 * AU + 10000000),
	planetController.createOrbit(AU + 10000000),
	planetController.createOrbit(1.52 * AU + 10000000),
	planetController.createOrbit(4.3 * AU + 10000000),
	planetController.createOrbit(6 * AU + 10000000),
	planetController.createOrbit(8.72 * AU),
	planetController.createOrbit(11 * AU),
];

const rotationSpeeds = {
	mercury: 0.02,
	venus: 0.01,
	earth: 0.01,
	mars: 0.008,
	jupiter: 0.003,
	saturn: 0.0025,
	uranus: 0.0015,
	neptune: 0.0012,
};

const angles = {
	mercury: 0,
	venus: 0,
	earth: 0,
	mars: 0,
	jupiter: 0,
	saturn: 0,
	uranus: 0,
	neptune: 0,
};

orbits.forEach((orbit) => {
	return scene.add(orbit);
});

planets.forEach((planet) => {
	return scene.add(planet);
});

window.addEventListener("resize", () => {
	const w = window.innerWidth;
	const h = window.innerHeight;
	renderer.setSize(w, h);
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
});

const sunLight = new THREE.PointLight(0xffffff, 1e16, 1e200); // Adjust intensity and distance as needed
sunLight.position.set(0, 0, 0); // Place the light at the sun's position
scene.add(sunLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Color, intensity
scene.add(ambientLight);

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
        const firstIntersected = intersects[0].object;

        if (intersectedObject !== firstIntersected) {
            // Mouse just entered a new object
            if (intersectedObject) {
                // Reset the color or material of the previously intersected object
                if (intersectedObject.originalMaterial) {
                    intersectedObject.material = intersectedObject.originalMaterial;  // Restore original material
                } else if (intersectedObject.originalColor) {
                    intersectedObject.material.color.set(intersectedObject.originalColor);  // Restore original color
                }
                console.log("Mouse left the object:", intersectedObject);
            }

            // Store the original material or color if it's the first time being hovered
            if (!firstIntersected.originalMaterial && firstIntersected.material) {
                if (firstIntersected.material.map) {
                    // If it has a texture, store the original material
                    firstIntersected.originalMaterial = firstIntersected.material.clone(); // Store original material
                } else {
                    // If it's color-based, store the original color
                    firstIntersected.originalColor = firstIntersected.material.color.clone();
                }
            }

            // Clone the material before modifying it, so we don't permanently change it
            if (firstIntersected.material.map) {
                firstIntersected.material = firstIntersected.originalMaterial.clone(); // Clone before modifying
            }

            // Highlight the new intersected object by changing its color
            if (firstIntersected.material.color) {
                firstIntersected.material.color.set(0xffff00);  // Set to yellow
            }
            intersectedObject = firstIntersected;
            console.log("Mouse entered:", firstIntersected);
        }
    } else {
        if (intersectedObject) {
            // Mouse left the current object, reset to original material or color
            if (intersectedObject.originalMaterial) {
                intersectedObject.material = intersectedObject.originalMaterial;  // Restore original material
            } else if (intersectedObject.originalColor) {
                intersectedObject.material.color.set(intersectedObject.originalColor);  // Restore original color
            }
            console.log("Mouse left the object:", intersectedObject);
            intersectedObject = null;  // No object is intersected now
        }
    }
}


function add_star(){
  const geometry = new THREE.SphereGeometry(100000, 100, 100); // Adjust the size of the star if needed
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);
  
  // Place stars further out by increasing the random spread
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500000000)); // Increase spread to 500,000,000

  // Optionally, scale the stars to make them more visible
  star.scale.set(5, 5, 5); // Increase the scale to make stars larger

  // Set the star's position in 3D space
  star.position.set(x, y, z);

  // Add the star to the scene
  scene.add(star);
}

// Generate more stars with the new settings
Array(200).fill().forEach(add_star);

Array(200).fill().forEach(add_star);

function animate() {
	requestAnimationFrame(animate);
	angles.mercury += rotationSpeeds.mercury;
	angles.venus += rotationSpeeds.venus;
	angles.earth += rotationSpeeds.earth;
	angles.mars += rotationSpeeds.mars;
	angles.jupiter += rotationSpeeds.jupiter;
	angles.saturn += rotationSpeeds.saturn;
	angles.uranus += rotationSpeeds.uranus;
	angles.neptune += rotationSpeeds.neptune;

	mercury.position.x = Math.cos(angles.mercury) * (0.39 * AU + 10000000);
	mercury.position.z = Math.sin(angles.mercury) * (0.39 * AU + 10000000);

	venus.position.x = Math.cos(angles.venus) * (0.72 * AU + 10000000);
	venus.position.z = Math.sin(angles.venus) * (0.72 * AU + 10000000);

	earth.position.x = Math.cos(angles.earth) * (AU + 10000000);
	earth.position.z = Math.sin(angles.earth) * (AU + 10000000);

	mars.position.x = Math.cos(angles.mars) * (1.52 * AU + 10000000);
	mars.position.z = Math.sin(angles.mars) * (1.52 * AU + 10000000);

	jupiter.position.x = Math.cos(angles.jupiter) * (4.3 * AU + 10000000);
	jupiter.position.z = Math.sin(angles.jupiter) * (4.3 * AU + 10000000);

	saturn.position.x = Math.cos(angles.saturn) * (6 * AU + 10000000);
	saturn.position.z = Math.sin(angles.saturn) * (6 * AU + 10000000);

	uranus.position.x = Math.cos(angles.uranus) * (8.72 * AU);
	uranus.position.z = Math.sin(angles.uranus) * (8.72 * AU);

	neptune.position.x = Math.cos(angles.neptune) * (11 * AU);
	neptune.position.z = Math.sin(angles.neptune) * (11 * AU);
	controls.update();
	renderer.render(scene, camera);
	composer.render();
}

animate();
