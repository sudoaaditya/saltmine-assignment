import * as THREE from 'three';
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import useWallsStore from '../../features/wallsStore';

class Sketch {
    constructor(container) {
        this.container = container;

        // threejs vars
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.controls = null;

        this.sizes = {};
        this.textures = {};
        this.frameId = null;
        this.clock = null;
        // this.gui = new GUI();
        this.stats = new Stats();

        // zustand data'
        this.wallStore = useWallsStore;

        this.wallsPositions = this.wallStore.getState().wallPositions;
        this.wallBox3 = null;

        this.thickness = 0.2;
        this.height = 5;

        this.initialize();
    }

    initialize = () => {

        this.texLoader = new THREE.TextureLoader();

        this.scene = new THREE.Scene();

        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.container
        });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0xA0A0A0, 1);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.clock = new THREE.Clock();

        // camera & resize
        this.setupCamera();
        this.setupResize();

        // wramup calls
        this.resize();
        this.render();

        // world setup
        this.settings();
        this.loadTextures();
        this.addLights();

        // start animation loop
        this.start();

        document.body.appendChild(this.stats.dom);
    }

    settings = () => {
        this.settings = {

        };
    }

    setupCamera = () => {

        this.camera = new THREE.PerspectiveCamera(
            35,
            (this.sizes.width / this.sizes.height),
            0.1,
            1000
        );

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    setupResize = () => {
        window.addEventListener('resize', this.resize);
    }

    resize = () => {
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.sizes.width, this.sizes.height)
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = window.requestAnimationFrame(this.update);
        }
    }

    stop = () => {
        this.clock.stop();
        cancelAnimationFrame(this.frameId);
    }

    addLights = () => {
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
        this.scene.add(ambientLight);

        // Load HDR
        new RGBELoader().load('/hdrs/brown_photostudio_01_1k.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = texture;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 0.5;
        });

    }

    loadTextures = () => {
        const texPaths = {
            floorDiff: '/textures/wood_floor_diff_1k.jpg',
            floorAo: '/textures/wood_floor_ao_1k.jpg',
            floorArm: '/textures/wood_floor_arm_1k.jpg',
            floorDisp: '/textures/wood_floor_disp_1k.png',
        };

        Array.from(Object.keys(texPaths)).forEach((key) => {
            this.textures[key] = this.texLoader.load(texPaths[key], (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.needsUpdate = true;
                texture.colorSpace = THREE.SRGBColorSpace;
            });
        });

        this.addContents();
    }

    addContents = () => {
        // render base scene data!
        this.walls = new THREE.Group();

        this.wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.5 });

        this.wallsPositions.forEach((wall) => {
            // convert wall positions into x1 y1 x2 y2 vars
            const [x1, y1, x2, y2] = wall;

            // calculate width of the wall using distance formula
            const width = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

            // Generate wall geometry & Mesh
            const wallGeo = new THREE.BoxGeometry(width, this.height, this.thickness);
            const wallMesh = new THREE.Mesh(wallGeo, this.wallMaterial);

            // position using mid point of the wall
            wallMesh.position.x = (x2 + x1) / 2;
            wallMesh.position.y = this.height / 2;
            wallMesh.position.z = (y2 + y1) / 2;

            // rotation of the wall using atan2 formula
            const angle = Math.atan2(y2 - y1, x2 - x1);
            wallMesh.rotation.y = -angle;

            this.walls.add(wallMesh);
        })
        this.scene.add(this.walls);

        // update camera and controls to fit the scene
        this.updateCameraAndControls();

        // check if the polygon is enclosed
        if (this.isEnclosedPolygon(this.wallsPositions)) {
            console.log('Enclosed Polygon');
            this.drawFloor();
        }
    }

    drawFloor = () => {
        // floor material
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.floorDiff,
            aoMap: this.textures.floorAo,
            displacementMap: this.textures.floorDisp,
            metalnessMap: this.textures.floorArm,
            roughnessMap: this.textures.floorArm,
            aoMapIntensity: 0.5,
            displacementScale: 0.1,
            roughness: 1,
            metalness: 0.1,
            side: THREE.DoubleSide,
        });

        // create a shape using the wall positions
        const floorShape = new THREE.Shape();
        this.wallsPositions.forEach((wall, i) => {
            const [x1, y1] = wall;
            if (i === 0) {
                floorShape.moveTo(x1, y1);
            } else {
                floorShape.lineTo(x1, y1);
            }
        });
        floorShape.closePath();

        const floorGeometry = new THREE.ShapeGeometry(floorShape);
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

        const boxCenter = this.wallBox3.getCenter(new THREE.Vector3());
        // position & rotation the floor mesh
        floorMesh.rotation.x = - Math.PI / 2;
        floorMesh.scale.set(1, -1, 1);
        floorMesh.position.y = this.wallBox3.min.y;

        this.walls.add(floorMesh);
    }

    isEnclosedPolygon = (walls) => {
        var walls = {};

        // for a polygon to be enclosed, each wall should be connected to exactly 2 other walls
        this.wallsPositions.forEach((wall) => {
            const [x1, y1, x2, y2] = wall;

            const wallEdgeOne = `${x1},${y1}`;
            const wallEdgeTwo = `${x2},${y2}`;

            walls[wallEdgeOne] === undefined ? walls[wallEdgeOne] = 1 : walls[wallEdgeOne] += 1;
            walls[wallEdgeTwo] === undefined ? walls[wallEdgeTwo] = 1 : walls[wallEdgeTwo] += 1;
        });

        return Object.values(walls).every((wall) => wall === 2);
    }

    updateCameraAndControls = () => {
        this.wallBox3 = new THREE.Box3().setFromObject(this.walls);
        const size = this.wallBox3.getSize(new THREE.Vector3());

        this.controls.target.set(size.x / 2, 0, size.y);
        this.controls.update();
        this.camera.position.set(size.x / 2, size.x + this.height * 3, size.y);
        this.camera.lookAt(size.x / 2, 0, size.y);
    }

    updateWalls = () => {
        // reset walls
        this.walls.children.forEach((wall) => {
            if (wall.isMesh) {
                this.scene.remove(wall);
                wall.geometry.dispose();
                wall.material.dispose();
            }
        });
        this.walls.clear();

        // update walls
        this.wallsPositions = this.wallStore.getState().wallPositions;
        this.addContents();
    }

    update = () => {
        this.elpasedTime = this.clock.getElapsedTime();
        this.render();

        this.stats.update();
        this.frameId = window.requestAnimationFrame(this.update);
    }

    render = () => {
        let { renderer, scene, camera, } = this;
        if (renderer) {
            renderer.render(scene, camera);
        }
    }

    destroy = () => {
        this.stop();

        this.scene.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });

        window.removeEventListener('resize', this.resize);

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
    }
}

export { Sketch };