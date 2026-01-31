import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class CarShowroom {
    constructor(canvas, loadingCallback) {
        this.canvas = canvas;
        this.setLoading = loadingCallback;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.carModel = null;
        this.animationId = null;
        this.loader = null;

        // Materials
        this.bodyMaterial = null;
        this.whiteBodyMaterial = null;
        this.detailsMaterial = null;
        this.glassMaterial = null;
    }

    init() {
        // Scene (Transparent Background)
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(3, 2, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
        this.controls.maxDistance = 10;
        this.controls.minDistance = 3;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        dirLight.shadow.bias = -0.0001;
        this.scene.add(dirLight);

        const spotLight = new THREE.SpotLight(0xff0040, 10);
        this.spotLight = spotLight; // Keep ref if needed
        spotLight.position.set(-5, 5, 0);
        spotLight.lookAt(0, 0, 0);
        spotLight.penumbra = 0.5;
        this.scene.add(spotLight);

        const spotLight2 = new THREE.SpotLight(0x0040ff, 10);
        this.spotLight2 = spotLight2;
        spotLight2.position.set(5, 5, 0);
        spotLight2.lookAt(0, 0, 0);
        spotLight2.penumbra = 0.5;
        this.scene.add(spotLight2);

        // Shadow Floor
        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.ShadowMaterial({
            opacity: 0.5
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Environment
        const environment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = pmremGenerator.fromScene(environment).texture;

        // Initialize Materials
        this.initializeMaterials();

        // Initialize Loader
        this.initializeLoader();

        // Start Animation Loop
        this.animate();
    }

    initializeMaterials() {
        this.bodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x990000,
            metalness: 1.0,
            roughness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03,
            sheen: 0.5
        });

        this.whiteBodyMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 1.0,
            roughness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03,
            sheen: 0.5
        });

        this.detailsMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 1.0,
            roughness: 0.2
        });

        this.glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.25,
            roughness: 0,
            transmission: 1.0
        });
    }

    initializeLoader() {
        const manager = new THREE.LoadingManager();
        this.loader = new GLTFLoader(manager);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        this.loader.setDRACOLoader(dracoLoader);
    }

    loadCar(path) {
        if (!this.loader || !this.scene) return;

        // Remove existing car
        if (this.carModel) {
            this.scene.remove(this.carModel);
            // Optional: Dipose existing model resources if needed
        }

        if (this.setLoading) this.setLoading(true);

        this.loader.load(path, (gltf) => {
            this.carModel = gltf.scene;

            // Apply materials to Ferrari (Red) and Gallardo (White)
            if (path.includes('ferrari') || path.includes('gallardo')) {
                this.carModel.traverse((child) => {
                    if (child.isMesh) {
                        const name = child.name.toLowerCase();
                        const matName = child.material && child.material.name ? child.material.name.toLowerCase() : '';

                        const isInterior = name.includes('interior') || name.includes('seat') || name.includes('dashboard') || name.includes('steering') || name.includes('console') || name.includes('leather') || name.includes('plastic') || name.includes('carpet') ||
                            matName.includes('interior') || matName.includes('seat') || matName.includes('dashboard') || matName.includes('leather') || matName.includes('plastic');

                        // Enhanced body check
                        const isBody = (name.includes('body') || name.includes('paint') || name.includes('chassis') || name.includes('exterior') || name.includes('yellow') || name.includes('red') ||
                            matName.includes('body') || matName.includes('paint') || matName.includes('yellow') || matName.includes('red') || matName.includes('giallo')) &&
                            !name.includes('wheel') && !matName.includes('wheel') &&
                            !name.includes('tire') && !matName.includes('tire') &&
                            !name.includes('brake') && !matName.includes('brake') &&
                            !name.includes('glass') && !matName.includes('glass') &&
                            !name.includes('window') && !matName.includes('window') &&
                            !isInterior;

                        if (isBody) {
                            child.material = path.includes('gallardo') ? this.whiteBodyMaterial : this.bodyMaterial;
                        }
                        else if (name.includes('glass') || name.includes('window') || matName.includes('glass')) {
                            child.material = this.glassMaterial;
                        }
                        else if (name.includes('rim') || name.includes('trim') || name.includes('grill') || matName.includes('rim') || matName.includes('chrome')) {
                            child.material = this.detailsMaterial;
                        }

                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
            } else {
                // Ensure shadows for other models without changing materials
                this.carModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
            }

            // Specific Adjustments per Model
            if (path.includes('gallardo') || path.includes('masserati') || path.includes('ferrari') || path.includes('auditt')) {
                this.carModel.scale.set(100, 100, 100); // Scale up for models in cm
            } else {
                this.carModel.scale.set(1, 1, 1); // Default scale
            }

            this.carModel.position.y = 0;
            this.scene.add(this.carModel);

            if (this.setLoading) this.setLoading(false);

        }, undefined, (error) => {
            console.error('Error loading model:', error);
            if (this.setLoading) this.setLoading(false);
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));

        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    dispose() {
        cancelAnimationFrame(this.animationId);
        if (this.renderer) this.renderer.dispose();
    }
}
