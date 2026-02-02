import * as THREE from 'three';

export function createBox({ width = 1, height = 1, depth = 1, color = 0xcc3333, position = new THREE.Vector3() } = {}) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y + height / 2, position.z);
    return mesh;
}

export function createCylinder({ radius = 1, height = 2, color = 0x3366cc, position = new THREE.Vector3() } = {}) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 16);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y + height / 2, position.z);
    return mesh;
}

export function createRamp({ width = 3, height = 1.5, depth = 2, color = 0xcc9933, position = new THREE.Vector3() } = {}) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(depth, 0);
    shape.lineTo(depth, height);
    shape.lineTo(0, 0);

    const extrudeSettings = { depth: width, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI / 2;
    mesh.position.set(position.x - width / 2, position.y, position.z - depth);
    return mesh;
}

export function createWall({ width = 4, height = 2, depth = 0.3, color = 0x993399, position = new THREE.Vector3() } = {}) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.05 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y + height / 2, position.z);
    return mesh;
}

export function createArch({ width = 3, height = 3, depth = 1, thickness = 0.4, color = 0x339966, position = new THREE.Vector3() } = {}) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 });

    const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(thickness, height * 0.6, depth), material);
    leftPillar.position.set(-width / 2 + thickness / 2, height * 0.3, 0);
    group.add(leftPillar);

    const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(thickness, height * 0.6, depth), material);
    rightPillar.position.set(width / 2 - thickness / 2, height * 0.3, 0);
    group.add(rightPillar);

    const archRadius = width / 2;
    const archShape = new THREE.Shape();
    archShape.absarc(0, 0, archRadius, 0, Math.PI, false);
    archShape.absarc(0, 0, archRadius - thickness, Math.PI, 0, true);

    const extrudeSettings = { depth: depth, bevelEnabled: false };
    const archGeometry = new THREE.ExtrudeGeometry(archShape, extrudeSettings);
    const archMesh = new THREE.Mesh(archGeometry, material);
    archMesh.position.set(0, height * 0.6, -depth / 2);
    group.add(archMesh);

    group.position.set(position.x, position.y, position.z);
    return group;
}

export function createPillar({ width = 0.6, depth = 0.6, height = 3, color = 0x666666, position = new THREE.Vector3() } = {}) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.2 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(width * 1.4, 0.3, depth * 1.4), material);
    base.position.y = 0.15;
    group.add(base);

    const column = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.4, width * 0.45, height - 0.6, 8), material);
    column.position.y = height / 2;
    group.add(column);

    const top = new THREE.Mesh(new THREE.BoxGeometry(width * 1.4, 0.3, depth * 1.4), material);
    top.position.y = height - 0.15;
    group.add(top);

    group.position.set(position.x, position.y, position.z);
    return group;
}

export function createStairs({ steps = 5, stepWidth = 2, stepHeight = 0.4, stepDepth = 0.6, color = 0x886644, position = new THREE.Vector3() } = {}) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.1 });

    for (let i = 0; i < steps; i++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth), material);
        step.position.set(0, i * stepHeight + stepHeight / 2, -i * stepDepth);
        group.add(step);
    }

    group.position.set(position.x, position.y, position.z);
    return group;
}

export function createCone({ radius = 1, height = 2, color = 0xff6600, position = new THREE.Vector3() } = {}) {
    const geometry = new THREE.ConeGeometry(radius, height, 16);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y + height / 2, position.z);
    return mesh;
}

export function createTorus({ radius = 1.5, tube = 0.4, color = 0xff3366, position = new THREE.Vector3() } = {}) {
    const geometry = new THREE.TorusGeometry(radius, tube, 16, 32);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.2 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(position.x, position.y + tube, position.z);
    return mesh;
}