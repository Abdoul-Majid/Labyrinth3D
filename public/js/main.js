import * as THREE from 'three';
import { createBox, createCylinder, createCone, createTorus, createWall, createPillar } from './obstacles.js';

var scene, camera, renderer;
var width = 740;
var height = 500;

const BALL_RADIUS = 0.5;
const BALL_SPEED_Z = 10;
const BALL_SPEED_X = 6;
const SPAWN_DISTANCE = 35;
const SPAWN_INTERVAL = 2;
const LANE_WIDTH = 6;

const keys = { left: false, right: false };
let ball;
let obstacles = [];
let lastSpawnTime = 0;
let clock;

const chunkSize = 40;
const numChunks = 4;
let groundChunks = [];

const obstacleGenerators = [
    (pos) => createBox({ width: 2, height: 1.5, depth: 2, color: 0xcc3333, position: pos }),
    (pos) => createCylinder({ radius: 0.8, height: 3, color: 0x3366cc, position: pos }),
    (pos) => createCone({ radius: 1, height: 2.5, color: 0xff6600, position: pos }),
    (pos) => createWall({ width: 4, height: 2, depth: 0.3, color: 0x993399, position: pos }),
    (pos) => createPillar({ width: 0.6, depth: 0.6, height: 3, color: 0x666666, position: pos }),
    (pos) => createTorus({ radius: 1.2, tube: 0.35, color: 0xff3366, position: pos }),
];

function spawnObstacle() {
    const generator = obstacleGenerators[Math.floor(Math.random() * obstacleGenerators.length)];
    const x = (Math.random() - 0.5) * LANE_WIDTH * 2;
    const z = ball.position.z - SPAWN_DISTANCE;
    const obstacle = generator(new THREE.Vector3(x, 0, z));
    scene.add(obstacle);
    obstacles.push(obstacle);
}

function cleanObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].position.z > ball.position.z + 15) {
            scene.remove(obstacles[i]);
            obstacles[i].traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
            obstacles.splice(i, 1);
        }
    }
}

function updateGround() {
    const totalLength = chunkSize * numChunks;
    for (let i = 0; i < groundChunks.length; i++) {
        if (groundChunks[i].position.z > ball.position.z + chunkSize) {
            groundChunks[i].position.z -= totalLength;
        }
    }
}

const initScene = function() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    scene.fog = new THREE.Fog(0x111111, 40, 70);
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.getElementById("play-zone").appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(5, 10, 5);
    scene.add(sunLight);

    const textureLoader = new THREE.TextureLoader();

    const diffuseMap = textureLoader.load('/images/parquet/diagonal_parquet_diff_1k.jpg', (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(20, 20);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.colorSpace = THREE.SRGBColorSpace;
    });

    const groundMaterial = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        roughness: 0.9,
        metalness: 0.0
    });

    for (let i = 0; i < numChunks; i++) {
        const geo = new THREE.PlaneGeometry(chunkSize, chunkSize);
        const mesh = new THREE.Mesh(geo, groundMaterial);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.z = -i * chunkSize;
        scene.add(mesh);
        groundChunks.push(mesh);
    }

    const ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        roughness: 0.3,
        metalness: 0.1
    });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, BALL_RADIUS, 0);
    scene.add(ball);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') keys.left = true;
        if (e.key === 'ArrowRight') keys.right = true;
    });
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowRight') keys.right = false;
    });

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        ball.position.z -= BALL_SPEED_Z * delta;

        if (keys.left) ball.position.x -= BALL_SPEED_X * delta;
        if (keys.right) ball.position.x += BALL_SPEED_X * delta;
        ball.position.x = Math.max(-LANE_WIDTH, Math.min(LANE_WIDTH, ball.position.x));

        ball.rotation.x -= (BALL_SPEED_Z * delta) / BALL_RADIUS;

        if (elapsed - lastSpawnTime > SPAWN_INTERVAL) {
            spawnObstacle();
            lastSpawnTime = elapsed;
        }

        camera.position.x = ball.position.x;
        camera.position.y = 8;
        camera.position.z = ball.position.z + 12;
        camera.lookAt(ball.position.x, 0, ball.position.z - 5);

        cleanObstacles();
        updateGround();

        renderer.render(scene, camera);
    }
    animate();
}

const setupEvents = function() {
    initScene();
}

window.addEventListener("load", setupEvents);