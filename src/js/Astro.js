class Astro extends THREE.Group {
  static RING_INNER_OFFSET = 0.1;
  static RING_OUTER_OFFSET = 1;
  static ORBIT_WIDTH = 0.05;

  constructor(radius, spinPeriod, orbitalPeriod, orbitalRadius, texturePath, hasRings = false, hasLight = false) {
    super();
    this.radius = radius;
    this.spinPeriod = spinPeriod;
    this.orbitalPeriod = orbitalPeriod;
    this.orbitalRadius = orbitalRadius;
    this.texturePath = texturePath;
    this.hasRings = hasRings;
    this.hasLight = hasLight;

    this._generateMaterial();
    this._generateGeometry();
    this._buildObject();
    this._buildAndAddRings();

    this.add(this.astro);
    this.orbitersGroup = new THREE.Group();
    this.add(this.orbitersGroup);
  }

  _generateMaterial() {
    const texture = new THREE.TextureLoader().load(this.texturePath);
    if (this.hasLight) {
      this.material = new THREE.MeshBasicMaterial({map: texture});
    }
    else {
      this.material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture, side: THREE.DoubleSide });
    }
  }

  _generateGeometry() {
    this.geometry = new THREE.SphereGeometry(this.radius, 10, 10);
  }

  _buildObject() {
    this.astro = new THREE.Mesh(this.geometry, this.material);
    if (this.hasLight) {
      this.light = new THREE.PointLight(0xffffff, 1, 0);
      this.astro.add(this.light);
    }
  }

  _buildAndAddRings() {
    if (this.hasRings) {
      const inner = this.radius + Astro.RING_INNER_OFFSET;
      const outer = this.radius + Astro.RING_OUTER_OFFSET;
      const geometry = new THREE.RingGeometry(inner, outer, 32);
      const material = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotateX(º2r(70));
      this.astro.add(ring);
    }
  }

  _buildOrbitObject(astro) {
    const geometry = new THREE.RingGeometry(astro.orbitalRadius - Astro.ORBIT_WIDTH / 2, astro.orbitalRadius + Astro.ORBIT_WIDTH / 2, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(geometry, material);
    ring.rotateX(º2r(90));
    this.add(ring);
  }

  addOrbiter(astro) {
    this._buildOrbitObject(astro);
    const group = new THREE.Group();
    group.add(astro);
    astro.position.set(astro.orbitalRadius || 0, 0, 0);
    this.orbitersGroup.add(group);
  }

  animationLoop(_, timeDifference) {
    if (this.spinPeriod != 0) {
      this.astro.rotateY(timeDifference / 1000 / this.spinPeriod * 2 * Math.PI);
    }
    for (let orbiter of this.orbitersGroup.children) {
      if (orbiter.children[0].orbitalPeriod) {
        orbiter.rotateY(timeDifference / 1000 / orbiter.children[0].orbitalPeriod * 2 * Math.PI);
      }
      orbiter.children[0].animationLoop(...arguments);
    }
  }
}