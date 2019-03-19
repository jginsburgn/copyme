let renderer = undefined;
let scene = undefined;
let camera = undefined;
let absoluteAccumulatedTime = 0;
let robot = undefined;

$(function () {
  const { width, height } = getWidthAndHeight();
  const ratio = width / height;

  camera = new THREE.PerspectiveCamera(17, ratio, 0.01, 10000);
  camera.position.set(0, 45, 500);
  camera.lookAt(0, 45, 0);

  // const controls = new THREE.OrbitControls(camera);
  // controls.update();

  renderer = new THREE.WebGLRenderer();
  updateViewport();
  $("#canvas-container").append(renderer.domElement);

  scene = new THREE.Scene();

  light = new THREE.HemisphereLight(0xffffff, 0x444444, 10);
  light.position.set(0, 100, 0);
  scene.add(light);

  var loader = new THREE.FBXLoader();
  loader.load('src/assets/robot/robot.fbx', function (object) {
    // mixer = new THREE.AnimationMixer(object);
    // var action = mixer.clipAction(object.animations[0]);
    // action.play();
    // object.traverse(function (child) {
    //   if (child.isMesh) {
    //     child.castShadow = true;
    //     child.receiveShadow = true;
    //   }
    // });
    robot = object;
    console.log(object);
    object.scale.copy(new THREE.Vector3(0.5, 0.5, 0.5));
    var texture = new THREE.TextureLoader().load('src/assets/robot/textures/robot_AlbedoTransparency.png');
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        for (let m of child.material) {
          m.map = texture
          m.needsUpdate = true;
        }
      }
    });
    var helper = new THREE.SkeletonHelper(object);
    helper.material.linewidth = 3;
    scene.add(helper);
    scene.add(object);
    const b = getBone("LeftUpperLeg");
    b[0].rotation.set(0, 0, Math.PI / 4);
    const c = getBone("LeftLowerLeg");
    c[0].rotation.set(0, 0, -Math.PI / 4);
  });

  // sun = new Astro(1, 10, 0, 0, "src/textures/selena.jpg", false, true);
  // const moon = new Astro(0.5, 2, 5, 5, "src/textures/selena.jpg", true);
  // const a = new Astro(0.3, 3, 2, 2, "src/textures/selena.jpg");
  // const b = new Astro(0.1, -1, 1, 1, "src/textures/selena.jpg");
  // a.addOrbiter(b);
  // moon.addOrbiter(a);
  // sun.addOrbiter(moon);

  // scene.add(sun);

  renderer.setAnimationLoop(animationLoop)
});

function animationLoop(accumulatedTime) {
  const timeDifference = accumulatedTime - absoluteAccumulatedTime;
  absoluteAccumulatedTime = accumulatedTime;
  renderer.render(scene, camera);
}

function getWidthAndHeight() {
  const width = $("#canvas-container").width();
  const height = $("#canvas-container").height();
  return { width, height };
}

function getBone(name) {
  let retVal = [];
  robot.traverse(function (child) {
    if (child instanceof THREE.Bone) {
      console.log(child.name, name);
      if (child.name == name) {
        retVal.push(child);
        return;
      }
    }
  });
  return retVal;
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