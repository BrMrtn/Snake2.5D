import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//import * as Test from './Test.js';
//import Snake from './snake.js';	

import { CheckIfWebGLAvaible } from './CheckProblems.js';

let canvas = null;
let renderer = null;
let camera = null;
let scene = null;
let controls = null;
let gui = null;

let renderRequested = false;

function makeCube(color, x ) {
    const material = new THREE.MeshPhongMaterial( { color } );
    let geometry = new THREE.BoxGeometry( 1, 1, 1 );

    let cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    cube.position.x = x;

    const folder = gui.addFolder( `Cube${x}` );
    folder.add( cube.scale, 'x', .1, 1.5 )
    	.name( 'scale x' )
    	.onChange( requestRender );
    folder.open();

    return cube;
}

function init(){
    canvas = document.querySelector( '#canvas' );
    CheckIfWebGLAvaible(canvas);

    renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	camera.position.z = 4;

    controls = new OrbitControls( camera, canvas );
	controls.enableDamping = true;
	controls.target.set( 0, 0, 0 );
    controls.addEventListener( 'change', requestRender );

	gui = new GUI();

	scene = new THREE.Scene();

    window.addEventListener( 'resize', requestRender );
}

function build(){
    // Ambient light
    let color = 0xFF5733;
    let intensity = 1;
    let lightAmbient = new THREE.AmbientLight( color, intensity );
    scene.add( lightAmbient );

    // Directional light
    color = 0x00A8CC;
    intensity = 3;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 1, 2, 4 );
    scene.add( light );

    makeCube(0x44aa88, 0 );
	makeCube(0x8844aa, - 2 );
	makeCube(0xaa8844, 2 );
}

function render() {
    renderRequested = undefined;
    if ( resizeRendererToDisplaySize( renderer ) ) {
        canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    controls.update();
    renderer.render( scene, camera );
}

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

function main() {
	init();
    build();
	render();
}

main();

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

function resizeRendererToDisplaySize(renderer) {
    canvas = renderer.domElement;
    let needResize = canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight;
    if ( needResize )
        renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );
    return needResize;
}

function requestRender() {
    if ( ! renderRequested ) {
        renderRequested = true;
        requestAnimationFrame( render );
    }
}


