import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import {PreventDragClick} from './PreventDragClick';
import {Domino} from './Domino';

// ----- 주제: 도미노

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
	
    // Loader
    const gltfLoader = new GLTFLoader();

	// Cannon (물리엔진)
	const cannonWorld = new CANNON.World();
	// 중력 셋팅 (중력 가속도 셋팅 가능)
	// set으로 x,y,z축으로 설정 가능한데 중력이므로 z축만 해주면 된다.
	cannonWorld.gravity.set(0, -10, 0);	

    // 성능을 위한 세팅
    // cannonWorld.allowSleep = true;
    // 퀄리티도 저하시키지 않으면서 적당히 성능 좋아짐
    cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);
    // SAPBroadphase // 제일 좋음
    // NaiveBroadPhase // 기본 값
    // GridBroadPhase // 구역을 나누어 테스트

	// Contact Material
	const defaultMaterial = new CANNON.Material('default');
	const defaultContatctMaterial = new CANNON.ContactMaterial(
		defaultMaterial,
		defaultMaterial,
		// 마찰, 반발
		{
			friction: 0.01,
			restitution: 0.9
		}
	);
	// 얘를 캐논 월드에 디폴트 컨택트 머티리얼로 세팅해주어야한다.
	cannonWorld.defaultContactMaterial = defaultContatctMaterial;

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

	// Mesh
	const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshStandardMaterial({color: 'slategray'}));
	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.receiveShadow = true;
	scene.add(floorMesh);

    // 도미노 생성
    const dominos = [];
    let domino;
    for (let i = -3; i < 17; i++){
        domino = new Domino({
            scene,
            cannonWorld,
            gltfLoader,
            z: -i * 0.8,
            index: i,
        });
        dominos.push(domino);
    } 

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		let cannonStepTime = 1/60;
		if (delta < 0.01) cannonStepTime = 1/120;

		// 시간 단계 셋팅 (고정된 시간 단위, 성능 보정, 지연 시간 간격 보정 셋팅)
		// 고정된 시간 단위는 화면 주사율에 따라서 조정을 해주어야 한다.
		cannonWorld.step(cannonStepTime, delta, 3);

        dominos.forEach(item => {
            // glb 불러오는데 시간 소요된다.
            if (item.cannonBody){
                item.modelMesh.position.copy(item.cannonBody.position);
                item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
            }
        })
		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

    function checkIntersects(){
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children);

        for (const item of intersects){
            if(intersects[0].object.cannonBody){
            intersects[0].object.cannonBody.applyForce(
                new CANNON.Vec3(0, 0, -100),
                new CANNON.Vec3(0, 0, 0)
            );
            break;
        }
        }

        // if(intersects[0].object.cannonBody){
        //     intersects[0].object.cannonBody.applyForce(
        //         new CANNON.Vec3(0, 0, -100),
        //         new CANNON.Vec3(0, 0, 0)
        //     );
        // }
    }

	// 이벤트
	window.addEventListener('resize', setSize);
    canvas.addEventListener('click', e => {
        if (preventDragClick.mouseMoved) return;

        mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
        mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);

        checkIntersects();
    });

    const preventDragClick = new PreventDragClick(canvas);

	draw();
}
