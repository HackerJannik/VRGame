		import * as THREE from './three.module.js';

        //Create scene
        var scene = new THREE.Scene();
        // Create camera
        var camera = new THREE.PerspectiveCamera(70, aspect, 1, 2000);
        camera.position.set(0, 0, 100);
        // Create renderer (WebGL renderer)
        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(0x000000, 1);
        renderer.setSize(ww, wh);
        document.body.appendChild(renderer.domElement);
		
		//Creating Point Light Source
        var light = new THREE.PointLight(0xffaaaa, 1, 1000);
        light.position.set(50, 50, 50);
        scene.add(light);
		//Creating Parallel Light
        var direLight = new THREE.DirectionalLight(0xffaaaa, 1000);
        direLight.position.set(0, 500, 0);
        direLight.castShadow = true;
        scene.add(direLight);

        // Create text
        var fontload = new THREE.FontLoader().load('../../fonts/gentilis_bold.typeface.json', function(text) {
            var textG = new THREE.TextGeometry('WJCHumble', {
                size: 20, //Size, usually the height of capital letters
                height: 10, //Thickness of text
                weight: 'normal', //Is the value'normal'or'bold' coarsened
                font: text, //Font, default is the font file that'helvetiker'needs to be referenced
                style: 'normal', //Is the value'normal'or'italics' italic?
                bevelThickness: 1, //Extended distance thickness between oblique angle and original text contour
                bevelSize: 1, //The extended distance between the bevel and the original text outline defaults to 8
                curveSegments: 30,//Arc Segmentation Number, Makes Text Curve Smoother Default 12
                bevelEnabled: true, //Boolean, use chamfer or not, meaning to bevel at edge
            });
            textG.center();
            var textM = new THREE.MeshPhongMaterial({
                color: 0xffaaaa,
                specular: 0xffaaaa,
                shininess: 30,
                shading: THREE.FlatShading
            });
            var text = new THREE.Mesh(textG, textM);
            text.castShadow = true;
            scene.add(text);
        });
    

	//Render Page
	renderer.render(scene, camera);