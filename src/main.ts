import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import donut from './assets/donut.glb?url';
// import fork from './assets/fork.glb?url';
// import moon from './assets/moon.jpg';
// import normal from './assets/normal.jpg'
import alex from './assets/alex.jpg';
import romania from './assets/romania.png';
import space from './assets/space.jpg';

const ASPECT_RATIO  = window.innerWidth / window.innerHeight
const FOV = 75
const LIGHT_COLOR = 0xffffff

const scene =  new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, 0.1, 1000)

let loadedFork: THREE.Group;

const renderer  = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg') as HTMLCanvasElement
})

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render( scene, camera )


const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )

// Textures
const alexTexture = new THREE.TextureLoader().load(alex);
const romaniaTexture = new THREE.TextureLoader().load(romania);
const spaceTexture = new THREE.TextureLoader().load(space);


// DONUT MATERIAL
const material = new THREE.MeshStandardMaterial( { map: romaniaTexture, side: THREE.DoubleSide })

// torus mesh
const torus = new THREE.Mesh( geometry, material)
scene.add(torus)

// lights
const pointLight = new THREE.PointLight(LIGHT_COLOR)
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(LIGHT_COLOR)
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLight(pointLight as any);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  // const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  // const material = new THREE.MeshStandardMaterial({ color: LIGHT_COLOR });
  // const star = new THREE.Mesh( geometry, material);

  const [x ,y ,z] = Array(3).fill(undefined).map(() => THREE.MathUtils.randFloatSpread(100))
  if (loadedFork) {
    loadedFork.position.set(x,y,z);
    scene.add(loadedFork)
  }
  
}

Array(200).fill(undefined).forEach(addStar);

scene.background = spaceTexture;
// rendering
function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();
  renderer.render( scene, camera );
}


// Avatar

const alexMesh = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: alexTexture })
)

scene.add(alexMesh);

// Moon
// const moonTexture = new THREE.TextureLoader().load(moon);
// const normalTexture = new THREE.TextureLoader().load(normal);

// const moonMesh = new THREE.Mesh(
//   new THREE.SphereGeometry(3, 32, 32),
//   new THREE.MeshStandardMaterial({
//     map: moonTexture,
//     normalMap: normalTexture
//   })
// )

// scene.add(moonMesh);

// Alex's Donut
const loader = new GLTFLoader();

loader.load(donut, ( gltf ) => {
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
});

// loader.load(fork, ( gltf ) => {
// 	loadedFork = gltf.scene
// }, undefined, function ( error ) {
// 	console.error( error );
// });

animate();
