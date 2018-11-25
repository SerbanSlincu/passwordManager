var scene, camera, renderer, controls;

var width = 64*20*window.devicePixelRatio;
var height = 32*20*window.devicePixelRatio;

// function to initialise the scene, camera and renderer


	//initialise the scene
	scene = new THREE.Scene();

	//initialise and add the camera to the scene
	camera = new THREE.PerspectiveCamera(75, width/height, 1, 5000 );
	camera.position.z = 104;
	scene.add( camera );

	//initialise the renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild( renderer.domElement );


//function to generate a random color from a set

function getRandomColorFromSet() {
	
	var colors = [0xffff00, 0xffffff, 0x000000, 0xff0000, 0x66ff00, 0x0066ff];
	var color = colors[Math.floor(Math.random()*6)];
	return color;
}

//function to generate a random color

function getRandomColor() {

	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
   		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}


//the value by which we increase x and y 
var valx = 10*window.devicePixelRatio/2;
var valy = 10*window.devicePixelRatio/2;

//function to add the first triangle

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


// function to draw the triangles on a canvas

function rectangles() {

	var rect = [];

	//the values determining the position of the rectangle; z will be 0
	var x = -320*window.devicePixelRatio;
	var y = -160*window.devicePixelRatio;
	
	while(y < 160*window.devicePixelRatio){

		if(x > 160*window.devicePixelRatio){
			x = -160*window.devicePixelRatio;
			y = y + valy;
		}
		
		//add two triangles at a time to the scene
		var square = (defineRectangle(x,y));

		var material1 = new THREE.MeshBasicMaterial({color : getRandomColor()});

		var mesh1 = new THREE.Mesh( square, material1 );

		x = x + valx;

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
	var circlex = -120*window.devicePixelRatio;
	var circley = -200*window.devicePixelRatio;
	var valCy = 4*20*window.devicePixelRatio;
	var valCx = 4*20*window.devicePixelRatio;

	while(circley < 200*window.devicePixelRatio){

	if(circlex > 120*window.devicePixelRatio){

		circlex = -120*window.devicePixelRatio;
		circley = circley + valCy;
	}

	//add the big circle to the scene
	var bigCircle = new THREE.RingGeometry(2*20*window.devicePixelRatio - 1, 2*20*window.devicePixelRatio, 256);
	var materialBig = new THREE.MeshBasicMaterial({color : 0x000000});

	var bigCircleMesh = new THREE.Mesh( bigCircle, materialBig );
	bigCircleMesh.applyMatrix( new THREE.Matrix4().makeTranslation(circlex, circley, 0) );

	//add the small circle to the scene
	var smallCircle = new THREE.RingGeometry(20*window.devicePixelRatio - 1, 20*window.devicePixelRatio, 256);
	var materialSmall = new THREE.MeshBasicMaterial({color : 0x000000});

	var smallCircleMesh = new THREE.Mesh( smallCircle, materialSmall );
	smallCircleMesh.applyMatrix( new THREE.Matrix4().makeTranslation(circlex, circley, 0) );
	circlex = circlex + valCx;

	circ = circ.concat([bigCircleMesh, smallCircleMesh]);

	}

	return circ;
}

//function to get the square when somebody clicks on it

var objects = rectangles().concat(circles());
for(var object = 0; object < objects.length; object ++){
	scene.add(objects[object]);
}

var my_canvas= renderer.domElement;
var gctx=my_canvas.getContext("2d");

//add a listener to record the mouse clicks
my_canvas.addEventListener("mousedown", mousedown_event, false);


//function to get coordinates of mouse clicks

function mousedown_event(e) {

	var rect = my_canvas.getBoundingClientRect();
	     x1 = e.clientX - rect.left;
	     y1 = e.clientY - rect.top;
	     console.log("mousedown X= " +x1+", Y="+y1);
}

//function to render the scene

function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    
}

animate();
