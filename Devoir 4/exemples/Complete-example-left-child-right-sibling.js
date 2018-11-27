//  This program was developped by Daniel Audet as an example 
//  to illustrate how to use a left-child right-sibling structure 
//  to organize a graphic program.
//
//  The program includes a skybox and a teapot on which environmental
//  mapping is applied. The other objects (beach balls and cubes) are
//  shaded using the modified Phong model.
//
//  It uses the "MV.js" library developped for the book 
//  "Interactive Computer Graphics" written by Edward Angel and Dave Shreiner.
//

"use strict";

var gl;   // The webgl context.

var a_coordsmapLoc;      // Location of the attribute variables in the environment mapping shader program.
var a_normalmapLoc;

var u_projectionmapLoc;     // Location of the uniform variables in the environment mapping shader program.
var u_modelviewmapLoc;
var u_normalmatrixmapLoc;
var u_minvmapLoc;
var u_skyboxmapLoc;

var a_coordsLoc;       // Location of the coords attribute variable in the standard texture mappping shader program.
var a_normalLoc;
var a_texcoordLoc;

var u_projectionLoc;     // Location of the uniform variables in the standard texture mappping shader program.
var u_modelviewLoc;
var u_normalmatrixLoc;
var u_textureLoc;
var u_ambientProductLoc;
var u_diffuseProductLoc;
var u_specularProductLoc;
var u_shininessLoc;
var u_lightPositionLoc;
		
var a_coordsboxLoc;     // Location of the coords attribute variable in the shader program used for texturing the environment box.
var a_normalboxLoc;
var a_texcoordboxLoc;

var u_modelviewboxLoc;
var u_projectionboxLoc;
var u_skyboxLoc;

var projection;   //--- projection matrix
var modelview;    // modelview matrix
var localmodelview;   // local modelview matrix used by the render methods
var flattenedmodelview;    //--- flattened modelview matrix

var minv = mat3();  // matrix inverse of modelview

var normalmatrix = mat3();  //--- create a 3X3 matrix that will affect normals

var rotator;   // A SimpleRotator object to enable rotation by mouse dragging.

var texIDmap0;  // environmental texture identifier
var texID1, texID2, texID3, texID4;  // standard texture identifiers

var skybox, base, bigBeachBall, mediumBeachBall, smallBeachBall, greenCube, teapot;  // model identifiers

var numNodes = 9;  // number of model identifiers
var figure = [];  // array containing the structure

var baseId = 0;
var bigBeachBallId  = 1;
var mediumBeachBallId = 2;
var smallBeachBallId = 3;
var greenCubeId = 4;
var skyboxId = 5;
var teapotId = 6;

var baseHeight = 5.0;             // the height of the box
var bigBeachBallHeight = 10.0;    // the diameter of the bigBeachBall
var mediumBeachBallHeight = 6.0;  // the diameter of the mediumBeachBall
var smallBeachBallHeight = 3.0;   // the diameter of the smallBeachBall
var greenCubeHeight = 2.0; 
var skyboxHeight = 1000.0;

var prog, progmap, progbox;  // shader program identifiers

var lightPosition = vec4(50.0, 40.0, 10.0, 1.0);

var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.35, 0.35, 0.35, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialShininess = 100.0;


var ambientProduct, diffuseProduct, specularProduct;

var rotX = 0, rotY = 0;  // Additional rotations applied as modeling transform to the teapot.

var textureCounter = 0;
var img = new Array(6);

var stack = [];

var theta = [];

