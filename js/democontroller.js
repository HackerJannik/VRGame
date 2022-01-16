import { simple_demo, animation_demo } from './simple_demos.js'
import { ray_demo } from './ray_demo.js'
import { navigation_demo } from './navigation_demo.js'

export function CreateDemos(scene, options, camera) {
    let demos = DemoController();
    demos.add(ray_demo(scene, options, camera));
    // demos.add(navigation_demo(scene, options));
    // demos.add(simple_demo(scene, options));
    // demos.add(animation_demo(scene, options));
    demos.resetController();
    return demos;
}

export function DemoController() {
    let demos = [], currentIdx = 0, current;
    function next() {
        if (!demos) return;
        if (!current) current = demos[0];
        hide();
        if (++currentIdx >= demos.length) currentIdx = 0;
        current = demos[currentIdx];
        current.show();
    };

    function update(t, o) { current.update(t, o); }
    function hide() { for (let d of demos) d.hide(); }

    function add(m) {
        demos.push(m);
        currentIdx = 0;
        current = demos[currentIdx];
    }
    function resetAllDemos() {
        for (let d of demos) {
            if (d.reset)
                d.reset();
        }
    }

    function resetController() {
        currentIdx = 0;
        hide();
        current = demos[currentIdx];
        current.show();
    }

    return { add, next, update, resetController, resetAllDemos };
}

