import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as planetController from "./controllers/planetController.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100000000000,
);
camera.position.set(0, 15000000, 150000000);
for (let i = 1; i <= 10; i++) {
	camera.layers.enable(i);
}

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
	orbit.layers.set(1);
	return scene.add(orbit);
});

let order = 2;
planets.forEach((planet) => {
	planet.layers.set(order);
	order++;
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
const lightHelper = new THREE.PointLightHelper(sunLight, 1000000);
scene.add(lightHelper);

function animate() {
	requestAnimationFrame(animate);
	// angles.mercury += rotationSpeeds.mercury;
	// angles.venus += rotationSpeeds.venus;
	// angles.earth += rotationSpeeds.earth;
	// angles.mars += rotationSpeeds.mars;
	// angles.jupiter += rotationSpeeds.jupiter;
	// angles.saturn += rotationSpeeds.saturn;
	// angles.uranus += rotationSpeeds.uranus;
	// angles.neptune += rotationSpeeds.neptune;

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
}

animate();
