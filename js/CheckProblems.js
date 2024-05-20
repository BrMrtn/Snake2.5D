import WebGL from 'three/addons/capabilities/WebGL.js';

function CheckIfWebGLAvaible(canvas){
    if(!canvas) console.log('Canvas not found!');
    if (!WebGL.isWebGLAvailable()) {
        let warning = WebGL.getWebGLErrorMessage();
        document.getElementById('canvas').appendChild( warning );
    }
}

export {CheckIfWebGLAvaible};