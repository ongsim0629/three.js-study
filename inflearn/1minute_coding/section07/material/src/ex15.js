import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

// ----- 주제: 로딩 매니저 (여러개의 텍스쳐 이미지 로드하기)

export default function example() {
    // 텍스쳐 이미지 로드
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const CubeTexture = cubeTextureLoader.setPath('/textures/cubemap/').load(['px.png','nx.png','py.png','ny.png','pz.png','nz.png']);
    // Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();
    scene.background = CubeTexture;

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({
        envMap: CubeTexture,
        metalness: 2,
        roughness: 0.1
	});
	const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
