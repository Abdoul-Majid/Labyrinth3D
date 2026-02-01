import * as THREE from 'three';

var scene, camera, renderer;
var width = 740;
var height = 500;

const initScene = function() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    const container = document.getElementById("play-zone");
    if (container) {
        container.appendChild(renderer.domElement);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

const setupEvents = function() {
    initScene();
}

window.addEventListener("load", setupEvents);