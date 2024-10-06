import * as THREE from "three";

export function createPlanet(
	radius,
	widthSegments,
	heightSegments,
	texturePath,
	position = { x: 0, y: 0, z: 0 },
) {
	const geometry = new THREE.SphereGeometry(
		radius,
		widthSegments,
		heightSegments,
	);
	const loader = new THREE.TextureLoader();
	const texture = loader.load(texturePath);
	let material;
	if (texturePath == "./assets/textures/sun_texture.jpg") {
		material = new THREE.MeshStandardMaterial({
			map: texture,
			emissiveMap: texture,
			emissive: new THREE.Color(0xffff00),
			emissiveIntensity: 1.7,
		});
	} else {
		material = new THREE.MeshStandardMaterial({ map: texture });
	}
	const sphere = new THREE.Mesh(geometry, material);
	sphere.position.set(position.x, position.y, position.z);
	return sphere;
}

export function createOrbit(radius) {
	const material = new THREE.LineBasicMaterial({ color: 0x989898 });
	const ellipse = new THREE.EllipseCurve(0, 0, radius, radius);
	const points = ellipse.getPoints(200);
	const geometry = new THREE.BufferGeometry().setFromPoints(points);
	const orbit = new THREE.Line(geometry, material);
	orbit.rotation.x = Math.PI / 2;
	return orbit;
}
