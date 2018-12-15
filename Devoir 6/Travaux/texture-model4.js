// This program was developped by Daniel Audet and uses sections of code  
// from http://math.hws.edu/eck/cs424/notes2013/19_GLSL.html
//
//  It has been adapted to be compatible with the "MV.js" library developped
//  for the book "Interactive Computer Graphics" by Edward Angel and Dave Shreiner.
//

"use strict";

var gl;   // The webgl context.

var vcoordsmapLoc;      // Location of the attribute variables in the environment mapping shader program.
var vnormalmapLoc;
var vtexcoordmapLoc;

var projectionmapLoc;     // Location of the uniform variables in the environment mapping shader program.
var modelviewmapLoc;
var normalMatrixmapLoc;
var minvmapLoc;
var skyboxmapLoc;

var vcoordsLoc;       // Location of the coords attribute variable in the standard texture mappping shader program.
var vnormalLoc;
var vtexcoordLoc;

var projectionLoc;     // Location of the uniform variables in the standard texture mappping shader program.
var modelviewLoc;
var normalMatrixLoc;
var textureLoc;
var uInvVT;

var vcoordsboxLoc;     // Location of the coords attribute variable in the shader program used for texturing the environment box.
var vnormalboxLoc;
var vtexcoordboxLoc;

var modelviewboxLoc;
var projectionboxLoc;
var skyboxLoc;

var projection;   //--- projection matrix
var modelview;    // modelview matrix
var flattenedmodelview;    //--- flattened modelview matrix

var Minv = mat3();  // matrix inverse of modelview

var normalMatrix = mat3();  //--- create a 3X3 matrix that will affect normals

var rotator;   // A SimpleRotator object to enable rotation by mouse dragging.

var texIDmap0;  // environmental texture identifier
var texID1, texID2, texID3, texID4;  // standard texture identifiers

var modela, modelb, modelc, modeld, envbox;  // model identifiers

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

var ct = 0;
var img = new Array(6);

var ntextures_tobeloaded=0;
var ntextures_loaded=0;

