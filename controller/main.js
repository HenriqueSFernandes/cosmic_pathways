import * as THREE from "three";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1.0,
  100,
);

camera.position.z = 15;
camera.position.y = 3;
camera.position.x = 8;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer);

const geometry = new THREE.TorusGeometry();
const mesh = new THREE.MeshStandardMaterial();

const torus = new THREE.Mesh(geometry,mesh)

scene.add(torus);

renderer.render(scene,camera);
