import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { PreventDragClick } from './PreventDragClick';

// ----- 주제: 특정 방향의 광선 (Ray)에 맞은 Mesh 판별하기

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
	camera.position.x = 3;
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
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const boxMaterial = new THREE.MeshStandardMaterial({
		color: 'plum'
	});
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.name = 'box';
	scene.add(boxMesh);

	const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
	const torusMaterial = new THREE.MeshStandardMaterial({color:'lime'});
	const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
	torusMesh.name = 'torus';
	scene.add(torusMesh);

	const meshes = [boxMesh, torusMesh];

	const raycaster = new THREE.Raycaster();
    // 2차원 값 -> 클릭한 위치로 갱신해줄 예정
    const mouse = new THREE.Vector2();

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta();
		const time = clock.getElapsedTime();

		// boxMesh.position.y = Math.sin(time) * 2;
		// torusMesh.position.y = Math.cos(time) * 2;
		// boxMesh.material.color.set('plum');
		// torusMesh.material.color.set('lime');

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

    function checkIntersects(){
        if (preventDragClick.mouseMoved) return;

        // 오리진을 카메라에 있다고 생각하고
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(meshes);
        for (const item of intersects){
            console.log(item.object.name);
            item.object.material.color.set('red');
            // 처음 만나는 애만
            break;
        }

        // if (intersects[0]){
        //     console.log(intersects[0].object.name);
        // }
    }

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);
    // 마우스 클릭 위치 정규화
    canvas.addEventListener('click', e => {
        // 왼쪽 위가 (0,0) three.js는 가운데가 (0,0)이므로 변환이 필요하다.
        mouse.x = e.clientX/canvas.clientWidth*2-1;
        mouse.y = - (e.clientY/canvas.clientHeight*2-1);
        // console.log(mouse);
        checkIntersects();
    })

    const preventDragClick = new PreventDragClick(canvas);

	draw();
}