function render() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projection = perspective(60.0, 1.0, 1.0, 2000.0);

    //--- Get the rotation matrix obtained by the displacement of the mouse
    //---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

    if (ntextures_loaded == ntextures_tobeloaded) {  // if all texture images have been loaded

        var initialmodelview = modelview;

        // Draw the environment (box)
        gl.useProgram(progbox); // Select the shader program that is used for the environment box.

        gl.uniformMatrix4fv(projectionboxLoc, false, flatten(projection));

        gl.enableVertexAttribArray(vcoordsboxLoc);
        gl.disableVertexAttribArray(vnormalboxLoc);     // normals are not used for the box
        gl.disableVertexAttribArray(vtexcoordboxLoc);  // texture coordinates not used for the box

		// associate texture to "texture unit" 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texIDmap0);
        // Send texture number to sampler
        gl.uniform1i(skyboxLoc, 0);
	
        envbox.render();


        //  Draw first model using environmental mapping shader
        gl.useProgram(progmap);

        gl.uniformMatrix4fv(projectionmapLoc, false, flatten(projection)); // send projection matrix to the new shader program

		modelview = initialmodelview;
		
        // Compute the inverse of the modelview matrix
        Minv = matrixinvert(modelview);

        modelview = mult(modelview, rotate(rotX, 1, 0, 0));
        modelview = mult(modelview, rotate(rotY, 0, 1, 0));

        normalMatrix = extractNormalMatrix(modelview);  // always extract normalMatrix before scaling


        gl.enableVertexAttribArray(vcoordsmapLoc);
        gl.enableVertexAttribArray(vnormalmapLoc);
        gl.disableVertexAttribArray(vtexcoordmapLoc);  // texture coordinates not used (environmental mapping)

		// associate texture to "texture unit" 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texIDmap0);
        // Send texture number to sampler
        gl.uniform1i(skyboxmapLoc, 0);

        modela.render();  //  modelview and normalMatrix are sent to the shader in the "render()" method

        //  Now, change shader program to simply paste texture images onto models
        gl.useProgram(prog);

        gl.uniform4fv(gl.getUniformLocation(prog, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(prog, "specularProduct"), flatten(specularProduct));
        gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess);

        gl.uniform4fv(gl.getUniformLocation(prog, "lightPosition"), flatten(lightPosition));

        gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));  // send projection matrix to the new shader program

        gl.enableVertexAttribArray(vcoordsLoc);
        gl.enableVertexAttribArray(vnormalLoc);
        gl.enableVertexAttribArray(vtexcoordLoc);

		// associate texture to "texture unit" 1
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texID1);
        // Send texture number to sampler
        gl.uniform1i(textureLoc, 1);

        //  now, draw second model
		modelview = initialmodelview;
        modelview = mult(modelview, translate(10.0, 7.0, -15.0));
        normalMatrix = extractNormalMatrix(modelview);  // always extract normalMatrix before scaling
        modelview = mult(modelview, scale(0.75, 0.75, 0.75));
        modelb.render();

		// associate texture to "texture unit" 2
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texID2);

        // Send texture number to sampler
        gl.uniform1i(textureLoc, 2);

        //  now, draw third model
        modelview = initialmodelview;
        modelview = mult(modelview, translate(-12.0, 7.0, -10.0));
        normalMatrix = extractNormalMatrix(modelview);  // always extract normalMatrix before scaling
        modelview = mult(modelview, scale(0.75, 0.75, 0.75));
        modelc.render();

		// associate texture to "texture unit" 3
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texID3);
        // Send texture number to sampler
        gl.uniform1i(textureLoc, 3);

        //  now, draw fourth model
        modelview = initialmodelview;
        modelview = mult(modelview, translate(0.0, 20.0, -25.0));
        normalMatrix = extractNormalMatrix(modelview);  // always extract normalMatrix before scaling
        modelview = mult(modelview, scale(0.85, 0.85, 0.85));
        modeld.render();

    }

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

    ct++;
    if (ct == 6) {
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

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }
	ntextures_loaded++;
    render();  // Call render function when the image has been loaded (to make sure the model is displayed)
}


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function initTexture() {

    var urls = [
       "park/posx.jpg", "park/negx.jpg",
       "park/posy.jpg", "park/negy.jpg",
       "park/posz.jpg", "park/negz.jpg"
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
    texID1.image.src = "earthmap.jpg";
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
    texID3.image.src = "wood.jpg";
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
        gl.vertexAttribPointer(vcoordsLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(vnormalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(vtexcoordLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(modelviewLoc, false, flatten(modelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));  //--- load flattened normal matrix

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
        gl.vertexAttribPointer(vcoordsmapLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(vnormalmapLoc, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(modelviewmapLoc, false, flatten(modelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(normalMatrixmapLoc, false, flatten(normalMatrix));  //--- load flattened normal matrix

        gl.uniformMatrix3fv(minvmapLoc, false, flatten(Minv));  // send matrix inverse of modelview in order to rotate the skybox

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
        gl.vertexAttribPointer(vcoordsboxLoc, 3, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(modelviewboxLoc, false, flatten(modelview));
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
        case 37: rotY -= 0.15; break;        // left arrow
        case 39: rotY += 0.15; break;       // right arrow
        case 38: rotX -= 0.15; break;        // up arrow
        case 40: rotX += 0.15; break;        // down arrow
        case 13: rotX = rotY = 0; break;  // return
        case 36: rotX = rotY = 0; break;  // home
        default: rotationChanged = false;
    }
    if (rotationChanged) {
        evt.preventDefault();
        render();
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

        // LOAD FIRST SHADER  (environmental mapping)
        var vertexShaderSourcemap = getTextContent("vshadermap");
        var fragmentShaderSourcemap = getTextContent("fshadermap");
        progmap = createProgram(gl, vertexShaderSourcemap, fragmentShaderSourcemap);

        gl.useProgram(progmap);

        // locate variables for further use
        vcoordsmapLoc = gl.getAttribLocation(progmap, "vcoords");
        vnormalmapLoc = gl.getAttribLocation(progmap, "vnormal");
        vtexcoordmapLoc = gl.getAttribLocation(progmap, "vtexcoord");

        modelviewmapLoc = gl.getUniformLocation(progmap, "modelview");
        projectionmapLoc = gl.getUniformLocation(progmap, "projection");
        normalMatrixmapLoc = gl.getUniformLocation(progmap, "normalMatrix");
        minvmapLoc = gl.getUniformLocation(progmap, "minv");

        skyboxmapLoc = gl.getUniformLocation(progmap, "skybox");

        gl.enableVertexAttribArray(vcoordsmapLoc);
        gl.enableVertexAttribArray(vnormalmapLoc);
        gl.disableVertexAttribArray(vtexcoordmapLoc);   // texture coordinates not used (environmental mapping)

        // LOAD SECOND SHADER (standard texture mapping)
        var vertexShaderSource = getTextContent("vshader");
        var fragmentShaderSource = getTextContent("fshader");
        prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(prog);

        // locate variables for further use
        vcoordsLoc = gl.getAttribLocation(prog, "vcoords");
        vnormalLoc = gl.getAttribLocation(prog, "vnormal");
        vtexcoordLoc = gl.getAttribLocation(prog, "vtexcoord");

        modelviewLoc = gl.getUniformLocation(prog, "modelview");
        projectionLoc = gl.getUniformLocation(prog, "projection");
        normalMatrixLoc = gl.getUniformLocation(prog, "normalMatrix");

        textureLoc = gl.getUniformLocation(prog, "texture");

        gl.enableVertexAttribArray(vcoordsLoc);
        gl.enableVertexAttribArray(vnormalLoc);
        gl.enableVertexAttribArray(vtexcoordLoc);

        // LOAD THIRD SHADER (for the environment)
        var vertexShaderSource = getTextContent("vshaderbox");
        var fragmentShaderSource = getTextContent("fshaderbox");
        progbox = createProgram(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(progbox);

        vcoordsboxLoc = gl.getAttribLocation(progbox, "vcoords");
        vnormalboxLoc = gl.getAttribLocation(progbox, "vnormal");
        vtexcoordboxLoc = gl.getAttribLocation(progbox, "vtexcoord");

        modelviewboxLoc = gl.getUniformLocation(progbox, "modelview");
        projectionboxLoc = gl.getUniformLocation(progbox, "projection");

        skyboxLoc = gl.getUniformLocation(progbox, "skybox");

        gl.enable(gl.DEPTH_TEST);

        initTexture();

        //  create a "rotator" monitoring mouse mouvement
        rotator = new SimpleRotator(canvas, render);
        //  set initial camera position at z=40, with an "up" vector aligne with y axis
        //   (this defines the initial value of the modelview matrix )
        rotator.setView([0, 0, 1], [0, 1, 0], 40);

        // You can use basic models using the following lines

        modela = createModelmap(teapotModel);
        //        model = createModel(ring(5.0, 10.0, 25.0));
        modelb = createModel(uvSphere(10.0, 25.0, 25.0));
        modeld = createModel(uvTorus(15.0, 5.0, 25.0, 25.0));
        //        model = createModel(uvCylinder(10.0, 20.0, 25.0, true, false));
        //        model = createModel(uvCone(10.0, 20.0, 25.0, true));
        modelc = createModel(cube(10.0));

        envbox = createModelbox(cube(1000.0));

        ambientProduct = mult(lightAmbient, materialAmbient);
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        specularProduct = mult(lightSpecular, materialSpecular);

    }
    catch (e) {
        document.getElementById("message").innerHTML =
             "Could not initialize WebGL: " + e;
        return;
    }

    document.addEventListener("keydown", doKey, false);  // add a callback function (when a key is pressed)

    render();   


}