var ntextures_tobeloaded = 0, ntextures_loaded = 0;
	

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

		for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);
		
		for( var i=0; i<numNodes; i++){
			theta[i] = 0.0;
			initNodes(i);
		}
		
		
		
        // LOAD FIRST SHADER  (environmental mapping)
        var vertexShaderSourcemap = getTextContent("vshadermap");
        var fragmentShaderSourcemap = getTextContent("fshadermap");
        progmap = createProgram(gl, vertexShaderSourcemap, fragmentShaderSourcemap);

        gl.useProgram(progmap);

        // locate variables for further use
        a_coordsmapLoc = gl.getAttribLocation(progmap, "vcoords");
        a_normalmapLoc = gl.getAttribLocation(progmap, "vnormal");

        u_modelviewmapLoc = gl.getUniformLocation(progmap, "modelview");
        u_projectionmapLoc = gl.getUniformLocation(progmap, "projection");
        u_normalmatrixmapLoc = gl.getUniformLocation(progmap, "normalMatrix");
        u_minvmapLoc = gl.getUniformLocation(progmap, "minv");

        u_skyboxmapLoc = gl.getUniformLocation(progmap, "skybox");

		
		
        // LOAD SECOND SHADER (standard texture mapping)
        var vertexShaderSource = getTextContent("vshader");
        var fragmentShaderSource = getTextContent("fshader");
        prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(prog);

        // locate variables for further use
        a_coordsLoc = gl.getAttribLocation(prog, "vcoords");
        a_normalLoc = gl.getAttribLocation(prog, "vnormal");
        a_texcoordLoc = gl.getAttribLocation(prog, "vtexcoord");

        u_modelviewLoc = gl.getUniformLocation(prog, "modelview");
        u_projectionLoc = gl.getUniformLocation(prog, "projection");
        u_normalmatrixLoc = gl.getUniformLocation(prog, "normalMatrix");

        u_textureLoc = gl.getUniformLocation(prog, "texture");
		
		u_ambientProductLoc = gl.getUniformLocation(prog, "ambientProduct");
        u_diffuseProductLoc = gl.getUniformLocation(prog, "diffuseProduct");
        u_specularProductLoc = gl.getUniformLocation(prog, "specularProduct");
        u_shininessLoc = gl.getUniformLocation(prog, "shininess");
		u_lightPositionLoc = gl.getUniformLocation(prog, "lightPosition");
		


        // LOAD THIRD SHADER (for the skybox)
        var vertexShaderSource = getTextContent("vshaderbox");
        var fragmentShaderSource = getTextContent("fshaderbox");
        progbox = createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(progbox);

        a_coordsboxLoc = gl.getAttribLocation(progbox, "vcoords");
        a_normalboxLoc = gl.getAttribLocation(progbox, "vnormal");
        a_texcoordboxLoc = gl.getAttribLocation(progbox, "vtexcoord");

        u_modelviewboxLoc = gl.getUniformLocation(progbox, "modelview");
        u_projectionboxLoc = gl.getUniformLocation(progbox, "projection");

        u_skyboxLoc = gl.getUniformLocation(progbox, "skybox");

		
		
        gl.enable(gl.DEPTH_TEST);

		// start texture loading
        initTexture();

        //  create a "rotator" monitoring mouse mouvement
        // rotator = new SimpleRotator(canvas, render);  // this calls render() when the mouse moves
		rotator = new SimpleRotator(canvas, null);  // this does not call render() when the mouse moves
		
        //  set initial camera position at z=40, with an "up" vector aligne with y axis
        //   (this defines the initial value of the modelview matrix )
        rotator.setView([0, 0, 1], [0, 1, 0], 40);

		
        // You can create basic models using the following lines

        teapot = createModelmap(teapotModel);
		
        //        model = createModel(ring(5.0, 10.0, 25.0));
        bigBeachBall = createModel(uvSphere(bigBeachBallHeight/2., 25.0, 25.0));
		mediumBeachBall = createModel(uvSphere(mediumBeachBallHeight/2., 25.0, 25.0));
		smallBeachBall = createModel(uvSphere(smallBeachBallHeight/2., 25.0, 25.0));
		//        model = uvHemisphereOutside(radius, slices, stacks); 
		//        model = uvHemisphereInside(radius, slices, stacks); 
		//        model = uvQuartersphereOutside(radius, slices, stacks); 
		//        model = uvQuartersphereInside(radius, slices, stacks); 
        //        model = createModel(uvTorus(outerRadius, innerRadius, slices, stacks));
        //        model = createModel(uvCylinder(radius, height, slices, noTop, noBottom));
        //        model = createModel(uvCone(radius, height, slices, noBottom));
        base = createModel(cube(baseHeight));
		greenCube = createModel(cube(greenCubeHeight));
        skybox = createModelbox(cube(skyboxHeight));


    }
    catch (e) {
        document.getElementById("message").innerHTML =
             "Could not initialize WebGL: " + e;
        return;
    }

    document.addEventListener("keydown", doKey, false);  // add a callback function (when a key is pressed)

    setInterval(render, 50);   // call render function every 50 milliseconds 

}


