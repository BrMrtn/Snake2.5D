import * as THREE from 'three';

export default class Snake {
    constructor(game) {
        this.game = game;
        this.headPosition = {x: 0, y: 0};
        this.velocity = {x: 1, y: 0};
        this.startLength = 3;

        this.group = new THREE.Group();
        this.size = 0.8; this.changedSize = 0.95;
        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size); //Maybe ExtrudeGeometry
        this.material = new THREE.MeshNormalMaterial();
        this.snakePartSample = new THREE.Mesh(this.geometry, this.material);

        // For changing the size of the bodypart when a food was eaten
        this.changedGeometry = new THREE.BoxGeometry(this.changedSize, this.changedSize, this.changedSize);
    }

    createSnake(boardSize){
        this.group.clear();
        for(let i = 0; i < this.startLength; i++) {
            let snakePart = this.snakePartSample.clone();
            snakePart.position.set(Math.floor(boardSize/2)-i-1, Math.floor(boardSize/2), 0);
            this.group.add(snakePart);
        }
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
        this.group.children[this.group.children.length-1].geometry = this.geometry; 
        
        let head = this.group.children[0];
        head.position.x += this.velocity.x;
        head.position.y += this.velocity.y;
        
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

        // Grow and spawn new food if one is eaten
        for(let food of this.game.foodGroup.children) {
            if(food.position.equals(head.position)) {
                this.game.foodGroup.remove(food);
                let newTail = oldTail.clone();
                this.group.add(newTail);
                head.geometry = this.changedGeometry;
                this.game.spawnFood();
            }
            // Check if the food is on the snake. If so, delete it and spawn a new food.
            for (let j = 1; j < this.group.children.length; j++) {
                if(this.game.foodGroup.children[0].position.equals(this.group.children[j].position)) {
                    this.game.foodGroup.remove(this.game.foodGroup.children[0]);
                    this.game.spawnFood();
                }
            }
        }
    }

    changeVelocity(x, y) {
        if(this.velocity.x != -x && this.velocity.y != -y) {
            this.velocity = {x, y};
        }
    }
}