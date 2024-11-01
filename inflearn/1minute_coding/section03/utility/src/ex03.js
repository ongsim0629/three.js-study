import * as THREE from 'three';
import dat from 'dat.gui';

// ----- 주제: 초당 프레임 수 보기 (Stats)

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
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.y = 1;
	camera.position.z = 5;
	scene.add(camera);

	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);
	
	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({
		color: 'seagreen'
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

    // Dat GUI
    const gui  = new dat.GUI();
    // 첫 번째 인자로 조정하고 싶은 속성을 가지고 있는 오브젝트를 넣어준다.
    // 두 번째 인자로 조정하고 싶은 속성을 문자열로 넣어준다.
    // 조정 범위 최솟값, 최댓값, step 단위
    gui.add(camera.position, 'x').min(-10).max(10).step(0.01).name('카메라의 X위치');
	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const time = clock.getElapsedTime();

		mesh.rotation.y = time;

        camera.lookAt(mesh.position);

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
