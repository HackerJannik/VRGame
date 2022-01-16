import { THREE } from './app.js'

export function ImmersiveRenderer(scene, camera, animation, options) {

    let renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    renderer.xr.enabled = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let currentSession = null;

    const grabTrigger = 0;
    const DEVICE_ID = 0;

    let hand_controller = renderer.xr.getController(DEVICE_ID);

    function render(time) {
        if (currentSession && currentSession.inputSources && currentSession.inputSources.length) {
            let gp = currentSession.inputSources[DEVICE_ID].gamepad;
            options.is_grabbed = gp.buttons[grabTrigger].pressed;
            options.cursor.matrix.copy(hand_controller.matrix);
        }

        animation(time);
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(render);
    const sessionInitOptions = { optionalFeatures: ['local-floor', 'bounded-floor'] };

    function onSessionStarted(session) {
        session.addEventListener('end', onSessionEnded);
        renderer.xr.setSession(session);
        button.textContent = 'EXIT VR';
        currentSession = session;

        options.cursor.matrixAutoUpdate = false;
    }

    function onSessionEnded( /*event*/) {
        currentSession.removeEventListener('end', onSessionEnded);
        button.textContent = 'ENTER VR';
        currentSession = null;

        options.cursor.matrixAutoUpdate = true;
    }

    let button;
    function showEnterVR() {
        button.style.display = '';
        button.style.cursor = 'pointer';
        button.style.left = 'calc(50% - 50px)';
        button.style.width = '100px';
        button.textContent = 'ENTER VR';

        button.onmouseenter = function () {
            button.style.opacity = '1.0';
        };
        button.onmouseleave = function () {
            button.style.opacity = '0.5';
        };

        button.onclick = function () {
            if (currentSession === null) {
                navigator.xr.requestSession('immersive-vr', sessionInitOptions).then(onSessionStarted);
            } else {
                currentSession.end();
            }
        };
    }

    function disableButton() {
        button.style.display = '';
        button.style.cursor = 'auto';
        button.style.left = 'calc(50% - 75px)';
        button.style.width = '150px';
        button.onmouseenter = null;
        button.onmouseleave = null;
        button.onclick = null;
    }

    function showWebXRNotFound() {
        disableButton();
        button.textContent = 'VR NOT SUPPORTED';
    }

    function stylizeElement(element) {
        element.style.position = 'absolute';
        element.style.bottom = '20px';
        element.style.padding = '12px 6px';
        element.style.border = '1px solid #fff';
        element.style.borderRadius = '4px';
        element.style.background = 'rgba(0,0,0,0.1)';
        element.style.color = '#fff';
        element.style.font = 'normal 13px sans-serif';
        element.style.textAlign = 'center';
        element.style.opacity = '0.5';
        element.style.outline = 'none';
        element.style.zIndex = '999';

    }

    if ('xr' in navigator) {
        button = document.createElement('button');
        button.style.display = 'none';
        stylizeElement(button);
        navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {
            if (supported) {
                showEnterVR();
            } else {
                showWebXRNotFound();
            }
        });
    } else {
        button = document.createElement('a');
        button.href = 'https://webvr.info';
        button.innerHTML = 'WEBVR NOT SUPPORTED';
        button.style.left = 'calc(50% - 90px)';
        button.style.width = '180px';
        button.style.textDecoration = 'none';
        stylizeElement(button);
    }

    // document.body.appendChild(renderer.domElement);
    document.body.appendChild(button);

}
