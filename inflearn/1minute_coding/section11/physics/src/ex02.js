import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es';

// ----- 주제: Contact sphereMaterial

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
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
	directionalLight.castShadow = true;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);
	
	// Cannon (물리엔진)
	const cannonWorld = new CANNON.World();
	// 중력 셋팅 (중력 가속도 셋팅 가능)
	// set으로 x,y,z축으로 설정 가능한데 중력이므로 z축만 해주면 된다.
	cannonWorld.gravity.set(0, -10, 0);	

	// Contact Material
	const defaultMaterial = new CANNON.Material('default');
	const rubberMaterial = new CANNON.Material('rubber');
	const ironMaterial = new CANNON.Material('iron');
	const defaultContatctMaterial = new CANNON.ContactMaterial(
		defaultMaterial,
		defaultMaterial,
		// 마찰, 반발
		{
			friction: 0.5,
			restitution: 0.3
		}
	);
	// 얘를 캐논 월드에 디폴트 컨택트 머티리얼로 세팅해주어야한다.
	cannonWorld.defaultContactMaterial = defaultContatctMaterial;

	const rubberDefaultContactMaterial = new CANNON.ContactMaterial(
		rubberMaterial,
		defaultMaterial,
		{
			friction: 0.5,
			restitution: 0.7
		}
	);
	// 얘는 일단 등록많 해준 것이다.
	cannonWorld.addContactMaterial(rubberDefaultContactMaterial);

	const ironDefaultContactMaterial = new CANNON.ContactMaterial(
		ironMaterial,
		defaultMaterial,
		{
			friction: 0.5,
			restitution: 0
		}
	);
	// 얘는 일단 등록만 해준 것이다.
	cannonWorld.addContactMaterial(ironDefaultContactMaterial);


	const floorShape = new CANNON.Plane();
	// 물리엔진 적용될 곳 : 무게, 위치, 모양
	const floorBody = new CANNON.Body({
		mass: 0,
		position: new CANNON.Vec3(0, 0, 0),
		shape : floorShape,
		material: defaultMaterial
	});
	// three.js처럼 바닥이 서 있기 때문에 회전해주어야한다.
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(-1, 0, 0),
		Math.PI / 2
	)
	cannonWorld.addBody(floorBody);

	const sphereShape = new CANNON.Sphere(0.5, 5, 0.5);
	const sphereBody = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0,10,0),
		shape: sphereShape,
		// material: rubberMaterial
		material: ironMaterial
	});
	cannonWorld.addBody(sphereBody);


	// Mesh
	const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshStandardMaterial({color: 'slategray'}));
	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.receiveShadow = true;
	scene.add(floorMesh);

	const sphereGeometry = new THREE.SphereGeometry(0.5);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphereMesh.position.y = 0.5;
	sphereMesh.castShadow = true;
	scene.add(sphereMesh);

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
		sphereMesh.position.copy(sphereBody.position);

		// 위치만 복사해주는 것이 아니라 회전도 복사해줘야지 적절하게 물리 현상의 영향을 받는다.
		sphereMesh.quaternion.copy(sphereBody.quaternion);

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
