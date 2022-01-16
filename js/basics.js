import { THREE } from './app.js'

export function Scene() {
    let scene = new THREE.Scene();

    scene.add(new THREE.HemisphereLight(0x202080, 0x606060));

    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 6, 0);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);
    scene.add(camera);

    return {
        scene,
        camera
    }
}

export function Renderer(scene, camera, animation) {
    let renderer = new THREE.WebGLRenderer({
        antialias: false
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    function render(time) {
        animation(time);
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(render);
    return renderer;
}