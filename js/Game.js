import * as THREE from 'three';

import Snake from './Snake.js';
import Leaderboard from './Leaderboard.js';

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
        this.barrierIntervalID;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.started = false;
        this.playerName;
        this.playerFoodScore = 0;

        //Leaderboard data
        this.leaderboard = new Leaderboard();
        this.leaderboard.readPlayers();
        this.updateLeaderboard();

        //Snake
        this.snake = new Snake(this);
        this.snake.createSnake(this.boardSize);

        //Groups
        this.boardGroup = new THREE.Group();
        this.foodGroup = new THREE.Group();
        this.barrierGroup = new THREE.Group();

        this.gameGroup = new THREE.Group();
        this.gameGroup.add(this.boardGroup);
        this.gameGroup.add(this.snake.group);
        this.gameGroup.add(this.foodGroup);
        this.gameGroup.add(this.barrierGroup);
        this.gameGroup.position.set(-(this.boardSize-1) / 2, -(this.boardSize-1) / 2, 0);

        //Food
        this.foodGeometry = new THREE.BoxGeometry(this.snake.changedSize, this.snake.changedSize, this.snake.changedSize);
        this.foodMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
        this.foodSample = new THREE.Mesh(this.foodGeometry, this.foodMaterial);

        //Barrier
        this.barrierMaterial = new THREE.MeshPhongMaterial({color: 0x202020});
        this.barrierSample = new THREE.Mesh(this.foodGeometry, this.barrierMaterial);
    }

    createBoard() {
        this.boardGroup.clear();
        /*for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                let geometry = new THREE.BoxGeometry(1, 1, 1);
                let wireframe = new THREE.EdgesGeometry(geometry);
                let edges = new THREE.LineSegments(wireframe);
                edges.material.opacity = 0.05;
                edges.material.transparent = true;
                edges.position.set(i, j, 0);
                this.boardGroup.add(edges);
            }
        }*/
        let geometry = new THREE.BoxGeometry(this.boardSize, this.boardSize, 1);
        let material = new THREE.LineBasicMaterial({color: 0xaa00ff});
        let wireframe = new THREE.EdgesGeometry(geometry);
        let boudingBox = new THREE.LineSegments(wireframe, material);
        boudingBox.position.set((this.boardSize-1) / 2, (this.boardSize-1) / 2, 0);
        this.boardGroup.add(boudingBox);

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

    spawnBarrier(depth) {
        if(depth > 10) return;
        let x = Math.floor(Math.random() * this.boardSize);
        let y = Math.floor(Math.random() * this.boardSize);

        for(let snakePart of this.snake.group.children) {
            if((x-snakePart.position.x) ** 2 + (y-snakePart.position.y) ** 2 < 16) {
                this.spawnBarrier(depth+1);
                return;
            }
        }

        let barrier = this.barrierSample.clone();
        let barrierBoxMaterial = new THREE.LineBasicMaterial({color: 0xaa00ff});
        let wireframe = new THREE.EdgesGeometry(this.foodGeometry);
        let boudingBox = new THREE.LineSegments(wireframe, barrierBoxMaterial);
        barrier.position.set(x, y, 0);
        boudingBox.position.set(x, y, 0);
        this.barrierGroup.add(barrier);
        this.barrierGroup.add(boudingBox);
    }

    /* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
    start(name) {
        if(this.started)
            return;
        this.started = true;
        this.spawnFood();
        this.moveIntervalID = setInterval(() => {
            this.snake.move();
            this.renderer.render( this.scene, this.camera );
        }, this.snakeUpdateTime);
        this.barrierIntervalID = setInterval(() => {
            this.spawnBarrier(0);
        }, 5000);
        this.playerName = name;
    }

    stop() {
        this.started = false;
        clearInterval(this.moveIntervalID);
        clearInterval(this.barrierIntervalID);

        setTimeout(() => {
            this.snake.group.clear();
            this.foodGroup.clear();
            this.barrierGroup.clear();
            document.getElementById('titleScreen').style.visibility = 'visible';
            this.snake = new Snake(this);
            this.snake.createSnake(this.boardSize);
            this.gameGroup.add(this.snake.group);
            this.createBoard();
            this.renderer.render( this.scene, this.camera );
        }, 1000);
        this.updateLeaderboard();
    }

    updateLeaderboard() {
        // Update leaderboard
        let updateTimeMultiplier = (500-this.snakeUpdateTime)/450 + 1;
        let boardSizeMultiplier = (30-this.boardSize)/25 + 1;
        let score = Math.floor(this.playerFoodScore * updateTimeMultiplier * boardSizeMultiplier);

        if(this.playerName) this.leaderboard.addPlayer({name: this.playerName, score: score});
            this.leaderboard.writePlayers();

        // Write leaderboard to HTML
        let leaderboardHTML = "";
        this.leaderboard.getPlayers().forEach((entry, idx) => {
            leaderboardHTML += `<tr><td>${idx+1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
        });
        document.getElementById('leaderboardTable').innerHTML = leaderboardHTML;
    }
}