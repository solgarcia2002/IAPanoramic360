/**
 * Created by sol on 05/09/15.
 */
var camera, scene, renderer;
var isUserInteracting = false,
    lon = 0,
    lat = 0,
    phi = 0,
    theta = 0;function init(texture) {
    camera = new THREE.PerspectiveCamera(75, container.parentNode.offsetWidth / container.parentNode.offsetHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    var material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(texture)
    });

    var mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.domElement.setAttribute("id", CONTAINERID);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.parentNode.offsetWidth, container.parentNode.offsetHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
    container.addEventListener('touchstart', touchstart, false);
    container.addEventListener('touchend', touchend, false);
    container.addEventListener('touchmove', touchmove, false);

    document.addEventListener('dragover', function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, false);

    document.addEventListener('dragenter', function () {
        document.body.style.opacity = 0.5;
    }, false);

    document.addEventListener('dragleave', function () {
        document.body.style.opacity = 1;
    }, false);

    document.addEventListener('drop', function (event) {
        event.preventDefault();
        var reader = new FileReader();
        reader.addEventListener('load', function (event) {
            material.map.image.src = event.target.result;
            material.map.needsUpdate = true;
        }, false);
        reader.readAsDataURL(event.dataTransfer.files[0]);
        document.body.style.opacity = 1;
    }, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    isUserInteracting = true;
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
}

function onDocumentMouseMove(event) {
    if (isUserInteracting === true) {
        lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
        lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
    }
}

function onDocumentMouseUp() {
    isUserInteracting = false;
}

function onDocumentMouseWheel(event) {
    camera.fov -= event.wheelDeltaY * 0.05;
    camera.updateProjectionMatrix();
}

function touchstart(event) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.touches[0].screenX;
    onPointerDownPointerY = event.touches[0].screenY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

}


function touchmove(event) {

    if (isUserInteracting === true) {

        lon = ( onPointerDownPointerX - event.touches[0].screenX ) * 0.1 + onPointerDownLon;
        lat = ( event.touches[0].screenY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

    }

}
function touchend() {
    isUserInteracting = false;
}


function animate() {

    requestAnimationFrame(animate);
    update();

}

function update() {

    if (isUserInteracting === false) {
        lon -= 0.03;
    }

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(camera.target);

    renderer.render(scene, camera);

}
