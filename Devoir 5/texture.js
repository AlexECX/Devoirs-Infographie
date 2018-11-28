

var canvas;
var gl;

var numVertices = 36;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var ntextures_tobeloaded=0;
var ntextures_loaded=0;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = [0.0, 0.0, 0.0];
var thetaLoc;

var modelView;
var modelViewLoc;
var projection;
var projectionLoc;



function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	ntextures_loaded++;
	
    render();  // Call render function when the image has been loaded (to make sure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}


var siggraphTexture;

function initTexture() {
    siggraphTexture = gl.createTexture();

    siggraphTexture.image = new Image();
    siggraphTexture.image.onload = function () {
        handleLoadedTexture(siggraphTexture)
    }

    siggraphTexture.image.src = "SA2011_black.gif";
	ntextures_tobeloaded++;
}


function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[3]);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[3]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    texCoordsArray.push(texCoord[2]);
}


function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}


window.onload = function init() {


    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColorLoc = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPositionLoc = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPositionLoc);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var vTexCoordLoc = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoordLoc);

    //
    // Initialize a texture
    //

    initTexture();

    // Associate buttons to functions
    document.getElementById("ButtonX").onclick = function () { axis = xAxis; theta[0] = 0; theta[1] = 0; theta[2] = 0; };
    document.getElementById("ButtonY").onclick = function () { axis = yAxis; theta[0] = 0; theta[1] = 0; theta[2] = 0; };
    document.getElementById("ButtonZ").onclick = function () { axis = zAxis; theta[0] = 0; theta[1] = 0; theta[2] = 0; };

    // Locate uniform variables
    thetaLoc = gl.getUniformLocation(program, "theta");
    modelViewLoc = gl.getUniformLocation(program, "modelView");
    projectionLoc = gl.getUniformLocation(program, "projection");


    render();  // Call render function 

}


var render = function () {

    requestAnimFrame(render);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    //    modelView = mat4(1.0);  // generate an identity matrix
    modelView = translate(0.0, 0.0, -4.0);
    //    modelView = mult(modelView, rotate(20.0, vec3(0.0, 0.0, 1.0)  ) ); 
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));

    projection = perspective(50.0, 1.0, 0.1, 10);
    //    projection = ortho(-5, 5, -5, 5, -5, 5);

    gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));

    if (ntextures_loaded == ntextures_tobeloaded) {  // if texture image has been loaded

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, siggraphTexture);

		// Send texture to sampler
		gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

		gl.drawArrays(gl.TRIANGLES, 0, numVertices);
		}

}
