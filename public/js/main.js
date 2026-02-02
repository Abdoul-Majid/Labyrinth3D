import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var scene, camera, renderer, controls;
var width = 740;
var height = 500;

const initScene = function() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 8, 12);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    document.getElementById("play-zone").appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(10, 10, 10);
    scene.add(sunLight);

    const textureLoader = new THREE.TextureLoader();
    const exrLoader = new EXRLoader();

    const planeSize = 40; 
    const textureRealScale = 2; 
    const idealRepeat = planeSize / textureRealScale; 

    const diffuseMap = textureLoader.load('/images/parquet/diagonal_parquet_diff_1k.jpg', (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(idealRepeat, idealRepeat);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.colorSpace = THREE.SRGBColorSpace;
    });

    const aoMap = textureLoader.load('/images/parquet/diagonal_parquet_ao_1k.jpg', (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(idealRepeat, idealRepeat);
        tex.colorSpace = THREE.LinearSRGBColorSpace;
    });

    const material = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        aoMap: aoMap,
        aoMapIntensity: 1.0,
        roughness: 1.0,
        metalness: 0.0
    });

    exrLoader.load('/images/parquet/diagonal_parquet_nor_gl_1k.exr', function(tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(idealRepeat, idealRepeat);
        tex.colorSpace = THREE.LinearSRGBColorSpace;
        material.normalMap = tex;
        material.normalScale = new THREE.Vector2(1, 1);
        material.needsUpdate = true;
    });

    exrLoader.load('/images/parquet/diagonal_parquet_rough_1k.exr', function(tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(idealRepeat, idealRepeat);
        tex.colorSpace = THREE.LinearSRGBColorSpace;
        material.roughnessMap = tex;
        material.needsUpdate = true;
    });

    const groundGeometry = new THREE.PlaneGeometry(planeSize, planeSize, 200, 200);
    const groundMesh = new THREE.Mesh(groundGeometry, material);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.geometry.setAttribute('uv2', groundMesh.geometry.attributes.uv);
    scene.add(groundMesh);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

const setupEvents = function() {
    initScene();
}

window.addEventListener("load", setupEvents);