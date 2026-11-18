import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// =====================================
// Y-TECH RACING - MAIN GAME
// =====================================

async function startGame() {

    const container = document.getElementById('game-container');

    // SCENE
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x91c9ef);
    scene.fog = new THREE.Fog(0x91c9ef, 100, 350);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        600
    );

    camera.position.set(0, 5.5, 12);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // =====================================
    // LIGHTING
    // =====================================

    scene.add(
        new THREE.HemisphereLight(
            0xffffff,
            0x59636b,
            2.2
        )
    );

    const sun = new THREE.DirectionalLight(
        0xffffff,
        2.5
    );

    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);

    scene.add(sun);

    // =====================================
    // MATERIALS
    // =====================================

    const grassMaterial = new THREE.MeshStandardMaterial({
        color: 0x627d54
    });

    const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x292d32,
        roughness: 0.95
    });

    const sidewalkMaterial = new THREE.MeshStandardMaterial({
        color: 0xb9b9b9
    });

    // =====================================
    // GROUND
    // =====================================

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 700),
        grassMaterial
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.15, -250);

    scene.add(ground);

    // =====================================
    // ROAD
    // =====================================

    const road = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 700),
        roadMaterial
    );

    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -250);

    scene.add(road);

    // SIDEWALKS
    for (const x of [-7, 7]) {

        const sidewalk = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.2, 700),
            sidewalkMaterial
        );

        sidewalk.position.set(x, 0, -250);
        scene.add(sidewalk);
    }

    // ROAD EDGE LINES
    for (const x of [-6, 6]) {

        const edge = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.05, 700),
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            })
        );

        edge.position.set(x, 0.08, -250);
        scene.add(edge);
    }

    // ROAD CENTER LINES
    const roadLines = [];

    for (let i = 0; i < 45; i++) {

        const line = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.04, 3),
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            })
        );

        line.position.set(0, 0.08, -i * 15);

        scene.add(line);
        roadLines.push(line);
    }

    // =====================================
    // CITY BUILDINGS
    // =====================================

    const scenery = [];

    function createBuilding(side, z) {

        const group = new THREE.Group();

        const width = 7 + Math.random() * 4;
        const height = 15 + Math.random() * 22;

        const colors = [
            0x9da8b4,
            0x596b80,
            0xc1c1c1,
            0x777b89,
            0x8e9d9e,
            0xb3a18b
        ];
        const material = new THREE.MeshStandardMaterial({
            color: colors[
                Math.floor(Math.random() * colors.length)
            ],
            roughness: 0.6
        });

        const building = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, 13),
            material
        );

        building.position.y = height / 2;
        group.add(building);

        // WINDOWS
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x75b9dc,
            emissive: 0x183b50,
            emissiveIntensity: 0.35,
            metalness: 0.3
        });

        for (let y = 2; y < height - 1; y += 3) {

            for (let zz = -5; zz <= 5; zz += 3) {

                const win = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, 1.3, 1.5),
                    windowMaterial
                );

                win.position.set(
                    -side * (width / 2 + 0.05),
                    y,
                    zz
                );

                group.add(win);
            }
        }

        group.position.set(side * 14, 0, z);

        scene.add(group);
        scenery.push(group);
    }

    // =====================================
    // TREES
    // =====================================

    function createTree(side, z) {

        const tree = new THREE.Group();

        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.22, 0.32, 3, 8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x704522
            })
        );

        trunk.position.y = 1.5;
        tree.add(trunk);

        const leaves = new THREE.Mesh(
            new THREE.SphereGeometry(1.7, 12, 12),
            new THREE.MeshStandardMaterial({
                color: 0x176b31,
                roughness: 0.9
            })
        );

        leaves.position.y = 4;
        tree.add(leaves);

        tree.position.set(side * 8.5, 0, z);

        scene.add(tree);
        scenery.push(tree);
    }

    // =====================================
    // STREET LIGHTS
    // =====================================

    function createStreetLight(side, z) {

        const lamp = new THREE.Group();

        const metal = new THREE.MeshStandardMaterial({
            color: 0x333b45,
            metalness: 0.7
        });

        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.08, 0.12, 7, 8
            ),
            metal
        );

        pole.position.y = 3.5;
        lamp.add(pole);

        const arm = new THREE.Mesh(
            new THREE.BoxGeometry(1.3, 0.12, 0.12),
            metal
        );

        arm.position.set(-side * 0.55, 6.8, 0);
        lamp.add(arm);

        const bulb = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 0.2, 0.4),
            new THREE.MeshStandardMaterial({
                color: 0xfff3c4,
                emissive: 0xffd77a,
                emissiveIntensity: 0.8
            })
        );

        bulb.position.set(-side * 1.1, 6.7, 0);
        lamp.add(bulb);

        lamp.position.set(side * 7.7, 0, z);

        scene.add(lamp);
        scenery.push(lamp);
    }

    // GENERATE CITY
    for (let i = 0; i < 12; i++) {

        const z = -35 - i * 48;

        createBuilding(-1, z);
        createBuilding(1, z - 20);

        createTree(-1, z - 24);
        createTree(1, z - 45);

        createStreetLight(-1, z - 12);
        createStreetLight(1, z - 12);
    }

    // =====================================
    // TOYOTA LAND CRUISER INSPIRED MODEL
    // =====================================

    function createSUV(color) {

        const suv = new THREE.Group();

        const paint = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.4,
            roughness: 0.3
        });

        const glass = new THREE.MeshStandardMaterial({
            color: 0x142b3d,
            metalness: 0.4,
            roughness: 0.15
        });
        const black = new THREE.MeshStandardMaterial({
            color: 0x111111
        });

        const chrome = new THREE.MeshStandardMaterial({
            color: 0xc2c7cc,
            metalness: 0.9,
            roughness: 0.2
        });

        const headlights = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1.5
        });

        const rearLights = new THREE.MeshStandardMaterial({
            color: 0xff1111,
            emissive: 0xff0000,
            emissiveIntensity: 0.8
        });

        function part(w, h, d, material, x, y, z) {

            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(w, h, d),
                material
            );

            mesh.position.set(x, y, z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            suv.add(mesh);

            return mesh;
        }

        // MAIN BODY
        part(2.15, 0.9, 4.1, paint, 0, 0.95, 0);

        // FRONT HOOD
        part(2.05, 0.25, 1.2, paint, 0, 1.5, -1.35);

        // CABIN
        part(1.85, 1.05, 2.2, paint, 0, 1.85, 0.15);

        // ROOF
        part(1.95, 0.14, 2.3, paint, 0, 2.42, 0.15);

        // FRONT WINDSHIELD
        part(1.75, 0.72, 0.08, glass, 0, 1.9, -0.98);

        // REAR WINDOW
        part(1.75, 0.72, 0.08, glass, 0, 1.9, 1.27);

        // SIDE WINDOWS
        for (const side of [-1, 1]) {

            part(
                0.07, 0.72, 1.8,
                glass,
                side * 0.94,
                1.9,
                0.1
            );

            // SIDE MIRRORS
            part(
                0.3, 0.22, 0.35,
                black,
                side * 1.15,
                1.65,
                -1.0
            );

            // DOOR HANDLES
            for (const z of [-0.35, 0.55]) {

                part(
                    0.05, 0.08, 0.3,
                    chrome,
                    side * 1.09,
                    1.1,
                    z
                );
            }

            // RUNNING BOARD
            part(
                0.18, 0.12, 2.3,
                black,
                side * 1.12,
                0.55,
                0.1
            );
        }

        // FRONT GRILLE
        part(1.15, 0.48, 0.08, black, 0, 1.08, -2.08);

        // GRILLE CHROME LINES
        for (let i = 0; i < 4; i++) {

            part(
                1.05, 0.035, 0.04,
                chrome,
                0,
                0.9 + i * 0.12,
                -2.14
            );
        }

        // FRONT BUMPER
        part(2.2, 0.3, 0.2, black, 0, 0.55, -2.1);

        // LIGHTS
        for (const side of [-1, 1]) {

            part(
                0.48, 0.3, 0.12,
                headlights,
                side * 0.78,
                1.48,
                -2.05
            );

            part(
                0.25, 0.18, 0.12,
                headlights,
                side * 0.8,
                0.65,
                -2.15
            );

            part(
                0.3, 0.6, 0.12,
                rearLights,
                side * 0.85,
                1.25,
                2.08
            );
        }

        // REAR BUMPER
        part(2.15, 0.25, 0.2, black, 0, 0.55, 2.1);

        // WHEELS
        suv.userData.wheels = [];

        for (const side of [-1, 1]) {

            for (const z of [-1.35, 1.35]) {

                const wheelGroup = new THREE.Group();

                const tire = new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.52, 0.52, 0.34, 32
                    ),
                    black
                );

                tire.rotation.z = Math.PI / 2;
                wheelGroup.add(tire);

                const rim = new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.29, 0.29, 0.36, 24
                    ),
                    chrome
                );
                rim.rotation.z = Math.PI / 2;
                wheelGroup.add(rim);

                wheelGroup.position.set(
                    side * 1.12,
                    0.55,
                    z
                );

                suv.add(wheelGroup);
                suv.userData.wheels.push(wheelGroup);
            }
        }

        // ROOF RAILS
        for (const side of [-1, 1]) {

            part(
                0.08, 0.12, 1.8,
                chrome,
                side * 0.75,
                2.53,
                0.15
            );
        }

        return suv;
    }

    // =====================================
    // PLAYER CAR
    // =====================================

    const car = createSUV(0xffffff);

    car.position.set(0, 0, 3);

    scene.add(car);

    // =====================================
    // TRAFFIC CARS
    // =====================================

    const traffic = [];

    const trafficColors = [
        0x111111,
        0xffcc00,
        0x00aa88,
        0xcc2222,
        0x888888,
        0xffffff
    ];

    const lanes = [-3.3, 0, 3.3];

    function spawnTraffic(z, lane) {

        const color = trafficColors[
            Math.floor(Math.random() * trafficColors.length)
        ];

        const other = createSUV(color);

        other.position.set(lane, 0, z);

        scene.add(other);
        traffic.push(other);
    }

    spawnTraffic(-100, -3.3);
    spawnTraffic(-180, 3.3);
    spawnTraffic(-260, -3.3);
    spawnTraffic(-340, 3.3);
    spawnTraffic(-420, 0);

    // =====================================
    // GAME VARIABLES
    // =====================================

    let moveLeft = false;
    let moveRight = false;
    let brake = false;
    let nitro = false;

    let speed = 22;
    let score = 0;
    let running = true;

    const normalSpeed = 22;
    const clock = new THREE.Clock();

    // =====================================
    // CONTROL SYSTEM
    // =====================================

    function updateSpeed() {

        if (brake) {
            speed = 10;
        } else if (nitro) {
            speed = 38;
        } else {
            speed = normalSpeed;
        }
    }

    function bindButton(id, callback) {

        const button = document.getElementById(id);

        button.addEventListener('pointerdown', e => {

            e.preventDefault();

            button.setPointerCapture(e.pointerId);

            callback(true);
        });

        button.addEventListener('pointerup', () => {
            callback(false);
        });

        button.addEventListener('pointercancel', () => {
            callback(false);
        });

        button.addEventListener('lostpointercapture', () => {
            callback(false);
        });
    }

    bindButton('left', value => moveLeft = value);
    bindButton('right', value => moveRight = value);

    bindButton('brake', value => {
        brake = value;
        updateSpeed();
    });

    bindButton('nitro', value => {
        nitro = value;
        updateSpeed();
    });

    // KEYBOARD
    window.addEventListener('keydown', e => {

        if (e.key === 'ArrowLeft' || e.key === 'a') {
            moveLeft = true;
        }

        if (e.key === 'ArrowRight' || e.key === 'd') {
            moveRight = true;
        }

        if (e.key === 'ArrowDown') {
            brake = true;
            updateSpeed();
        }

        if (e.code === 'Space') {
            nitro = true;
            updateSpeed();
        }
    });

    window.addEventListener('keyup', e => {

        if (e.key === 'ArrowLeft' || e.key === 'a') {
            moveLeft = false;
        }

        if (e.key === 'ArrowRight' || e.key === 'd') {
            moveRight = false;
        }

        if (e.key === 'ArrowDown') {
            brake = false;
            updateSpeed();
        }

        if (e.code === 'Space') {
            nitro = false;
            updateSpeed();
        }
    });

    // =====================================
    // GAME OVER
    // =====================================
    function gameOver() {

        if (!running) return;

        running = false;

        document.getElementById('final-score').textContent =
            'SCORE: ' + Math.floor(score);

        document.getElementById('game-over').style.display = 'flex';
    }

    document.getElementById('restart').addEventListener(
        'click',
        () => location.reload()
    );

    // =====================================
    // MAIN GAME LOOP
    // =====================================

    function animate() {

        requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.05);

        if (running) {

            // PLAYER STEERING
            if (moveLeft) {
                car.position.x -= 6 * delta;
            }

            if (moveRight) {
                car.position.x += 6 * delta;
            }

            car.position.x = THREE.MathUtils.clamp(
                car.position.x,
                -4.3,
                4.3
            );

            // WHEEL ROTATION
            car.userData.wheels.forEach(wheel => {
                wheel.rotation.x -= speed * delta / 0.52;
            });

            // ROAD LINES
            roadLines.forEach(line => {

                line.position.z += speed * delta;

                if (line.position.z > 5) {
                    line.position.z -= 675;
                }
            });

            // CITY MOVEMENT
            scenery.forEach(object => {

                object.position.z += speed * delta;

                if (object.position.z > 20) {
                    object.position.z -= 600;
                }
            });

            // TRAFFIC MOVEMENT
            traffic.forEach(other => {

                other.position.z += speed * delta * 0.85;

                other.userData.wheels.forEach(wheel => {
                    wheel.rotation.x -= speed * delta / 0.52;
                });

                // RECYCLE TRAFFIC
                if (other.position.z > 12) {

                    other.position.z =
                        -300 - Math.random() * 150;

                    other.position.x =
                        lanes[Math.floor(Math.random() * lanes.length)];

                    score += 100;
                }

                // COLLISION
                const dx = Math.abs(
                    car.position.x - other.position.x
                );

                const dz = Math.abs(
                    car.position.z - other.position.z
                );

                if (dx < 1.9 && dz < 3) {
                    gameOver();
                }
            });

            // SCORE
            score += delta * speed;

            document.getElementById('score').textContent =
                Math.floor(score);

            document.getElementById('speed').textContent =
                Math.floor(speed * 2.5);

            // CAMERA
            camera.position.x += (
                car.position.x * 0.25 - camera.position.x
            ) * Math.min(delta * 3, 1);

            camera.lookAt(car.position.x, 1, -7);
        }

        renderer.render(scene, camera);
    }

    // =====================================
    // RESIZE
    // =====================================

    window.addEventListener('resize', () => {

        camera.aspect =
            window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });

    // START GAME
    document.getElementById('message').style.display = 'none';

    animate();
}

// =====================================
// START AND ERROR HANDLING
// =====================================

startGame().catch(error => {

    console.error(error);

    const message = document.getElementById('message');

    message.style.display = 'block';

    message.textContent =
        'GAME ERROR: ' + error.message;
});