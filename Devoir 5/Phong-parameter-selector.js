// This program was developped by Daniel Audet and uses sections of code  
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

var Kar, Kdr, Ksr, Kag, Kdg, Ksg, Kab, Kdb, Ksb;

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //--- Get the rotation matrix obtained by the displacement of the mouse
    //---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

	normalMatrix = extractNormalMatrix(modelview);
		
    var initialmodelview = modelview;

    //  now, draw sphere model
    modelview = initialmodelview;
    modelview = mult(modelview, translate(15.0, 0.0, 0.0));
    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    sphere.render();

    //  now, draw box model
    modelview = initialmodelview;
    modelview = mult(modelview, translate(10.0, 10.0, 0.0));
    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    box.render();
		
    //  now, draw cylinder model
    modelview = initialmodelview;
    modelview = mult(modelview, translate(0.0, 15.0, 0.0));
    modelview = mult(modelview, rotate(90.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.3, 0.3, 0.3));
    cylinder.render();

    //  now, draw cone model
    modelview = initialmodelview;
    modelview = mult(modelview, translate(-10.0, 10.0, 0.0));
    modelview = mult(modelview, rotate(-90.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    cone.render();
		
    //  now, draw torus model
    modelview = initialmodelview;
    modelview = mult(modelview, translate(-15.0, -2.0, 0.0));
    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.3, 0.3, 0.3));
    torus.render();
		
    //  now, draw disk model
    modelview = initialmodelview;
    modelview = mult(modelview, translate(-8.0, -12.0, 0.0));
    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    disk.render();

	//  now, draw teapot model
    modelview = initialmodelview;
    modelview = mult(modelview, translate(7.0, -11.0, 0.0));
    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    teapot.render();

	    //  now, draw hemisphere model (with a thin circular rim)
		//      Note that this could be done more elegantly using two sets of shaders
		//         (one for the inside and one for the outside of the same hemisphere)
    modelview = initialmodelview;
    modelview = mult(modelview, translate(0.0, 15.0, -15.0));
    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    hemisphereoutside.render();
	modelview = mult(modelview, scale(0.95, 0.95, 0.95));  // MAKE SURE THE INSIDE IS SMALLER THAN THE OUTSIDE
    hemisphereinside.render();  // in this model, the normals are inverted
    modelview = initialmodelview;
    modelview = mult(modelview, translate(0.0, 15.0, -15.0));
    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
	thindisk.render();

	    //  now, draw quartersphere model
 		//      Note that this could be done more elegantly using two sets of shaders
		//         (one for the inside and one for the outside of the same hemisphere)
	modelview = initialmodelview;
    modelview = mult(modelview, translate(0.0, 0.0, -15.0));
    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.5, 0.5, 0.5));
    quartersphereoutside.render();
	modelview = mult(modelview, scale(0.95, 0.95, 0.95));  // MAKE SURE THE INSIDE IS SMALLER THAN THE OUTSIDE
    quartersphereinside.render();  // in this model, the normals are inverted

	    //  now, draw a flattened hemisphere
		//      Note that this could be done more elegantly using two sets of shaders
		//         (one for the inside and one for the outside of the same hemisphere)
    modelview = initialmodelview;
    modelview = mult(modelview, translate(0.0, -15.0, -15.0));
    modelview = mult(modelview, rotate(0.0, 1, 0, 0));
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.8, 0.2, 0.5));
    hemisphereoutside.render();
	modelview = mult(modelview, scale(0.95, 0.95, 0.95));  // MAKE SURE THE INSIDE IS SMALLER THAN THE OUTSIDE
    hemisphereinside.render();  // in this model, the normals are inverted


	}



