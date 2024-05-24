import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//import * as Test from './Test.js';
//import Snake from './snake.js';	

import { CheckIfWebGLAvaible } from './CheckProblems.js';
import Game from './Game.js';

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
let canvas = null;
let renderer = null;
let camera = null;
let scene = null;
let controls = null;
let gui = null;

let renderRequested = false;
let game = null;

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
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

	scene = new THREE.Scene();

    game = new Game(renderer, scene, camera);

    scene.scale.set(game.boardScale, game.boardScale, game.boardScale);

    // Initialize GUI
    gui = new GUI();

    let gameSettings = gui.addFolder( 'Game Setings' );
    gameSettings.add( game, 'boardSize', 4, 30 )
        .step( 1 )
        .onChange(() => {
            game.createBoard();
            game.snake.createSnake(game.boardSize);
            scene.scale.set(game.boardScale, game.boardScale, game.boardScale);
            requestRender(); });
    gameSettings.add( game, 'snakeUpdateTime', 50, 500 )
        .step(10);
    gameSettings.open();

    window.addEventListener( 'resize', requestRender );
    window.addEventListener( 'keydown', (event) => {
        if (event.key === 'ArrowUp') {
            game.snake.changeVelocity(0, 1);
        } else if (event.key === 'ArrowDown') {
            game.snake.changeVelocity(0, -1);
        } else if (event.key === 'ArrowLeft') {
            game.snake.changeVelocity(-1, 0);
        } else if (event.key === 'ArrowRight') {
            game.snake.changeVelocity(1, 0);
        } else if (event.key === ' ') {
            game.start();
        } else if (event.key === 'Escape') {
            game.stop();
        }
    });
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

    // Game board
    game.createBoard();
    scene.add( game.gameGroup );

}

function render() {
    renderRequested = false;
    if ( resizeRendererToDisplaySize( renderer ) ) {
        canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    controls.update();
    renderer.render( scene, camera );
}

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

function main() {
	init();
    build();
	render();
}

main();

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

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


