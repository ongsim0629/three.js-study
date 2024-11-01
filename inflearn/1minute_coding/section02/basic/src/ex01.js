import * as THREE from 'three';

// ------- 주제: 기본 장면

export default function example(){
    
// 동적으로 캔버스 조립하기
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

const canvas = document.querySelector("#three-canvas");
// const renderer = new THREE.WebGLRenderer({canvas: canvas});
// antialias : 계단현상 부드럽게 처리
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
// append는 해줄 필요 없다. -> 이미 html 안에 존재하기 때문에

const scene = new THREE.Scene();

// 순서대로 시야각, 종횡비, near, far
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);

// 카메라의 위치 설정 안하면 (0,0,0)으로 설정
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;

// Orthographic Camera (직교 카메라)
// 절두체의 왼쪽, 오른쪽
// const camera = new THREE.OrthographicCamera(-(window.innerWidth / window.innerHeight), window.innerWidth / window.innerHeight, 1, -1, 0.1, 1000);
// camera.position.x = 1;
// camera.position.y = 2;
// camera.position.z = 5;
// camera.lookAt(0,0,0);

// camera.zoom = 0.5;
// // 카메라 렌더에 관련된 속성을 바꿨으면 호출해주어야함
// camera.updateProjectionMatrix();

scene.add(camera);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({
    // color: 0xff0000
    // color: '#ff0000'
    color: 'red'
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

renderer.render(scene, camera);
}