function unflatten(matrix) {
    var result = mat4();
    result[0][0] = matrix[0]; result[1][0] = matrix[1]; result[2][0] = matrix[2]; result[3][0] = matrix[3];
    result[0][1] = matrix[4]; result[1][1] = matrix[5]; result[2][1] = matrix[6]; result[3][1] = matrix[7];
    result[0][2] = matrix[8]; result[1][2] = matrix[9]; result[2][2] = matrix[10]; result[3][2] = matrix[11];
    result[0][3] = matrix[12]; result[1][3] = matrix[13]; result[2][3] = matrix[14]; result[3][3] = matrix[15];

    return result;
}

function extractNormalMatrix(matrix) { // This function computes the transpose of the inverse of 
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
        gl.vertexAttribPointer(CoordsLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(NormalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(TexCoordLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(ModelviewLoc, false, flatten(modelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(NormalMatrixLoc, false, flatten(normalMatrix));  //--- load flattened normal matrix

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
        console.log(this.count);
    }
    return model;
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
		
		// You can use basic models using the following lines

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

		
        document.getElementById("slider0").onchange = function() {
			materialAmbient[0] = event.srcElement.value;
			ambientProduct = mult(lightAmbient, materialAmbient);
			gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
			Kar.innerHTML = event.srcElement.value;
			render();
			};
        document.getElementById("slider1").onchange = function() {
			materialAmbient[1] = event.srcElement.value;
			ambientProduct = mult(lightAmbient, materialAmbient);
			gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
			Kag.innerHTML = event.srcElement.value;
			render();
			};
        document.getElementById("slider2").onchange = function() {
			materialAmbient[2] = event.srcElement.value;
			ambientProduct = mult(lightAmbient, materialAmbient);
			gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
			Kab.innerHTML = event.srcElement.value;
			render();
			};
        document.getElementById("slider3").onchange = function() {
			materialDiffuse[0] = event.srcElement.value;
			diffuseProduct = mult(lightDiffuse, materialDiffuse);
			gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
			Kdr.innerHTML = event.srcElement.value;
			render();
			};
        document.getElementById("slider4").onchange = function() {
			materialDiffuse[1] = event.srcElement.value;
			diffuseProduct = mult(lightDiffuse, materialDiffuse);
			gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
			Kdg.innerHTML = event.srcElement.value;
			render();
			};
        document.getElementById("slider5").onchange = function() {
			materialDiffuse[2] = event.srcElement.value;
			diffuseProduct = mult(lightDiffuse, materialDiffuse);
			gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
			Kdb.innerHTML = event.srcElement.value;
			render();
			};
        document.getElementById("slider6").onchange = function() {
			materialSpecular[0] = event.srcElement.value;
			specularProduct = mult(lightSpecular, materialSpecular);
			gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
			Ksr.innerHTML = event.srcElement.value;
			render();
			};
        document.getElementById("slider7").onchange = function() {
			materialSpecular[1] = event.srcElement.value;
			specularProduct = mult(lightSpecular, materialSpecular);
			gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
			Ksg.innerHTML = event.srcElement.value;
			render();
			};
        document.getElementById("slider8").onchange = function() {
			materialSpecular[2] = event.srcElement.value;
			specularProduct = mult(lightSpecular, materialSpecular);
			gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
			Ksb.innerHTML = event.srcElement.value;
			render();
			};
        document.getElementById("slider9").onchange = function() {
			materialShininess = event.srcElement.value;
			gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess);
			Shininess.innerHTML = event.srcElement.value;
			render();
			};
			
		Kar = document.getElementById("Kar");
		Kdr = document.getElementById("Kdr");
		Ksr = document.getElementById("Ksr");
		
		Kag = document.getElementById("Kag");
		Kdg = document.getElementById("Kdg");
		Ksg = document.getElementById("Ksg");
		
		Kab = document.getElementById("Kab");
		Kdb = document.getElementById("Kdb");
		Ksb = document.getElementById("Ksb");
		
    }
    catch (e) {
        document.getElementById("message").innerHTML =
             "Could not initialize WebGL: " + e;
        return;
    }

    setInterval(render, 1000);
}