function render() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projection = perspective(60.0, 1.0, 1.0, 2000.0);

    //--- Get the rotation matrix obtained by the displacement of the mouse
    //---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);
	modelview = mult(modelview, translate(0.0, 0.0, -10.0));

    if (ntextures_loaded == ntextures_tobeloaded) {  // if texture images have been loaded
	
	// The big beachballs will rotate. This will affect the medium and the small beachballs 
    //    since they are linked (as "child") in data structure.
    // The green cube should rotate also but we will apply a counterclockwise rotation so it 
    //    should not move (it will rotate in the opposite direction of the 3 beachballs)
    // The teapot will not be affected because it is a "sibling" of the skybox (the skybox is a "sibling" of the base).
	
		theta[bigBeachBallId] += 5.0;
		var	m = rotate(theta[bigBeachBallId], 0, 1, 0 );
		m = mult(m, translate(0, (baseHeight/2.)+(bigBeachBallHeight/2.), 0));    // positions the object relative to the base part
        figure[bigBeachBallId].transform = m;

		m = rotate(-theta[bigBeachBallId], 0, 1, 0 );
		m = mult( m, translate(0, (smallBeachBallHeight/2.)+(greenCubeHeight/2.0), 0));  // positions the object relative to the small beach ball  
		figure[greenCubeId].transform = m;
			
		traverse(baseId);
    }

}


function traverse(Id) {
   
   if(Id == null) return; 
   stack.push(modelview);
   modelview = mult(modelview, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child); 
   modelview = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
}

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();
    
    switch(Id) {
    
		case baseId:
			// positions the object in the scene
			m = mult(m, rotate(0.0, 0, 1, 0 ));   
			// create a node
			figure[baseId] = createNode( m, base, skyboxId, bigBeachBallId );
		break;

		case bigBeachBallId:
			// positions the object relative to the base part
			m = rotate(0.0, 0, 1, 0 );
			m = mult(m, translate(0, (baseHeight/2.)+(bigBeachBallHeight/2.), 0));
			// create a node
			figure[bigBeachBallId] = createNode( m, bigBeachBall, null, mediumBeachBallId );
		break;
		
		case mediumBeachBallId:
			// positions the object relative to the bigBeachBall part		
			m = rotate(0.0, 0, 1, 0 );
			m = mult(m, translate(0, (bigBeachBallHeight/2.)+(mediumBeachBallHeight/2.), 0));    
			// create a node
			figure[mediumBeachBallId] = createNode( m, mediumBeachBall, null, smallBeachBallId );
		break;
		
		case smallBeachBallId:
			// positions the object relative to the mediumBeachBall part
			m = rotate(0.0, 0, 1, 0 );
			m = mult(m, translate(0, (mediumBeachBallHeight/2)+(smallBeachBallHeight/2.), 0));    
			// create a node
			figure[smallBeachBallId] = createNode( m, smallBeachBall, null, greenCubeId );
		break;
		
		case greenCubeId:
			// positions the object relative to the smallBeachBall part
			m = rotate(0.0, 0, 1, 0 );
			m = mult( m, translate(0, (smallBeachBallHeight/2.)+(greenCubeHeight/2.0), 0));    
			// create a node
			figure[greenCubeId] = createNode( m, greenCube, null, null );
		break;

		case skyboxId:
			// positions the object in the scene
			m = rotate(0.0, 0, 1, 0 );   
			// create a node
			figure[skyboxId] = createNode( m, skybox, teapotId, null );
		break;		

		case teapotId:
			// positions the object in the scene
			m = translate(20., 0., 0.);
			m = mult(m, rotate(0.0, 0, 1, 0 ));   
			// create a node
			figure[teapotId] = createNode( m, teapot, null, null );
		break;	
		}
}


function base() {

	    // select shaders
	    gl.useProgram(prog);
		
		ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);
		
		gl.uniform4fv(u_ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(u_diffuseProductLoc, flatten(diffuseProduct));
        gl.uniform4fv(u_specularProductLoc, flatten(specularProduct));
        gl.uniform1f(u_shininessLoc, materialShininess);

        gl.uniform4fv(u_lightPositionLoc, flatten(lightPosition));

        gl.uniformMatrix4fv(u_projectionLoc, false, flatten(projection));  // send projection matrix to the new shader program

        gl.enableVertexAttribArray(a_coordsLoc);
        gl.enableVertexAttribArray(a_normalLoc);
        gl.enableVertexAttribArray(a_texcoordLoc);

	    // associate texture image to "texture unit" 2
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, texID2);

        // Send texture number to sampler
        gl.uniform1i(u_textureLoc, 2);

        normalmatrix = extractnormalmatrix(modelview);  // always extract normalmatrix before scaling
		localmodelview = modelview; // create a local modelview matrix to be used by base.render()

        base.render();
}

