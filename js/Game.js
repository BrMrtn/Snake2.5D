import * as THREE from 'three';

export default class Game {
    constructor() {
        //Game constants
        this.boardSize = 10;
        this.boardScale = 2;
        this.gameSpeed = 1;
        this.snakeStartLength = 6;

        //Groups
        this.boardGroup = new THREE.Group();
        this.snakeGroup = new THREE.Group();
        this.foodGroup = new THREE.Group();

        this.gameGroup = new THREE.Group();
        this.gameGroup.add(this.boardGroup);
        this.gameGroup.add(this.snakeGroup);
        this.gameGroup.add(this.foodGroup);
    }

    createBoard() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                let geometry = new THREE.BoxGeometry(1, 1, 1);
                let material = new THREE.MeshNormalMaterial({wireframe: true});
                let cube = new THREE.Mesh(geometry, material);

                //cube.position.set(i*this.boardScale, j*this.boardScale, 0);
                this.boardGroup.add(cube);
            }
        }
    }


}