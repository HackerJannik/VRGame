import { THREE } from './app.js'
import { MeshSet, Line } from './geo.js';

export function ray_demo(scene, options, camera) {
    let meshes = MeshSet(scene);
    //for laser line
    let { line, setPos } = Line(scene);
    meshes.add(line);
    line.material.setValues({ color: 0xffff00 });


    let plane = meshes.create(6);
    plane.material.setValues({ color: 0x333333 });
    plane.material.side = THREE.DoubleSide;
    plane.receiveShadow = true;
    plane.position.set(0, -0.5, 0);
    plane.rotation.x = -Math.PI / 2;

    /////////////////////////////////////////////////
    /// Laser & Raycaster
    let raycaster = new THREE.Raycaster();

    // for matrix de-composition
    let position = new THREE.Vector3();
    let quaternion = new THREE.Quaternion();
    let scale = new THREE.Vector3();

    //in welche richtung strahl
    let direction = new THREE.Vector3();
    //endpunkt strahl
    let rayEnd = new THREE.Vector3();

    const MAX_RANDOM = 2;
    function RND() {
        return Math.random() * MAX_RANDOM - (MAX_RANDOM / 2);
    }

    
    function RNDX() {
        if(Math.round(Math.random()) == 1){
            return Math.random() * 10;
        }else{
            return  Math.random() * -10;
        }
    }


    function RNDZ() {
        if(Math.round(Math.random()) == 1){
            return Math.random() *12;
        }else{
            return  Math.random() * -12;
        }
    }

    function RNDY() {
        return Math.random() * 10;
    }


    let raylength = 5;
    function update_laser(cursor) {
        cursor.matrix.decompose(position, quaternion, scale);
        setPos(0, position);
        direction.set(0, 0, -1);
        direction.applyQuaternion(quaternion);
        raycaster.set(position, direction);
        //objekte an laserstrahl übergeben
        let intersects;
        if(gameover){
            intersects = raycaster.intersectObjects(playBtn);
        }else{
            intersects = raycaster.intersectObjects(array_of_objects);
        }
        //wenn man objekt getroffen hat enthält array dieses objekt
        if (intersects.length > 0) {
            setPos(1, intersects[0].point);
            raylength = intersects[0].distance;
            return intersects[0].object;
        }else{
            //strahl länge
            raylength = 10;
            rayEnd.addVectors(position, direction.multiplyScalar(raylength));
            setPos(1, rayEnd);
        }
    }

    function grabbed_laser(cursor) {
        cursor.matrix.decompose(position, quaternion, scale);
        setPos(0, position);
        direction.set(0, 0, -1);
        direction.applyQuaternion(quaternion);
        rayEnd.addVectors(position, direction.multiplyScalar(raylength));
        setPos(1, rayEnd);
    }
    /////////////////////////////////////////////////
    /// Grabbing
    let inverse = new THREE.Matrix4(),
        currentMatrix,
        initialGrabbed, hitObject,
        validGrabMatrix = false;


    function grabbing(cursor, hitObject, is_grabbed) {
        if (hitObject && is_grabbed) {
            if (validGrabMatrix) {
                currentMatrix = initialGrabbed.clone(); // Ti-1 * Li
                currentMatrix.premultiply(cursor.matrix); // Ln = Tn * Ti-1 * Li
                hitObject.matrix.copy(currentMatrix); // Ln LKS des zu bewegenden Obj.
            } else {
                inverse.copy(cursor.matrix).invert(); // Ti-1 -> inverse des touchpunktes
                initialGrabbed = hitObject.matrix.clone(); // Li  -> lokale matrix des zu bewegenden objekts
                initialGrabbed.premultiply(inverse); // Ti-1 * Li 
                validGrabMatrix = true;
            }
        } else { 
            validGrabMatrix = false;
        }
    }

    //option.is_grabbed prüft ob taste gedrückt ist
    //hitObject wenn objekt getroffen ist dort das objekt gespeichert
    //grabbed_laser laser wird nur so weit gezeichnet bis objekt und geupdated
   /* meshes.update = function (time, options) {
        if (hitObject && options.is_grabbed) {
            grabbed_laser(options.cursor);
        } else {
            hitObject = update_laser(options.cursor);
        }
        grabbing(options.cursor, hitObject, options.is_grabbed)
    }*/

    function createBall(){
        // create an AudioListener and add it to the camera
        const listener = new THREE.AudioListener();
        listener.hasPlaybackControl = true;
        camera.add( listener );
        // create a global audio source
        const sound = new THREE.Audio( listener );
        
        let vector = new THREE.Vector3();
        let box = meshes.create(7);
        box.castShadow = true;
        box.matrixAutoUpdate = false;
        if(Math.round(Math.random()) == 1){
            box.position.set(RNDX(), RNDY(), -12);
        }else{
            if(Math.round(Math.random()) == 1){
                box.position.set(12, RNDY(), RNDZ());
            }else{
                box.position.set(-12, RNDY(), RNDZ());
            }
        }
        vector.subVectors(box.position, options.cursor.position).setLength(0.01);
        box.v = vector;
        box.audio = false;
        box.sound = sound; 
        box.listener = listener;
        box.updateMatrix();
        array_of_objects.push(box);
    }
    
    function addVector(pos, v){
        return {x: pos.x - v.x,
                y: pos.y - v.y,
                z: pos.z - v.z};
    }


    function checkCollision(pos, cursor){
        let vec = new THREE.Vector3();
        vec.subVectors(pos, cursor);
        if(vec.length() < 0.01){
            return true;
        }else{
            return false;
        }
    }
    
    function checkRange(pos, cursor, range){
        let vec = new THREE.Vector3();
        vec.subVectors(pos, cursor);
        if(vec.length() < range){
            return true;
        }else{
            return false;
        }
    }


    function loadAudio(obj){
        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( './sounds/heart.ogg', function( buffer ) {
            obj.sound.setBuffer( buffer );
            obj.sound.hasPlaybackControl = true;
            obj.sound.setLoop( true );
            obj.sound.setVolume( 0.5 );
            obj.sound.play();
        });
       
    }

    let array_of_objects = [];
    let playBtn = [];


    for (let i = 0; i < 3; ++i) {
        createBall();
    }
    let gameover = false;

    meshes.update = function (time, options) {

        hitObject = update_laser(options.cursor);
        
        if(gameover){
            if(hitObject && options.is_grabbed){
                playBtn[0].visible = false;
                gameover = false;
                for (let i = 0; i < 3; ++i) {
                    createBall();
                }
            }
        }else{
            // spawns randomly new balls during the game
            if(Math.floor(Math.random() * 30) == 0){
                createBall();
            }

            for(let obj of array_of_objects){

                let newPos = addVector(obj.position, obj.v);
                obj.position.set(newPos.x, newPos.y, newPos.z);
                obj.updateMatrix();

                if(checkCollision(obj.position, options.cursor.position)){
                    console.log("game over");
                    gameover = true;
                    playBtn[0] = meshes.create(0);
                    playBtn[0].castShadow = true;
                    playBtn[0].matrixAutoUpdate = false;
                    playBtn[0].position.set(0,0,-5);
                    playBtn[0].updateMatrix();
                    
                    for(let o of array_of_objects){
                        if(o.audio){
                            o.audio = false;
                            o.sound.stop();
                        }
                        o.visible = false;
                    }
                    array_of_objects = [];
                    break;  
                }
                if(checkRange(obj.position, options.cursor.position, 10)){
                    if(!obj.audio){
                        loadAudio(obj); 
                        obj.audio = true;
                    }
                }
                
            }

            if(hitObject && options.is_grabbed){
                let index = array_of_objects.indexOf(hitObject);
                let obj = array_of_objects[index];
                hitObject.visible = false;

                obj.sound.stop();
                array_of_objects.splice(index, 1);
                console.log(array_of_objects);
            }

        }
    }
        
    return meshes;
}
