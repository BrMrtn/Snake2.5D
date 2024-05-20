export default class Snake {
    position;
    velocity;

    constructor() {
        this.position = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
    }

    sayHi() {
        console.log("Hi");
    }
}