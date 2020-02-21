// Ссылка на элемент веб страницы в котором будет отображаться графика
var container;
// Переменные "камера", "сцена" и "отрисовщик"
var camera, scene, renderer;
var imagedata;
var sphere;

// Создание структуры дляхранения вершин
var geometry = new THREE.Geometry();

var N = 350;

var spotlight = new THREE.PointLight(0xffffff);

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
    camera.position.set(N/2, N/2, N*2);

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
     
    //addG();

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');


    var img = new Image(); 
    img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0 );
        imagedata = context.getImageData(0, 0, img.width, img.height); 
        CreateTerrain();
    } 
    img.src = 'pics/lake.jpg';  
    
    spotlight.position.set(100, 100, N/2); 
    scene.add(spotlight);

    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
}



function onWindowResize()
{
    // Изменение соотношения сторон для виртуальной камеры
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Изменение соотношения сторон рендера
    renderer.setSize( window.innerWidth, window.innerHeight );
}

var a = 0.0;
// В этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate()
{
    a += 0.01;
    // Добавление функции на вызов, при перерисовки браузером страницы
    requestAnimationFrame( animate );
    render();

    spotlight.position.x = N/2+N*Math.cos(a);
    spotlight.position.y = N*Math.sin(a);

    sphere.position.copy(spotlight.position);


    var x = N/2+2*N*Math.cos(a);
    var z = N/2+2*N*Math.sin(a);

    // Установка позиции камеры
    camera.position.set(x, N/2, z);

    // Установка точки, на которую камера будет смотреть
    camera.lookAt(new THREE.Vector3(  N/2, 0.0, N/2));
}


function render()
{
     
    // Рисованиекадра
    renderer.render( scene, camera );

}

function CreateTerrain()
{
    for (var j = 0; j < N; j++)
    for (var i = 0; i < N; i++) {
        var y = getPixel(imagedata, i,j)/5.0;

        geometry.vertices.push(new THREE.Vector3(  i, y, j));
    }


    for (var j = 0; j < N-1; j++)
    for (var i = 0; i < N-1; i++)
    {
        var i1 = i + j*N;
        var i2 = (i+1) + j*N;
        var i3 = i + (j+1)*N;
        var i4 = (i+1) + (j+1)*N;

        geometry.faces.push(new THREE.Face3(i1, i2, i3));
        geometry.faces.push(new THREE.Face3(i2, i4, i3));


        geometry.faceVertexUvs[0].push([new THREE.Vector2(i/(N-1), j/(N-1)),
            new THREE.Vector2((i+1)/(N-1), j/(N-1)),
            new THREE.Vector2((i)/(N-1), (j+1)/(N-1))]); 

        geometry.faceVertexUvs[0].push([new THREE.Vector2((i+1)/(N-1), j/(N-1)),
            
            new THREE.Vector2((i+1)/(N-1), (j+1)/(N-1)),
            new THREE.Vector2((i)/(N-1), (j+1)/(N-1))
        ]);
    }

    geometry.computeFaceNormals(); 
    geometry.computeVertexNormals(); 

    var loader = new THREE.TextureLoader(); 
    //var tex = loader.load( 'pics/ori.jpg' );
    var tex = loader.load( 'pics/grasstile.jpg' );  

    var mat = new THREE.MeshLambertMaterial({
        map:tex,
        wireframe: false,     
        side:THREE.DoubleSide 
    });  


    // Режим повторения текстуры 
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;  
    // Повторить текстуру 10х10 раз 
    tex.repeat.set( 3, 3 ); 

    var triangleMesh = new THREE.Mesh(geometry, mat);
    triangleMesh.position.set(0.0, 0.0, 0.0);

    scene.add(triangleMesh);
    //console.log(triangleMesh);

}

function getPixel( imagedata, x, y )  {     var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;     return data[ position ];; }

 