// Ссылка на элемент веб страницы в котором будет отображаться графика
var container;
// Переменные "камера", "сцена" и "отрисовщик"
var camera, scene, renderer;

// Создание структуры дляхранения вершин
var geometry = new THREE.Geometry();

var N = 3;
var T = ((N-1)*2)*(N-1);



init();
animate();

// В этой функции можно добавлять объекты и выполнять их первичную настройку
function init()
{
// Получение ссылки на элемент html страницы
container = document.getElementById( 'container' );
// Создание "сцены"
scene = new THREE.Scene();
// Установка параметров камеры
// 45 - угол обзора
// window.innerWidth / window.innerHeight - соотношение сторон
// 1 - 4000 - ближняя и дальняя плоскости отсечения
camera = new THREE.PerspectiveCamera(
45, window.innerWidth / window.innerHeight, 1, 4000 );

// Установка позиции камеры
camera.position.set(N/2, N*2, N/2);

// Установка точки, на которую камера будет смотреть
camera.lookAt(new THREE.Vector3(  N/2, 0.0, N/2));


// Создание отрисовщика
renderer = new THREE.WebGLRenderer( { antialias: false } );
renderer.setSize( window.innerWidth, window.innerHeight );
// Закрашивание экрана синим цветом, заданным в 16ричной системе
renderer.setClearColor( 0x0000FF, 1);
container.appendChild( renderer.domElement );
// Добавление функции обработки события изменения размеров окна
window.addEventListener( 'resize', onWindowResize, false );

addG();
}


function onWindowResize()
{
// Изменение соотношения сторон для виртуальной камеры
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
// Изменение соотношения сторон рендера
renderer.setSize( window.innerWidth, window.innerHeight );
}


// В этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate()
{
// Добавление функции на вызов, при перерисовки браузером страницы
requestAnimationFrame( animate );
render();
}


function render()
{
// Рисованиекадра
renderer.render( scene, camera );
}

function addG()
{
for (var j = 0; j < N; j++)
for (var i = 0; i < N; i++) {

geometry.vertices.push(new THREE.Vector3(  i, 0.0, j));
}


for (var j = 0; j < N-1; j++)
for (var i = 0; i < N-1; i++)
{
var i1 = i + j*N;
var i2 = (i+1) + j*N;
var i3 = i + (j+1)*N;
var i4 = (i+1) + (j+1)*N;

geometry.faces.push(new THREE.Face3(i1, i2, i3));
geometry.faces.push(new THREE.Face3(i2, i3, i4));
}



var triangleMaterial = new THREE.MeshBasicMaterial({
// vertexColors:THREE.NoColors,
wireframe: true,
side:THREE.DoubleSide
});

var triangleMesh = new THREE.Mesh(geometry, triangleMaterial);
triangleMesh.position.set(0.0, 0.0, 0.0);

scene.add(triangleMesh);
console.log(triangleMesh);

}