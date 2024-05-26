import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
    const background = new THREE.TextureLoader().load( './assets/backiee-200404-landscape.jpg',
        () => { background.minFilter = THREE.LinearFilter; scene.background = background; requestRender(); });
    renderer.gammaFactor = 2.2;
    
    game = new Game(renderer, scene, camera);

    scene.scale.set(game.boardScale, game.boardScale, game.boardScale);

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
        } else if (event.key === 'Escape') {
            game.stop();
        }
    });
}

function build(){
    // Lights
    let lightAmbient = new THREE.AmbientLight( 0xFF5733, 1 );
    scene.add( lightAmbient );

    const light = new THREE.DirectionalLight( 0xAAA8CC, 5 );
    light.position.set( - 1, 2, 4 );
    scene.add( light );

    // Backgrround 

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

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('titleScreen').style.visibility = 'hidden';
    setTimeout(() => {game.start(document.getElementById('name').value)}, 500);
});

document.getElementById('boardSize').addEventListener('input', () => {
    game.boardSize = document.getElementById('boardSize').value;
    document.getElementById('boardSize_value').innerHTML = game.boardSize;
    game.createBoard();
    game.snake.createSnake(game.boardSize);
    scene.scale.set(game.boardScale, game.boardScale, game.boardScale);
    scene.add( game.gameGroup );
    requestRender();
});

document.getElementById('snakeUpdateTime').addEventListener('input', () => {
    game.snakeUpdateTime = document.getElementById('snakeUpdateTime').value;
    document.getElementById('snakeUpdateTime_value').innerHTML = game.snakeUpdateTime;
});

document.getElementById('leaderboardButton').addEventListener('click', () => {
    document.getElementById('leaderboardScreen').style.visibility = 'visible';
});

document.getElementById('closeLeaderboardButton').addEventListener('click', () => {
    document.getElementById('leaderboardScreen').style.visibility = 'hidden';
});