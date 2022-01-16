import * as THREE from './three.module.js';
export { THREE };
import { Scene, Renderer } from './basics.js';
import { Keyboard, Mouse } from './devices.js';
import { MeshCreator } from './geo.js';
import { CreateDemos } from './democontroller.js';
import { ImmersiveRenderer } from './vr.js'


let { scene, camera } = Scene();

let cursor = new THREE.Group();
scene.add(cursor);

let cursorMesh = MeshCreator(1, cursor);
cursorMesh.castShadow = true;
cursorMesh.rotation.set(-Math.PI / 2, 0, 0);

function reset_cursor() {
    cursor.position.set(0, 0, 0);
    cursor.rotation.set(0, 0, 0);
    cursor.updateMatrix();
}

let options = {
    is_rotating: true,
    is_grabbed: false,
    cursor
}

let demos = CreateDemos(scene, options, camera);

let addKey = Keyboard();
addKey("r", active => { options.is_rotating = !active; });
addKey(" ", active => { options.is_grabbed = active; });
addKey("n", active => { if (!active) demos.next(); });
addKey("x", active => {
    if (!active) {
        reset_cursor();
        demos.resetAllDemos();
    }
});
Mouse(cursor);
reset_cursor();
//  Renderer(scene, camera, t => demos.update(t, options));

ImmersiveRenderer(scene, camera, t => demos.update(t, options), options);