function bigBeachBall() {

	    // select shaders
	    gl.useProgram(prog);
		
		ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);
		
		gl.uniform4fv(u_ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(u_diffuseProductLoc, flatten(diffuseProduct));
        gl.uniform4fv(u_specularProductLoc, flatten(specularProduct));
        gl.uniform1f(u_shininessLoc, materialShininess);

        gl.uniform4fv(u_lightPositionLoc, flatten(lightPosition));

        gl.uniformMatrix4fv(u_projectionLoc, false, flatten(projection));  // send projection matrix to the new shader program

        gl.enableVertexAttribArray(a_coordsLoc);
        gl.enableVertexAttribArray(a_normalLoc);
        gl.enableVertexAttribArray(a_texcoordLoc);

	    // associate texture image to "texture unit" 1
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texID1);

        // Send texture number to sampler
        gl.uniform1i(u_textureLoc, 1);

        normalmatrix = extractnormalmatrix(modelview);  // always extract normalmatrix before scaling
		localmodelview = mult(modelview, scale(1.0, 1.0, 1.0)); // create a local modelview matrix to be used by bigBeachBall.render()

        bigBeachBall.render();

}

function mediumBeachBall() {

	    // select shaders
	    gl.useProgram(prog);
		
		ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);
		
		gl.uniform4fv(u_ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(u_diffuseProductLoc, flatten(diffuseProduct));
        gl.uniform4fv(u_specularProductLoc, flatten(specularProduct));
        gl.uniform1f(u_shininessLoc, materialShininess);

        gl.uniform4fv(u_lightPositionLoc, flatten(lightPosition));

        gl.uniformMatrix4fv(u_projectionLoc, false, flatten(projection));  // send projection matrix to the new shader program

        gl.enableVertexAttribArray(a_coordsLoc);
        gl.enableVertexAttribArray(a_normalLoc);
        gl.enableVertexAttribArray(a_texcoordLoc);

	    // associate texture image to "texture unit" 1
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texID1);

        // Send texture number to sampler
        gl.uniform1i(u_textureLoc, 1);

        normalmatrix = extractnormalmatrix(modelview);  // always extract normalmatrix before scaling
		localmodelview = mult(modelview, scale(1.0, 1.0, 1.0)); // create a local modelview matrix to be used by mediumBeachBall.render()

        mediumBeachBall.render();
}

function smallBeachBall() {

	    // select shaders
	    gl.useProgram(prog);
		
		ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);
		
		gl.uniform4fv(u_ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(u_diffuseProductLoc, flatten(diffuseProduct));
        gl.uniform4fv(u_specularProductLoc, flatten(specularProduct));
        gl.uniform1f(u_shininessLoc, materialShininess);

        gl.uniform4fv(u_lightPositionLoc, flatten(lightPosition));

        gl.uniformMatrix4fv(u_projectionLoc, false, flatten(projection));  // send projection matrix to the new shader program

        gl.enableVertexAttribArray(a_coordsLoc);
        gl.enableVertexAttribArray(a_normalLoc);
        gl.enableVertexAttribArray(a_texcoordLoc);

	    // associate texture image to "texture unit" 1
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texID1);

        // Send texture number to sampler
        gl.uniform1i(u_textureLoc, 1);

        normalmatrix = extractnormalmatrix(modelview);  // always extract normalmatrix before scaling
		localmodelview = mult(modelview, scale(1.0, 1.0, 1.0)); // create a local modelview matrix to be used by smallBeachBall.render()

        smallBeachBall.render();
}

function greenCube() {

	    // select shaders
	    gl.useProgram(prog);
		
		ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);
		
		gl.uniform4fv(u_ambientProductLoc, flatten(ambientProduct));
        gl.uniform4fv(u_diffuseProductLoc, flatten(diffuseProduct));
        gl.uniform4fv(u_specularProductLoc, flatten(specularProduct));
        gl.uniform1f(u_shininessLoc, materialShininess);

        gl.uniform4fv(u_lightPositionLoc, flatten(lightPosition));

        gl.uniformMatrix4fv(u_projectionLoc, false, flatten(projection));  // send projection matrix to the new shader program

        gl.enableVertexAttribArray(a_coordsLoc);
        gl.enableVertexAttribArray(a_normalLoc);
        gl.enableVertexAttribArray(a_texcoordLoc);

	    // associate texture image to "texture unit" 3
		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, texID3);

        // Send texture number to sampler
        gl.uniform1i(u_textureLoc, 3);

        normalmatrix = extractnormalmatrix(modelview);  // always extract normalmatrix before scaling
		localmodelview = mult(modelview, scale(1.0, 1.0, 1.0)); // create a local modelview matrix to be used by greenCube.render()

        greenCube.render();
}

