import { THREE } from './app.js'

import { MeshSet, Line } from './geo.js';

export function navigation_demo(scene, options) {
    let world = new THREE.Group();
    world.matrixAutoUpdate = false;
    scene.add(world);

    let meshes = MeshSet(world);

    let boxBL = meshes.create(0);
    boxBL.position.set(-1, 0, -1);
    boxBL.scale.set(1, 5, 1);
    let boxFL = meshes.create(0);
    boxFL.position.set(-1, 0, 1);
    boxFL.scale.set(1, 5, 1);
    let boxBR = meshes.create(0);
    boxBR.position.set(1, 0, -1);
    boxBR.scale.set(1, 5, 1);
    let boxFR = meshes.create(0);
    boxFR.position.set(1, 0, 1);
    boxFR.scale.set(1, 5, 1);

    let plane = meshes.create(6);
    plane.material.setValues({ color: 0x333333 });
    plane.material.side = THREE.DoubleSide;
    plane.receiveShadow = true;
    plane.position.set(0, -0.5, 0);
    plane.rotation.x = -Math.PI / 2;


    // for navigation
    let speedVector = new THREE.Vector3();
    let speedRotation = new THREE.Quaternion();
    let speedScale = new THREE.Vector3(1, 1, 1);

    // for matrix de-composition
    let currentMatrix = new THREE.Matrix4(),
        position = new THREE.Vector3(),
        quaternion = new THREE.Quaternion(),
        scale = new THREE.Vector3(),
        direction = new THREE.Vector3();

    meshes.reset = function () {
        world.matrix.identity();
    };

    let speed = 0.01;
    meshes.update = function (time, options) {
        if (options.is_grabbed) {
            options.cursor.matrix.decompose(position, quaternion, scale);
            direction.set(0, 0, 1);
            direction.applyQuaternion(quaternion);

            speedVector = direction.multiplyScalar(speed);
            currentMatrix.compose(speedVector, speedRotation, speedScale);
            world.matrix.premultiply(currentMatrix);
        }
    }
    return meshes;
}
