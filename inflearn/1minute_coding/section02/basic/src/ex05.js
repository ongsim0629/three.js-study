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

camera.position.z = 5;

scene.add(camera);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.x = 1;
light.position.z = 2;
scene.add(light);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshStandardMaterial({
    color: 'red'
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const clock = new THREE.Clock();

function draw(){
    // console.log(clock.getElapsedTime());
    const time = clock.getElapsedTime();
    // 360도 기반이 아니라 라디안을 기반으로 한다.
    // mesh.rotation.y += 0.1;
    // 디그리 값을 라디안으로 변환 (진짜 1도)
    // 사용자 상황마다 이 속도가 달라질 수도 있어서 보정이 필요하다
    // mesh.rotation.y += THREE.MathUtils.degToRad(1);
    mesh.rotation.y = time;
    mesh.position.y += 0.01;
    if(mesh.position.y > 3){
        mesh.position.y = 0;
    }
    renderer.render(scene, camera);

    window.requestAnimationFrame(draw);
}

function setSize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

// 이벤트 처리
window.addEventListener('resize', setSize);

draw();

}

