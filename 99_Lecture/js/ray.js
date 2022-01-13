import { THREE } from './app.js'
import { Line } from './geo.js';

export function Ray(scene, cursor, array_of_objects) {
    let setLinePos = Line(scene);

    // Raycaster
    let raycaster = new THREE.Raycaster();
    let direction = new THREE.Vector3();
    let rayEnd = new THREE.Vector3();

    // for matrix de-composition
    let position = new THREE.Vector3();
    let quaternion = new THREE.Quaternion();
    let scale = new THREE.Vector3();

    // find a hit on predefined object-list
    function update() {
        direction.set(0, 0, -1);
        cursor.matrix.decompose(position, quaternion, scale);
        direction.applyQuaternion(quaternion);

        setLinePos(0, position);
        raycaster.set(position, direction);
        let intersects = raycaster.intersectObjects(array_of_objects);
        if (intersects.length > 0) {
            setLinePos(1, intersects[0].point);
            raylength = intersects[0].distance;
            return intersects[0].object;
        } else {
            rayEnd.addVectors(position, direction.multiplyScalar(2));
            setLinePos(1, rayEnd);
        }
    }

    // when grabbed, just draw the ray
    let raylength = 5;
    function ray() {
        cursor.matrix.decompose(position, quaternion, scale);
        setLinePos(0, position);
        direction.set(0, 0, -1);
        direction.applyQuaternion(quaternion);
        rayEnd.addVectors(position, direction.multiplyScalar(raylength));
        setLinePos(1, rayEnd);
    }

    return {
        update, ray
    }

}

