var scene, camera, renderer, controls;

var width = 900;
var height = 900;

// function to initialise the scene, camera and renderer

function initialise() {
    

	//initialise the scene
	scene = new THREE.Scene();

	//initialise and add the camera to the scene
	camera = new THREE.PerspectiveCamera(40, width/height, 1, 1000 );
	camera.position.z = 100;
	scene.add( camera );

	//initialise the renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild( renderer.domElement );
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
var valx = 3;
var valy = 3;

//function to add the first triangle

function define1Triangle(x, y){

		//create the geometry to contain the vertices
		var geometry = new THREE.Geometry();

		//generate the vertices for the first triangle
		var v1 = new THREE.Vector3(x, y, 0);
		var v2 = new THREE.Vector3(x + valx, y, 0);
		var v3 = new THREE.Vector3(x, y + valy, 0);
		geometry.vertices.push(v1);
		geometry.vertices.push(v2);
		geometry.vertices.push(v3);

		//generate and add the faces
		var face1 = new THREE.Face3(0,1,2);
		geometry.faces.push(face1);
		geometry.computeFaceNormals();
		material = new THREE.MeshBasicMaterial({color : getRandomColor()});

		var mesh1 = new THREE.Mesh( geometry, material );

		mesh1.drawMode = THREE.TrianglesDrawMode;

		return mesh1;
}

//function to add the second triangle

function define2Triangle(x, y){

		//create the geometry to contain the vertices
		var geometry = new THREE.Geometry();

		//generate the vertices for the second triangle
		var v1 = new THREE.Vector3(x + valx, y, 0);
		var v2 = new THREE.Vector3(x + valx, y + valy, 0);
		var v3 = new THREE.Vector3(x, y + valy, 0);
		geometry.vertices.push(v1);
		geometry.vertices.push(v2);
		geometry.vertices.push(v3);
	
		//generate and add the faces
		var face2 = new THREE.Face3(0,1,2);
		geometry.faces.push(face2);
		geometry.computeFaceNormals();
		material = new THREE.MeshBasicMaterial({color : getRandomColor()});

		var mesh2 = new THREE.Mesh( geometry, material );

		mesh2.drawMode = THREE.TrianglesDrawMode;

		return mesh2;
}
// function to draw the triangles on a canvas

function triangles() {


	//the values determining the position of the triangle; z will be 0
	var x = -350;
	var y = -350;

	while(y < 350){

		if(x > width){
			x = -350;
			y = y + valy;
		}
		
		//add two triangles at a time to the scene
		scene.add(define1Triangle(x,y));
		scene.add(define2Triangle(x,y));

		x = x + valx;

	}

}


//function to render the scene

function animate() {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    
}

initialise();
triangles();
animate();