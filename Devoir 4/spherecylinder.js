// This program was developped by Daniel Audet and uses the file "basic-objects-IFS.js"
// from http://math.hws.edu/eck/cs424/notes2013/19_GLSL.html
//
//  It has been adapted to be compatible with the "MV.js" library developped
//  for the book "Interactive Computer Graphics" by Edward Angel and Dave Shreiner.
//

"use strict";

var gl;   // The webgl context.

var CoordsLoc;       // Location of the coords attribute variable in the standard texture mappping shader program.
var NormalLoc;
var TexCoordLoc;

var ProjectionLoc;     // Location of the uniform variables in the standard texture mappping shader program.
var ModelviewLoc;
var NormalMatrixLoc;


var projection;   //--- projection matrix
var modelview;    // modelview matrix
var flattenedmodelview;    //--- flattened modelview matrix

var normalMatrix = mat3();  //--- create a 3X3 matrix that will affect normals

var rotator;   // A SimpleRotator object to enable rotation by mouse dragging.

var sphere, cylinder, box, teapot, disk, torus, cone;  // model identifiers
var hemisphereinside, hemisphereoutside, thindisk;
var quartersphereinside, quartersphereoutside;

var prog;  // shader program identifier

var lightPosition = vec4(20.0, 20.0, 100.0, 1.0);

var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.0, 0.1, 0.3, 1.0);
var materialDiffuse = vec4(0.48, 0.55, 0.69, 1.0);
var materialSpecular = vec4(0.48, 0.55, 0.69, 1.0);
var materialShininess = 100.0;

var ambientProduct, diffuseProduct, specularProduct;


