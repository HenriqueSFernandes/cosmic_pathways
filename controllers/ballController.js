import * as THREE from "three";
import cosmologyObjects from "./../scraper/data/cosmology_objects.json";
import exoplanetsObjects from "./../scraper/data/exoplanets_objects.json";
import galaxiesObjects from "./../scraper/data/galaxies_objects.json";
import nebulasObjects from "./../scraper/data/nebulas_objects.json";
import solarSystemObjects from "./../scraper/data/solar_system_objects.json";
import starsObjects from "./../scraper/data/stars_objects.json";

export function createBalls() {
	const objects = [
		...cosmologyObjects,
		...exoplanetsObjects,
		...galaxiesObjects,
		...nebulasObjects,
		...solarSystemObjects,
		...starsObjects,
	];
	const balls = [];
	objects.forEach((object) => {
		const ball = createBall({
			ra: object.ra_position[0],
			dec: object.dec_position[0],
			dist: 3000000000,
		});
		balls.push(ball);
	});
	return balls;
}

function createBall(position = { ra: 0, dec: 0, dist: 10000000 }) {
	const geometry = new THREE.SphereGeometry(50000000, 64, 32);
	const material = new THREE.MeshBasicMaterial({ color: 0x5e80b8 });
	const sphere = new THREE.Mesh(geometry, material);
	console.log(position);
	const x = position.dist * Math.cos(position.ra) * Math.sin(position.dec);
	const y = position.dist * Math.sin(position.ra) * Math.sin(position.dec);
	const z = position.dist * Math.cos(position.dec);
	console.log("x:" + x + "y:" + y + "z:" + z);
	sphere.position.set(x, y, z);
	return sphere;
}
