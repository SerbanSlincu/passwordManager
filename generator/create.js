var scene, camera, renderer, controls;

var width = 640*2;
var height = 320*2;

// function to initialise the scene, camera and renderer

function initialise(){

	//initialise the scene
	scene = new THREE.Scene();

	//initialise and add the camera to the scene
	camera = new THREE.PerspectiveCamera(75, width/height, 1, 5000 );
	camera.position.z = 418;
	scene.add( camera );

	//initialise the renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild( renderer.domElement );

}

//function to generate a random color from a set

function getRandomColorFromSet() {
	
	var colors = [0xffff00, 0xffffff, 0x000000, 0xff0000, 0x66ff00, 0x0066ff];
	var color = colors[Math.floor(Math.random()*6)];
	return color;
}

//function to generate a random color without white

function getRandomColor() {

	var color = "#ffffff";

	while(color == "#ffffff") {
		var letters = '0123456789ABCDEF';
		color = '#';
		for (var i = 0; i < 6; i++) {
	   		color += letters[Math.floor(Math.random() * 16)];
		}
	}
	return color;
}


//the value by which we increase x and y 
var valx = width / 64;
var valy = height / 32;

//function to add the first square

function defineRectangle(x, y){

	//create the geometry to contain the vertices
	var geometry = new THREE.Geometry();

	//generate the vertices for the first triangle
	var v1 = new THREE.Vector3(x, y, 0);
	var v2 = new THREE.Vector3(x, y + valy, 0);
	var v3 = new THREE.Vector3(x + valx, y + valy, 0);
	var v4 = new THREE.Vector3(x + valx, y, 0);

	geometry.vertices.push(v1);
	geometry.vertices.push(v2);
	geometry.vertices.push(v3);
	geometry.vertices.push(v4);

	//generate and add the faces
	var face1 = new THREE.Face3(0,2,1);
	var face2 = new THREE.Face3(0,3,2);
	geometry.faces.push(face1);
	geometry.faces.push(face2);
	geometry.computeFaceNormals();

	return geometry;
}

var colors = [];

function getColorPoint(point) {
	return colors[point.x + point.y];
}

// function to draw the triangles on a canvas

function rectangles() {

	var rect = [];

	//the values determining the position of the rectangle; z will be 0
	var x = -width / 2;
	var y = -height / 2;
	
	while(y < height / 2){
		
		//add two triangles at a time to the scene
		var square = (defineRectangle(x,y));

		var getColor = getRandomColor();
		var material1 = new THREE.MeshBasicMaterial({color : getColor});

		colors = colors.concat([getColor]);

		var mesh1 = new THREE.Mesh( square, material1 );

		x = x + valx;
		if(x >= width / 2){
			x = -width / 2;
			y = y + valy;
		}

		var edges = new THREE.EdgesHelper(mesh1, 0x000000);
		edges.material.linewidth = 1.5;

		rect = rect.concat([mesh1, edges]);
	}

	return rect;
	
}

//function to add the circles to the scene

function circles(){

	var circ = [];

	//the values determining the position of the circle
	var circlex = -width / 2 + width / 8;
	var circley = -height / 2 + height / 4;
	var valCy = width / 4;
	var valCx = height / 2;

	while(circley < height / 2){

		//add the big circle to the scene
		var bigCircle = new THREE.RingGeometry(width / 8 - 4, width / 8, 1024);
		var materialBig = new THREE.MeshBasicMaterial({color : 0x000000});

		var bigCircleMesh = new THREE.Mesh( bigCircle, materialBig );
		bigCircleMesh.applyMatrix( new THREE.Matrix4().makeTranslation(circlex, circley, 0) );

		//add the small circle to the scene
		var smallCircle = new THREE.RingGeometry(width / 16 - 4, width / 16, 1024);
		var materialSmall = new THREE.MeshBasicMaterial({color : 0x000000});

		var smallCircleMesh = new THREE.Mesh( smallCircle, materialSmall );
		smallCircleMesh.applyMatrix( new THREE.Matrix4().makeTranslation(circlex, circley, 0) );
		
		circlex = circlex + valCx;
		if(circlex > width / 2){

			circlex = -width / 2 + width / 8;
			circley = circley + valCy;
		}

		circ = circ.concat([bigCircleMesh, smallCircleMesh]);
	}

	return circ;
}

initialise();

var objects = rectangles().concat(circles());
for(var object = 0; object < objects.length; object ++){
	scene.add(objects[object]);
}


//function to randomly choose 5 points in the grid

function choosePoints(){

	var points = [];

	for(i = 0; i < 5; i ++){

		var point = new THREE.Vector2();
		randomX = Math.random() * 64;
		randomY = Math.random() * 32;
		point.x = Math.floor(randomX * 20 - 640);
		point.x = point.x - point.x % (width / 64);
		point.y = Math.floor(randomY * 20 - 320);
		point.y = point.y - point.y % (height / 32);

		console.log(point.x + "  " + point.y);
		console.log();

		points = points.concat([point]);
	}

	return points;

}

//function to highlight the points chosen

function highlight(points){

	for(i = 0; i < 5; i ++){

		var square = defineRectangle(points[i].x, points[i].y);
		var material = new THREE.MeshBasicMaterial({color : getColorPoint(points[i])});

		var mesh = new THREE.Mesh( square, material );

		var edges = new THREE.EdgesHelper(mesh, 0xffffff);
		edges.material.linewidth = 4;

		scene.add( mesh, edges );
	}
}

var clickedPoints = [];
var chosenPoints = [];
counter = 0;
	
function testing() {
	if(clickedPoints.length == 5) {
		if(rightPoints()) counter += 1;
		clickedPoints = [];
	}
}

function cmp(a, b) {
	if(a.x == b.x)
		return a.y < b.y;
	return a.x < b.x;
}

function rightPoints() {

    console.log("here");
	clickedPoints.sort(cmp);
	chosenPoints.sort(cmp);

	i = 0;
	while(i < 5) {
		if(chosenPoints[i].x != clickedPoints[i].x && chosenPoints[i].y != clickedPoints[i].y) {
            console.log("wrong points")
			return false;
		}
		i += 1;
	}

    console.log("one time passed!");
	return true;
}


var my_canvas= renderer.domElement;
var gctx=my_canvas.getContext("2d");

//add a listener to record the mouse clicks
my_canvas.addEventListener("mousedown", mousedown_event, false);

//function to get coordinates of mouse clicks

first = true;

function mousedown_event(e) {

	if(first) {
		chosenPoints = choosePoints();
		highlight(chosenPoints);

		first = false;
		return;
	}

	var rect = my_canvas.getBoundingClientRect();
	var point = new THREE.Vector2();

    point.x = e.clientX - 650;
    point.y = 330 - e.clientY;

    while(Math.abs(point.x) % 20 != 0) point.x -= 1;
    while(Math.abs(point.y) % 20 != 0) point.y -= 1;

    //console.log("mousedown X= " + point.x + ", Y=" + point.y);
    clickedPoints = clickedPoints.concat([point]);
}
//function to render the scene

once = true;

function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
	
	if(!first && counter < 5) {
		testing();
	}
	else if(counter == 5 && once) {
        once = false;
        
        console.log("5 times passed!!!");

        text = "";
        for(i = 0; i < 5; i ++)
            text += chosenPoints[i].x + " " + chosenPoints[i].y + ";";

        filename = "temporary";
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
	}
}

animate();
