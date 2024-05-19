function CheckIfWebGLAvaible(canvas){
    if(!canvas) console.log('Canvas not found!');
    if (!WebGL.isWebGLAvailable()) {
        let warning = WebGL.getWebGLErrorMessage();
        document.getElementById('canvas').appendChild( warning );
    }
}

export default CheckIfWebGLAvaible;