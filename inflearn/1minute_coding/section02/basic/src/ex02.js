import * as THREE from 'three';

export default function example(){

const canvas = document.querySelector("#three-canvas");

const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(window.devicePixelRatio);
// 이렇게 해주는 게 성능 면에서 더 유리하다.
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;

scene.add(camera);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({
    color: 'red'
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

renderer.render(scene, camera);

function setSize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

// 이벤트 처리
window.addEventListener('resize', setSize);

}

