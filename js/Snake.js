import * as THREE from 'three';

export default class Snake {
    constructor(game) {
        this.game = game;
        this.headPosition = {x: 0, y: 0};
        this.velocity = {x: 1, y: 0};
        this.isVelocityChangeable = true;
        this.startLength = 3;
        this.clock = new THREE.Clock();

        this.group = new THREE.Group();
        this.size = 0.8; this.changedSize = 0.95; this.tailSize = 0.65;
        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size); //Maybe ExtrudeGeometry
        this.material = new THREE.MeshNormalMaterial();
        this.snakePartSample = new THREE.Mesh(this.geometry, this.material);

        this.tailGeometry = new THREE.BoxGeometry(this.tailSize, this.tailSize, this.tailSize);

        // For changing the size of the bodypart when a food was eaten
        this.changedGeometry = new THREE.BoxGeometry(this.changedSize, this.changedSize, this.changedSize);
    }

    createSnake(boardSize){
        this.group.clear();
        for(let i = 0; i < this.startLength; i++) {
            let snakePart = this.snakePartSample.clone();
            snakePart.position.set(Math.floor(boardSize/2)-i, Math.floor(boardSize/2), 0);
            this.group.add(snakePart);
        }
        this.group.children[this.startLength-1].geometry = this.tailGeometry;
    }

    move() {
        let oldTail = this.group.children[this.group.children.length - 1];

        // Move snake
        for(let i = this.group.children.length - 1; i > 0; i--) {
            this.group.children[i].position.copy(this.group.children[i-1].position);
            
            //Change bodypart size when a food was eaten
            if(this.group.children[i-1].geometry.parameters.height != this.size) {
                this.group.children[i].geometry = this.changedGeometry;
                this.group.children[i-1].geometry = this.geometry;
            }
        }
        this.group.children[this.group.children.length-1].geometry = this.tailGeometry;
        
        let head = this.group.children[0];

        let currentVelocity = this.velocity; // To prevent the snake from changing direction multiple times in one frame
        let startPosition = head.position.clone();
        let endPosition = new THREE.Vector3(startPosition.x + currentVelocity.x, startPosition.y + currentVelocity.y, 0);
        /*Possibly animate movement here*/

        head.position.copy(endPosition); // place the head where it should be - in case of floating point errors
        
        // Check if the head is out of bounds
        if(head.position.x < 0)
            head.position.x = this.game.boardSize - 1;
        if(head.position.x >= this.game.boardSize)
            head.position.x = 0;
        if(head.position.y < 0)
            head.position.y = this.game.boardSize - 1;
        if(head.position.y >= this.game.boardSize)
            head.position.y = 0;

        // Check collision with body
        for(let i = 1; i < this.group.children.length; i++) {
            if(this.group.children[i].position.equals(head.position)) {
                this.game.stop();
            }
        }

        // Check collision with barriers
        for(let barrier of this.game.barrierGroup.children) {
            if(barrier.position.equals(head.position)) {
                this.game.stop();
            }
        }

        // Grow and spawn new food if one is eaten
        for(let food of this.game.foodGroup.children) {
            if(food.position.equals(head.position)) {
                this.game.foodGroup.remove(food);
                let newTail = oldTail.clone();
                this.group.add(newTail);
                this.game.playerFoodScore++;
                head.geometry = this.changedGeometry;
                this.game.spawnFood();
            }
        }

        this.isVelocityChangeable = true;
    }

    changeVelocity(x, y) {
        if(this.isVelocityChangeable){ // Prevent changing the direction multiple times in one frame
            if(this.velocity.x != -x && this.velocity.y != -y) {
                this.velocity = {x, y};
            }
        }
        this.isVelocityChangeable = false;
    }
}