function render() {
    gl.clearColor(0.79, 0.76, 0.27, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //--- Get the rotation matrix obtained by the displacement of the mouse
    //---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

	normalMatrix = extractNormalMatrix(modelview);
		
    var initialmodelview = modelview;

    //  now, draw sphere model
    modelview = initialmodelview;
    //modelview = mult(modelview, translate(15.0, 0.0, 0.0));
    //modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    sphere.render();

    //  now, draw sphere model
    modelview = initialmodelview;
    modelview = mult(modelview, translate(0.0, 0.0, 15.0));
    //modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    sphere.render();

    // //  now, draw box model
    // modelview = initialmodelview;
    // modelview = mult(modelview, translate(10.0, 10.0, 0.0));
    // modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    // box.render();
		
    // //  now, draw cylinder model
    // modelview = initialmodelview;
    // modelview = mult(modelview, translate(0.0, 15.0, 0.0));
    // modelview = mult(modelview, rotate(90.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.3, 0.3, 0.3));
    // cylinder.render();

    // //  now, draw cone model
    // modelview = initialmodelview;
    // modelview = mult(modelview, translate(-10.0, 10.0, 0.0));
    // modelview = mult(modelview, rotate(-90.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    // cone.render();
		
    // //  now, draw torus model
    // modelview = initialmodelview;
    // modelview = mult(modelview, translate(-15.0, -2.0, 0.0));
    // modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.3, 0.3, 0.3));
    // torus.render();
		
    // //  now, draw disk model
    // modelview = initialmodelview;
    // modelview = mult(modelview, translate(-8.0, -12.0, 0.0));
    // modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    // disk.render();

	// //  now, draw teapot model
    // modelview = initialmodelview;
    // modelview = mult(modelview, translate(7.0, -11.0, 0.0));
    // modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    // teapot.render();

	//     //  now, draw hemisphere model (with a thin circular rim)
	// 	//      Note that this could be done more elegantly using two sets of shaders
	// 	//         (one for the inside and one for the outside of the same hemisphere)
    // modelview = initialmodelview;
    // modelview = mult(modelview, translate(0.0, 15.0, -15.0));
    // modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    // hemisphereoutside.render();
	// modelview = mult(modelview, scale(0.95, 0.95, 0.95));  // MAKE SURE THE INSIDE IS SMALLER THAN THE OUTSIDE
    // hemisphereinside.render();  // in this model, the normals are inverted
    // modelview = initialmodelview;
    // modelview = mult(modelview, translate(0.0, 15.0, -15.0));
    // modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.5, 0.5, 0.5));
	// thindisk.render();

	//     //  now, draw quartersphere model
 	// 	//      Note that this could be done more elegantly using two sets of shaders
	// 	//         (one for the inside and one for the outside of the same hemisphere)
	// modelview = initialmodelview;
    // modelview = mult(modelview, translate(0.0, 0.0, -15.0));
    // modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    // quartersphereoutside.render();
	// modelview = mult(modelview, scale(0.95, 0.95, 0.95));  // MAKE SURE THE INSIDE IS SMALLER THAN THE OUTSIDE
    // quartersphereinside.render();  // in this model, the normals are inverted

	//     //  now, draw a flattened hemisphere
	// 	//      Note that this could be done more elegantly using two sets of shaders
	// 	//         (one for the inside and one for the outside of the same hemisphere)
    // modelview = initialmodelview;
    // modelview = mult(modelview, translate(0.0, -15.0, -15.0));
    // modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    // normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    // modelview = mult(modelview, scale(0.8, 0.2, 0.5));
    // hemisphereoutside.render();
	// modelview = mult(modelview, scale(0.95, 0.95, 0.95));  // MAKE SURE THE INSIDE IS SMALLER THAN THE OUTSIDE
    // hemisphereinside.render();  // in this model, the normals are inverted


	}





window.onload = function init() {
    try {
        var canvas = document.getElementById("glcanvas");
        gl = canvas.getContext("webgl");
        if (!gl) {
            gl = canvas.getContext("experimental-webgl");
        }
        if (!gl) {
            throw "Could not create WebGL context.";
        }

        // LOAD SHADER (standard texture mapping)
        var vertexShaderSource = getTextContent("vshader");
        var fragmentShaderSource = getTextContent("fshader");
        prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(prog);

        // locate variables for further use
        CoordsLoc = gl.getAttribLocation(prog, "vcoords");
        NormalLoc = gl.getAttribLocation(prog, "vnormal");
        TexCoordLoc = gl.getAttribLocation(prog, "vtexcoord");

        ModelviewLoc = gl.getUniformLocation(prog, "modelview");
        ProjectionLoc = gl.getUniformLocation(prog, "projection");
        NormalMatrixLoc = gl.getUniformLocation(prog, "normalMatrix");

        gl.enableVertexAttribArray(CoordsLoc);
        gl.enableVertexAttribArray(NormalLoc);
		gl.disableVertexAttribArray(TexCoordLoc);  // we do not need texture coordinates

        gl.enable(gl.DEPTH_TEST);

        //  create a "rotator" monitoring mouse mouvement
        rotator = new SimpleRotator(canvas, render);
        //  set initial camera position at z=40, with an "up" vector aligned with y axis
        //   (this defines the initial value of the modelview matrix )
        rotator.setView([0, 0, 1], [0, 1, 0], 40);

        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);
		
		gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
		gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
		gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
		gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess);

		gl.uniform4fv(gl.getUniformLocation(prog, "lightPosition"), flatten(lightPosition));

		projection = perspective(70.0, 1.0, 1.0, 200.0);
		gl.uniformMatrix4fv(ProjectionLoc, false, flatten(projection));  // send projection matrix to the shader program
		
		// In the following lines, we create different "elements" (sphere, cylinder, box, disk,...).
		// These elements are "objects" returned by the "createModel()" function.
		// The "createModel()" function requires one parameter which contains all the information needed
		// to create the "object". The functions "uvSphere()", "uvCylinder()", "cube()",... are described
		// in the file "basic-objects-IFS.js". They return an "object" containing vertices, normals, 
		// texture coordinates and indices.
		// 
		
        sphere = createModel(uvSphere(10.0, 25.0, 25.0));
        cylinder = createModel(uvCylinder(10.0, 20.0, 25.0, false, false));
        box = createModel(cube(10.0));

		teapot = createModel(teapotModel);
        disk = createModel(ring(5.0, 10.0, 25.0));
        torus = createModel(uvTorus(15.0, 5.0, 25.0, 25.0));
        cone = createModel(uvCone(10.0, 20.0, 25.0, true));

		hemisphereinside = createModel(uvHemisphereInside(10.0, 25.0, 25.0));
		hemisphereoutside = createModel(uvHemisphereOutside(10.0, 25.0, 25.0));
        thindisk = createModel(ring(9.5, 10.0, 25.0));

		quartersphereinside = createModel(uvQuartersphereInside(10.0, 25.0, 25.0));
		quartersphereoutside = createModel(uvQuartersphereOutside(10.0, 25.0, 25.0));

		// managing arrow keys (to move up or down the model)
		document.onkeydown = function (e) {
			switch (e.key) {
				case 'Home':
					// resize the canvas to the current window width and height
					resize(canvas);
					break;
			}
		};

    }
    catch (e) {
        document.getElementById("message").innerHTML ="Could not initialize WebGL: " + e;
        return;
    }

	resize(canvas);  // size the canvas to the current window width and height

    render();
}

function resize(canvas) {  // ref. https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
  var realToCSSPixels = window.devicePixelRatio;

  var actualPanelWidth = Math.floor(0.85 * window.innerWidth * realToCSSPixels); // because, in the HTML file, we have set the right panel to be 85% of the window width
  var actualPanelHeight = Math.floor(0.96 * window.innerHeight * realToCSSPixels); 

  var minDimension = Math.min(actualPanelWidth, actualPanelHeight);
    
   // Ajust the canvas to this dimension (square)
    canvas.width  = minDimension;
    canvas.height = minDimension;
	
	gl.viewport(0, 0, canvas.width, canvas.height);

}



