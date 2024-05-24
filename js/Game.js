import * as THREE from 'three';
import Snake from './Snake.js';

export default class Game {

    /* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
    constructor(renderer, scene, camera) {
        //Changeable game constants
        this.boardSize = 10;
        this.snakeUpdateTime = 200; //milliseconds
        
        //Non-changeable game constants
        this.boardScale = 4/10;
        this.cubeSize = 1;
        this.moveIntervalID;
        this.foodIntervalID;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.started = false;

        //Snake
        this.snake = new Snake(this);
        this.snake.createSnake(this.boardSize);

        //Groups
        this.boardGroup = new THREE.Group();
        this.foodGroup = new THREE.Group();

        this.gameGroup = new THREE.Group();
        this.gameGroup.add(this.boardGroup);
        this.gameGroup.add(this.snake.group);
        this.gameGroup.add(this.foodGroup);
        this.gameGroup.position.set(-(this.boardSize-1) / 2, -(this.boardSize-1) / 2, 0);

        //Food
        this.foodGeometry = new THREE.BoxGeometry(this.snake.changedSize, this.snake.changedSize, this.snake.changedSize);
        this.foodMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
        this.foodSample = new THREE.Mesh(this.foodGeometry, this.foodMaterial);
    }

    createBoard() {
        this.boardGroup.clear();
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                let geometry = new THREE.BoxGeometry(1, 1, 1);
                let material = new THREE.MeshNormalMaterial({wireframe: true});
                let cube = new THREE.Mesh(geometry, material);
                cube.position.set(i, j, 0);
                this.boardGroup.add(cube);
            }
        }
        this.boardScale = 4/this.boardSize;
        this.gameGroup.position.set(-(this.boardSize-1) / 2, -(this.boardSize-1) / 2, 0);
    }

    spawnFood() {
        let food = this.foodSample.clone();
        let x = Math.floor(Math.random() * this.boardSize);
        let y = Math.floor(Math.random() * this.boardSize);
        food.position.set(x, y, 0);
        this.foodGroup.add(food);
    }

    /* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
    start() {
        if(this.started)
            return;
        this.started = true;
        this.spawnFood();
        this.moveIntervalID = setInterval(() => {
            this.snake.move();
            this.renderer.render( this.scene, this.camera );
        }, this.snakeUpdateTime);
    }

    stop() {
        this.foodGroup.clear();
        this.started = false;
        clearInterval(this.moveIntervalID);
        clearInterval(this.foodIntervalID);
    }
}