function skybox() {

	    // select shaders
        gl.useProgram(progbox); // Select the shader program that is used for the environment box.
		
        gl.uniformMatrix4fv(u_projectionboxLoc, false, flatten(projection));  // send projection matrix to the new shader program

        gl.enableVertexAttribArray(a_coordsboxLoc);
        gl.disableVertexAttribArray(a_normalboxLoc);
        gl.disableVertexAttribArray(a_texcoordboxLoc);

	    // associate texture image to "texture unit" 0
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texIDmap0);

        // Send texture number to sampler
        gl.uniform1i(u_skyboxLoc, 0);
		localmodelview = modelview;  // create a local modelview matrix to be used by skybox.render()
		
        skybox.render();
}

function teapot() {

	    // select shaders
        gl.useProgram(progmap); // Select the shader program that is used for the environment box.
		

        gl.uniformMatrix4fv(u_projectionmapLoc, false, flatten(projection));  // send projection matrix to the new shader program

        modelview = mult(modelview, rotate(rotX, 1, 0, 0));
        modelview = mult(modelview, rotate(rotY, 0, 1, 0));

        normalmatrix = extractnormalmatrix(modelview);  // always extract normalmatrix before scaling

        gl.enableVertexAttribArray(a_coordsmapLoc);
        gl.enableVertexAttribArray(a_normalmapLoc);
 		
	    // associate texture image to "texture unit" 0
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texIDmap0);

        // Send texture number to sampler
        gl.uniform1i(u_skyboxmapLoc, 0);

		localmodelview = mult(modelview, scale(0.5, 0.5, 0.5)); // create a local modelview matrix to be used by teapot.render()

        teapot.render();
}


function matrixinvert(matrix) {

    var result = mat3();

    var det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) -
                 matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                 matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);

    var invdet = 1 / det;

    // inverse of matrix m
    result[0][0] = (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) * invdet;
    result[0][1] = (matrix[0][2] * matrix[2][1] - matrix[0][1] * matrix[2][2]) * invdet;
    result[0][2] = (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) * invdet;
    result[1][0] = (matrix[1][2] * matrix[2][0] - matrix[1][0] * matrix[2][2]) * invdet;
    result[1][1] = (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) * invdet;
    result[1][2] = (matrix[1][0] * matrix[0][2] - matrix[0][0] * matrix[1][2]) * invdet;
    result[2][0] = (matrix[1][0] * matrix[2][1] - matrix[2][0] * matrix[1][1]) * invdet;
    result[2][1] = (matrix[2][0] * matrix[0][1] - matrix[0][0] * matrix[2][1]) * invdet;
    result[2][2] = (matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]) * invdet;

    return result;
}

function extractnormalmatrix(matrix) { // This function computes the transpose of the inverse of 
    // the upperleft part (3X3) of the modelview matrix (see http://www.lighthouse3d.com/tutorials/glsl-tutorial/the-normal-matrix/ )

    var result = mat3();
    var upperleft = mat3();
    var tmp = mat3();

    upperleft[0][0] = matrix[0][0];  // if no scaling is performed, one can simply use the upper left
    upperleft[1][0] = matrix[1][0];  // part (3X3) of the modelview matrix
    upperleft[2][0] = matrix[2][0];

    upperleft[0][1] = matrix[0][1];
    upperleft[1][1] = matrix[1][1];
    upperleft[2][1] = matrix[2][1];

    upperleft[0][2] = matrix[0][2];
    upperleft[1][2] = matrix[1][2];
    upperleft[2][2] = matrix[2][2];

    tmp = matrixinvert(upperleft);
    result = transpose(tmp);

    return result;
}

