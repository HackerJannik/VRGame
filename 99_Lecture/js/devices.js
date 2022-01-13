import { THREE } from './app.js'

const MOVESCALE = 0.002;
export function Mouse(cursor) {
    let mb = [false, false, false, false];

    function toggle(ev, active) {
        mb[ev.which] = active;
    }

    document.addEventListener("mousedown", ev => toggle(ev, true));
    document.addEventListener("mouseup", ev => toggle(ev, false));
    document.addEventListener("contextmenu", ev => {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    }, false);


    cursor.matrixAutoUpdate = false;

    document.addEventListener("mousemove", ev => {
        let dx = ev.movementX * MOVESCALE;
        let dy = ev.movementY * MOVESCALE;

        let rot = ev.ctrlKey;

        if (!rot && mb[1]) {
            cursor.position.x += dx;
            cursor.position.y -= dy;
        }

        if (!rot && mb[3]) {
            cursor.position.x += dx;
            cursor.position.z += dy;
        }

        if (rot && mb[1]) {
            cursor.rotation.x -= dy;
            cursor.rotation.z += dx;
        }

        if (rot && mb[3]) {
            cursor.rotation.y += dx;
            cursor.rotation.z -= dy;
        }

        cursor.updateMatrix();
    });
}


export function Keyboard() {
    let keys = {};

    function toggle(ev, active) {
        if (keys[ev.key]) {
            let ko = keys[ev.key];
            if (ko.active != active) {
                ko.active = active;
                ko.callback(active);
            }
        }
    }

    document.addEventListener("keydown", ev => toggle(ev, true));
    document.addEventListener("keyup", ev => toggle(ev, false));

    return (key, callback) => {
        keys[key] = {
            active: false,
            callback
        };
    }

}