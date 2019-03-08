let renderer = undefined;
let scene = undefined;
let camera = undefined;
let absoluteAccumulatedTime = 0;

$(function () {
  const { width, height } = getWidthAndHeight();
  const ratio = width / height;

  camera = new THREE.PerspectiveCamera(17, ratio, 0.01, 10000);
  camera.position.set(0, 0, 30);
  camera.lookAt(0, 0, 0);

  const controls = new THREE.OrbitControls( camera );
  controls.update();
  
  renderer = new THREE.WebGLRenderer();
  updateViewport();
  $("#canvas-container").append(renderer.domElement);

  scene = new THREE.Scene();

  sun = new Astro(1, 10, 0, 0, "src/textures/selena.jpg", false, true);
  const moon = new Astro(0.5, 2, 5, 5, "src/textures/selena.jpg", true);
  const a = new Astro(0.3, 3, 2, 2, "src/textures/selena.jpg");
  const b = new Astro(0.1, -1, 1, 1, "src/textures/selena.jpg");
  a.addOrbiter(b);
  moon.addOrbiter(a);
  sun.addOrbiter(moon);

  scene.add(sun);

  renderer.setAnimationLoop(animationLoop)
});

function animationLoop(accumulatedTime) {
  const timeDifference = accumulatedTime - absoluteAccumulatedTime;
  sun.position.set(sun.position.x + 0.01, 0, 0);
  sun.animationLoop(absoluteAccumulatedTime, timeDifference);
  absoluteAccumulatedTime = accumulatedTime;
  renderer.render(scene, camera);
}

function getWidthAndHeight() {
  const width = $("#canvas-container").width();
  const height = $("#canvas-container").height();
  return { width, height };
}

function updateViewport() {
  // A trial-and-error-deduced multiplier to achieve a FOV for an average user in front of a computer screen
  const ANGLE_MULTIPLIER = 2.25E-2;
  const { width, height } = getWidthAndHeight();
  const fov = height * ANGLE_MULTIPLIER;
  camera.aspect = width / height;
  camera.fov = fov;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

$(window).on(
  "resize",
  updateViewport
);