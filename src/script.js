import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
var THREE = window.THREE = require('three');
require('three/examples/js/loaders/GLTFLoader');
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import * as dat from 'dat.gui'

// Debug
var gui = new dat.GUI()

// Canvas
var canvas = document.querySelector('canvas.webgl')

// Scene
var scene = new THREE.Scene()

// Objects
var geometry = new THREE.SphereGeometry( 1, 32, 32 );

// Materials
var loader3 = new THREE.TextureLoader().load('/textures/Earth.jpg');
var material = new THREE.MeshBasicMaterial( {map:loader3} );
// load a resource
var sphere = new THREE.Mesh(geometry, material);

//Satellite
/*
var gltfLoader = new THREE.GLTFLoader();
function loadAsset(path) {
  return new Promise(resolve => {
    gltfLoader.load(path, result => {
           console.log('Success');
            resolve(result);
        });
  });
}

var singleGeometry, material, mesh;

Promise.all([
  loadAsset('textures/hull.gltf'),
  loadAsset('textures/SXC-SSS-03_1663093610.gltf'),
])
  .then(geometries => {
	console.log(geometries);
    //geometries.forEach(geometry => geometry);
    // singleGeometry = new THREE.BufferGeometryUtils;
    //singleGeometry = new THREE.BufferGeometry()
	singleGeometry = new THREE.BufferGeometry();
    singleGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false)
	
    material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    mesh = new THREE.Mesh(singleGeometry, material);
    scene.add(mesh);
  })
  .catch(err => {console.error(err);});*/

var sat1, sat2, singleGeometry, material, mesh;
const group = new THREE.Group();

let loader2 = new THREE.GLTFLoader()
loader2.load('/textures/hull.gltf', function (gltf){
    var satellite = gltf.scene.children[0]
    satellite.scale.set(0.0006, 0.0006, 0.0006)
    satellite.position.x = 0
    satellite.position.y = 0
    satellite.position.z = 0
	
    group.add(gltf.scene)
})
loader2.load('/textures/SXC-SSS-03_1663093610.gltf', function (gltf){
    var satellite = gltf.scene.children[0]
    satellite.scale.set(0.0006, 0.0006, 0.0006)
    satellite.position.x = 0.03
    satellite.position.y = -0.03
    satellite.position.z = 0
	sat2 = gltf.scene
	
	//sat2.parent = sat1
    group.add(sat2)
})
scene.add(group)

scene.add(sphere);

// Lights

var pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

var pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.x = -2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
var sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
var camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
var renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

var clock = new THREE.Clock()

sphere.position.x = 0
sphere.position.y = 0
sphere.position.z = 0

var tick = () =>
{
    var elapsedTime = clock.getElapsedTime()
	
	if (group) {
		let delta = elapsedTime
        let angularSpeed = THREE.Math.degToRad(2);
        let angle = -angularSpeed * delta;
        group.rotation.y = .05 * elapsedTime;
        group.position.x = Math.cos(angle) * 1.5;
        group.position.z = Math.sin(angle) * 1.5;
	};
    // Update objects
    sphere.rotation.y = .05 * elapsedTime
    /*if(scene.children[4]) {
        let delta = elapsedTime
        let angularSpeed = THREE.Math.degToRad(2);
        let angle = -angularSpeed * delta;
        scene.children[4].children[0].rotation.y = .05 * elapsedTime;
        scene.children[4].children[0].position.x = Math.cos(angle) * 1.5;
        scene.children[4].children[0].position.z = Math.sin(angle) * 1.5;

    }
	if(scene.children[5]) {
        let delta = elapsedTime
        let angularSpeed = THREE.Math.degToRad(2);
        let angle = -angularSpeed * delta;
        scene.children[5].children[0].rotation.y = .05 * elapsedTime;
        scene.children[5].children[0].position.x = Math.cos(angle) * 1.5;
        scene.children[5].children[0].position.z = Math.sin(angle) * 1.5;

    }*/

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
