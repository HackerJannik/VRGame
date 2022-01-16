import { THREE } from './app.js'

export function Line(scene) {
    let material = new THREE.LineBasicMaterial({
        color: 0x00ff00
    });

    const points = [];
    points.push(new THREE.Vector3(0, -0.3, 0));
    points.push(new THREE.Vector3(0, 1, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(geometry, material);
    let positions = line.geometry.attributes.position.array;

    function setPos(idx, pos) {
        idx *= 3;
        positions[idx++] = pos.x;
        positions[idx++] = pos.y;
        positions[idx++] = pos.z;
        line.geometry.attributes.position.needsUpdate = true
    }
    scene.add(line);
    return {
        line, setPos
    };
}

let geometries = [
    new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), // 0
    new THREE.ConeBufferGeometry(0.1, 0.5, 64),
    new THREE.CylinderBufferGeometry(0.2, 0.2, 0.2, 64), // 2
    new THREE.IcosahedronBufferGeometry(0.2, 3),
    new THREE.TorusBufferGeometry(0.2, 0.04, 64, 32), // 4
    new THREE.TorusKnotBufferGeometry(0.7, 0.04, 100, 16),
    new THREE.PlaneGeometry(10, 10, 64), // 6
    new THREE.SphereGeometry(0.1, 32, 16)
];

function randomMaterial(params) {
    return new THREE.MeshStandardMaterial({
        color: Math.random() * 0xff3333,
        roughness: 0.7,
        metalness: 0.0
    });
}

export function MeshCreator(i, parent) {
    let object = new THREE.Mesh(geometries[i], randomMaterial());
    if (parent) parent.add(object);
    return object;
}

export function MeshSet(parent) {
    let meshes = [];
    function hide() { for (let o of meshes) o.visible = false; }
    function show() { for (let o of meshes) o.visible = true; }
    function add(mesh) {
        meshes.push(mesh);
    }
    function create(i) {
        let mesh = MeshCreator(i, parent);
        meshes.push(mesh);
        return mesh;
    }
    function update() { }
    return { create, add, hide, show, update };
}


export function Geometry(scene) {
    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(0.4, 0.2, 0.2),
        new THREE.MeshStandardMaterial({
            color: 0x1e13f0,
            flatShading: true
        }));

    box.castShadow = true;

    scene.add(box);

    let cursor = new THREE.Mesh(new THREE.ConeBufferGeometry(0.2, 0.6, 64),
        new THREE.MeshStandardMaterial({
            color: 0xffaaaa,
            flatShading: true
        }));

    cursor.castShadow = true;

    scene.add(cursor);

    let torusgeometry = new THREE.TorusKnotBufferGeometry(0.7, 0.04, 100, 16);
    let torusmaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        flatShading: true
    });
    const torusKnot = new THREE.Mesh(torusgeometry, torusmaterial);
    torusKnot.castShadow = true;
    scene.add(torusKnot);
    torusKnot.receiveShadow = true;
    
    let planegeometry = new THREE.PlaneGeometry(2, 2, 64);
    let planematerial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    })

    let plane = new THREE.Mesh(planegeometry, planematerial);
    plane.receiveShadow = true;
    plane.position.set(0, -0.5, 0);
    plane.rotation.x = Math.PI / 2;

    scene.add(plane);

    return {
        box,
        cursor,
        torusKnot
    }
}
