let renderer = undefined;
let scene = undefined;
let camera = undefined;

$(function () {
  const { width, height } = getWidthAndHeight();
  camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  updateRendererSize();
  $("#canvas-container").append(renderer.domElement);

  scene = new THREE.Scene();

  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const geometry = new THREE.SphereGeometry(1, 10, 10);
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  renderer.setAnimationLoop(animationLoop)
});

function animationLoop() {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  sphere.position.set(sphere.position.x + 0.1, sphere.position.y + 0.1, 0);
  renderer.render(scene, camera);
}

function getWidthAndHeight() {
  const width = $(window).width();
  const height = $(window).height();
  return { width, height };
}

function updateRendererSize() {
  const { width, height } = getWidthAndHeight();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

$(window).on(
  "resize",
  updateRendererSize
);