function unflatten(matrix) {
    var result = mat4();
    result[0][0] = matrix[0]; result[1][0] = matrix[1]; result[2][0] = matrix[2]; result[3][0] = matrix[3];
    result[0][1] = matrix[4]; result[1][1] = matrix[5]; result[2][1] = matrix[6]; result[3][1] = matrix[7];
    result[0][2] = matrix[8]; result[1][2] = matrix[9]; result[2][2] = matrix[10]; result[3][2] = matrix[11];
    result[0][3] = matrix[12]; result[1][3] = matrix[13]; result[2][3] = matrix[14]; result[3][3] = matrix[15];

    return result;
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    ntextures_loaded++;

    render();  // Call render function when the image has been loaded (to make sure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}

function handleLoadedTextureMap(texture) {

    textureCounter++;
	ntextures_loaded++;
    if (textureCounter == 6) {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        var targets = [
           gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
           gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
           gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];
        for (var j = 0; j < 6; j++) {
            gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

        render();  // Call render function when the image has been loaded (to make sure the model is displayed)

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}


function initTexture() {

    var urls = [
       "NissiBeach/posx.jpg", "NissiBeach/negx.jpg",
       "NissiBeach/posy.jpg", "NissiBeach/negy.jpg",
       "NissiBeach/posz.jpg", "NissiBeach/negz.jpg"
    ];

    texIDmap0 = gl.createTexture();

    for (var i = 0; i < 6; i++) {
        img[i] = new Image();
        img[i].onload = function () {  // this function is called when the image download is complete

        handleLoadedTextureMap(texIDmap0);
        }
        img[i].src = urls[i];   // this line starts the image downloading thread
	ntextures_tobeloaded++;
	
    }

    texID1 = gl.createTexture();
    texID1.image = new Image();
    texID1.image.onload = function () {
        handleLoadedTexture(texID1)
    }
    texID1.image.src = "beachball.png";
	ntextures_tobeloaded++;

    texID2 = gl.createTexture();
    texID2.image = new Image();
    texID2.image.onload = function () {
        handleLoadedTexture(texID2)
    }
    texID2.image.src = "brick.png";
	ntextures_tobeloaded++;
	
    texID3 = gl.createTexture();
    texID3.image = new Image();
    texID3.image.onload = function () {
        handleLoadedTexture(texID3)
    }
    texID3.image.src = "green-plastic-texture.jpg";
	ntextures_tobeloaded++;
	
}



function createModel(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.textureBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTextureCoords, gl.STATIC_DRAW);

    console.log(modelData.vertexPositions.length);
    console.log(modelData.indices.length);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(a_coordsLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(a_normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(a_texcoordLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(u_modelviewLoc, false, flatten(localmodelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(u_normalmatrixLoc, false, flatten(normalmatrix));  //--- load flattened normal matrix

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
        console.log(this.count);
    }
    return model;
}

function createModelmap(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);

    console.log(modelData.vertexPositions.length);
    console.log(modelData.indices.length);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(a_coordsmapLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(a_normalmapLoc, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(u_modelviewmapLoc, false, flatten(localmodelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(u_normalmatrixmapLoc, false, flatten(normalmatrix));  //--- load flattened normal matrix

        gl.uniformMatrix3fv(u_minvmapLoc, false, flatten(minv));  // send matrix inverse of modelview in order to rotate the skybox

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
        console.log(this.count);
    }
    return model;
}


function createModelbox(modelData) {  // For creating the environment box.
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    console.log(modelData.vertexPositions.length);
    console.log(modelData.indices.length);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(a_coordsboxLoc, 3, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(u_modelviewboxLoc, false, flatten(localmodelview));
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    return model;
}


/**
 *  An event listener for the keydown event.  It is installed by the init() function.
 */
function doKey(evt) {
    var rotationChanged = true;
    switch (evt.keyCode) {
        case 37: rotY -= 0.5; break;        // left arrow
        case 39: rotY += 0.5; break;       // right arrow
        case 38: rotX -= 0.5; break;        // up arrow
        case 40: rotX += 0.5; break;        // down arrow
        case 13: rotX = rotY = 0; break;  // return
        case 36: rotX = rotY = 0; break;  // home
        default: rotationChanged = false;
    }
    if (rotationChanged) {
        evt.preventDefault();
//        render();  // render() is not call when the arrows are pressed
    }
}


function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var vsh = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsh, vertexShaderSource);
    gl.compileShader(vsh);
    if (!gl.getShaderParameter(vsh, gl.COMPILE_STATUS)) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
    }
    var fsh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if (!gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
        throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}


function getTextContent(elementID) {
    var element = document.getElementById(elementID);
    var fsource = "";
    var node = element.firstChild;
    var str = "";
    while (node) {
        if (node.nodeType == 3) // this is a text node
            str += node.textContent;
        node = node.nextSibling;
    }
    return str;
}



