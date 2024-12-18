import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es';

// ----- 주제: cannon.js 기본 세팅

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

export default function example() {
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
	
	// Cannon (물리엔진)
	const cannonWorld = new CANNON.World();
	// 중력 셋팅 (중력 가속도 셋팅 가능)
	// set으로 x,y,z축으로 설정 가능한데 중력이므로 z축만 해주면 된다.
	cannonWorld.gravity.set(0, -10, 0);	

	const floorShape = new CANNON.Plane();
	// 물리엔진 적용될 곳 : 무게, 위치, 모양
	const floorBody = new CANNON.Body({
		mass: 0,
		position: new CANNON.Vec3(0, 0, 0),
		shape : floorShape
	});
	// three.js처럼 바닥이 서 있기 때문에 회전해주어야한다.
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1, 0, 0),
		Math.PI / 2
	)
	cannonWorld.addBody(floorBody);

	const sphereShape = new CANNON.Sphere(new CANNON.Vec3(0.25, 2.5, 0.25));
	const spherBody = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0,10,0),
		shape: sphereShape
	});
	cannonWorld.addBody(spherBody);


	// Mesh
	const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshStandardMaterial({color: 'slategray'}));
	floorMesh.rotation.x = -Math.PI / 2;
	scene.add(floorMesh);

	const boxGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
	const boxMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.position.y = 0.5;
	scene.add(boxMesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		let cannonStepTime = 1/60;
		if (delta < 0.01) cannonStepTime = 1/120;

		// 시간 단계 셋팅 (고정된 시간 단위, 성능 보정, 지연 시간 간격 보정 셋팅)
		// 고정된 시간 단위는 화면 주사율에 따라서 조정을 해주어야 한다.
		cannonWorld.step(cannonStepTime, delta, 3);

		// 위치복사
		boxMesh.position.copy(spherBody.position);

		// 위치만 복사해주는 것이 아니라 회전도 복사해줘야지 적절하게 물리 현상의 영향을 받는다.
		boxMesh.quaternion.copy(spherBody.quaternion);

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
