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
var textureLoc;
var renderingoptionLoc;

var projection;   //--- projection matrix
var modelview;    // modelview matrix
var flattenedmodelview;    //--- flattened modelview matrix

var normalMatrix = mat3();  //--- create a 3X3 matrix that will affect normals

var rotator;   // A SimpleRotator object to enable rotation by mouse dragging.

var sphere, cylinder, box, teapot, disk, torus, cone;  // model identifiers
var hemisphereinside, hemisphereoutside, thindisk;
var quartersphereinside, quartersphereoutside;

var object;

var prog;  // shader program identifier

var lightPosition = vec4(20.0, 20.0, 100.0, 1.0);

var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.0, 0.1, 0.3, 1.0);
var materialDiffuse = vec4(0.48, 0.55, 0.69, 1.0);
var materialSpecular = vec4(0.48, 0.55, 0.69, 1.0);
var materialShininess = 100.0;

var lightPositionLoc;
var ambientProduct, diffuseProduct, specularProduct;
var ambientProductLoc, diffuseProductLoc, specularProductLoc;
var shininessLoc;

var modelscalefactor = 1.5;  
var xoffset = 0, yoffset = 0, zoffset = 0;

var texID;

var ntextures_tobeloaded = 0, ntextures_loaded = 0;
var texturelist = [];
var texcounter = 0;
	
function render() {
    //gl.clearColor(0.79, 0.76, 0.27, 1);
    gl.clearColor(0.00, 0.00, 0.00, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //--- Get the rotation matrix obtained by the displacement of the mouse
    //---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

	normalMatrix = extractNormalMatrix(modelview);
		
    var initialmodelview = modelview;

	if(ntextures_tobeloaded == ntextures_loaded){
		//  now, "object" model
		modelview = initialmodelview;
		modelview = mult(translate(xoffset, yoffset, zoffset), modelview);
		modelview = mult(modelview, rotate(30.0, 1, 0, 0));
		modelview = mult(modelview, rotate(-45.0, 0, 1, 0));
		normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
		modelview = mult(modelview, scale(modelscalefactor, modelscalefactor, modelscalefactor));
		object.render();
	}

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

function handleLoadedTextureFromObjFile(texturelist,Id) {
    gl.bindTexture(gl.TEXTURE_2D, texturelist[Id]);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texturelist[Id].image);
	gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );

	ntextures_loaded++;
    render();  // Call render function when the image has been loaded (to insure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	ntextures_loaded++;
    render();  // Call render function when the image has been loaded (to insure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture() {
    texID = gl.createTexture();

    texID.image = new Image();
    texID.image.onload = function () {
        handleLoadedTexture(texID)
    }

    texID.image.src = "SA2011_black.gif";
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
    }
    return model;
}

	
function createModelFromObjFile(ptr) {
	
	var i;
    var model = {};
	
	model.numberofelements = ptr.numberofelements;
	model.coordsBuffer = [];
	model.normalBuffer = [];
	model.textureBuffer = [];
	model.indexBuffer = [];
	model.count = [];
	model.Ka = [];
	model.Kd = [];
	model.Ks = [];
	model.Ns = [];
	model.textureFile = [];
	model.texId = [];

	
	for(i=0; i < ptr.numberofelements; i++){
	
		model.coordsBuffer.push( gl.createBuffer() );
		model.normalBuffer.push( gl.createBuffer() );
		model.textureBuffer.push( gl.createBuffer() );
		model.indexBuffer.push( gl.createBuffer() );
		model.count.push( ptr.list[i].indices.length );
	
		gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer[i]);
		gl.bufferData(gl.ARRAY_BUFFER, ptr.list[i].vertexPositions, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer[i]);
		gl.bufferData(gl.ARRAY_BUFFER, ptr.list[i].vertexNormals, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer[i]);
		gl.bufferData(gl.ARRAY_BUFFER, ptr.list[i].vertexTextureCoords, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer[i]);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ptr.list[i].indices, gl.STATIC_DRAW);
		
		model.Ka.push(ptr.list[i].material.Ka);
		model.Kd.push(ptr.list[i].material.Kd);
		model.Ks.push(ptr.list[i].material.Ks);
		model.Ns.push(ptr.list[i].material.Ns);  // shininess
		
		// if a texture file has been defined for this element
		if(ptr.list[i].material.map != ""){
			
			// Check if the filename is present in the texture list
			var texindex = model.textureFile.indexOf(ptr.list[i].material.map);
			if( texindex > -1){ // texture file previously loaded
				// store the texId of the previously loaded file
				model.texId.push(model.texId[texindex]);
			}
			else { // new texture file to load
				// store current texture counter (will be used when rendering the scene)
				model.texId.push(texcounter);
			
				// add a new image buffer to the texture list
				texturelist.push(gl.createTexture());
				if(texcounter < 70){
					texturelist[texcounter].image = new Image();
					
					if(texcounter == 0){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,0)
						}
					}
					else if(texcounter == 1){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,1)
						}
					}
					else if(texcounter == 2){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,2)
						}
					}
					else if(texcounter == 3){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,3)
						}
					}
					else if(texcounter == 4){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,4)
						}
					}
					else if(texcounter == 5){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,5)
						}
					}
					else if(texcounter == 6){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,6)
						}
					}
					else if(texcounter == 7){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,7)
						}
					}
					else if(texcounter == 8){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,8)
						}
					}
					else if(texcounter == 9){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,9)
						}
					}
					else if(texcounter == 10){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,10)
						}
					}
					else if(texcounter == 11){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,11)
						}
					}
					else if(texcounter == 12){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,12)
						}
					}
					else if(texcounter == 13){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,13)
						}
					}
					else if(texcounter == 14){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,14)
						}
					}
					else if(texcounter == 15){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,15)
						}
					}
					else if(texcounter == 16){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,16)
						}
					}
					else if(texcounter == 17){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,17)
						}
					}
					else if(texcounter == 18){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,18)
						}
					}
					else if(texcounter == 19){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,19)
						}
					}
					else if(texcounter == 20){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,20)
						}
					}
					else if(texcounter == 21){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,21)
						}
					}
					else if(texcounter == 22){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,22)
						}
					}
					else if(texcounter == 23){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,23)
						}
					}
					else if(texcounter == 24){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,24)
						}
					}
					else if(texcounter == 25){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,25)
						}
					}
					else if(texcounter == 26){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,26)
						}
					}
					else if(texcounter == 27){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,27)
						}
					}
					else if(texcounter == 28){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,28)
						}
					}
					else if(texcounter == 29){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,29)
						}
					}
					else if(texcounter == 30){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,30)
						}
					}
					else if(texcounter == 31){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,31)
						}
					}
					else if(texcounter == 32){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,32)
						}
					}
					else if(texcounter == 33){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,33)
						}
					}
					else if(texcounter == 34){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,34)
						}
					}
					else if(texcounter == 35){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,35)
						}
					}
					else if(texcounter == 36){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,36)
						}
					}
					else if(texcounter == 37){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,37)
						}
					}
					else if(texcounter == 38){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,38)
						}
					}
					else if(texcounter == 39){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,39)
						}
					}
					else if(texcounter == 40){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,40)
						}
					}
					else if(texcounter == 41){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,41)
						}
					}
					else if(texcounter == 42){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,42)
						}
					}
					else if(texcounter == 43){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,43)
						}
					}
					else if(texcounter == 44){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,44)
						}
					}
					else if(texcounter == 45){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,45)
						}
					}
					else if(texcounter == 46){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,46)
						}
					}
					else if(texcounter == 47){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,47)
						}
					}
					else if(texcounter == 48){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,48)
						}
					}
					else if(texcounter == 49){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,49)
						}
					}
					else if(texcounter == 50){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,50)
						}
					}
					else if(texcounter == 51){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,51)
						}
					}
					else if(texcounter == 52){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,52)
						}
					}
					else if(texcounter == 53){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,53)
						}
					}
					else if(texcounter == 54){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,54)
						}
					}
					else if(texcounter == 55){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,55)
						}
					}
					else if(texcounter == 56){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,56)
						}
					}
					else if(texcounter == 57){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,57)
						}
					}
					else if(texcounter == 58){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,58)
						}
					}
					else if(texcounter == 59){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,59)
						}
					}
					else if(texcounter == 60){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,60)
						}
					}
					else if(texcounter == 61){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,61)
						}
					}
					else if(texcounter == 62){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,62)
						}
					}
					else if(texcounter == 63){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,63)
						}
					}
					else if(texcounter == 64){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,64)
						}
					}
					else if(texcounter == 65){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,65)
						}
					}
					else if(texcounter == 66){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,66)
						}
					}
					else if(texcounter == 67){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,67)
						}
					}
					else if(texcounter == 68){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,68)
						}
					}
					else if(texcounter == 69){  // associate a FIXED callback function to each texture Id
						texturelist[texcounter].image.onload = function () {
							handleLoadedTextureFromObjFile(texturelist,69)
						}
					}
					
					if(texcounter < 70){
						texturelist[texcounter].image.src = ptr.list[i].material.map;
						ntextures_tobeloaded++;					
					}

					// increment counter
					texcounter ++;
				} // if(texcounter<70)
			} // else				
		} // if(ptr.list[i].material.map != ""){
		else { // if there is no texture file associated to this element
			// store a null value (it will NOT be used when rendering the scene)
			model.texId.push(null);
		}
			
		// store the filename for every element even if it is empty ("")
		model.textureFile.push(ptr.list[i].material.map);		
		
	} // for(i=0; i < ptr.numberofelements; i++){
	
	model.render = function () {
		for(i=0; i < this.numberofelements; i++){
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer[i]);
			gl.vertexAttribPointer(CoordsLoc, 3, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer[i]);
			gl.vertexAttribPointer(NormalLoc, 3, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer[i]);
			gl.vertexAttribPointer(TexCoordLoc, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer[i]);

			gl.uniformMatrix4fv(ModelviewLoc, false, flatten(modelview));    //--- load flattened modelview matrix
			gl.uniformMatrix3fv(NormalMatrixLoc, false, flatten(normalMatrix));  //--- load flattened normal matrix

			ambientProduct = mult(lightAmbient, vec4(this.Ka[i],1.0));
			diffuseProduct = mult(lightDiffuse, vec4(this.Kd[i],1.0));
			specularProduct = mult(lightSpecular, vec4(this.Ks[i],1.0));
			materialShininess = this.Ns[i];

			gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
			gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));
			gl.uniform4fv(specularProductLoc, flatten(specularProduct));
			gl.uniform1f(shininessLoc, materialShininess);

			if(this.textureFile[i] != ""){
				gl.enableVertexAttribArray(TexCoordLoc);				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texturelist[model.texId[i]]);
			
				// Send texture number to sampler
				gl.uniform1i(textureLoc, 0);
				
				// assign "2" to renderingoption in fragment shader
				gl.uniform1i(renderingoptionLoc, 2);
			}
			else{
				gl.disableVertexAttribArray(TexCoordLoc);
				// assign "0" to renderingoption in fragment shader
				gl.uniform1i(renderingoptionLoc, 0);				
			}
			
			gl.drawElements(gl.TRIANGLES, this.count[i], gl.UNSIGNED_SHORT, 0);
		}
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
		
        gl.enable(gl.DEPTH_TEST);

//		initTexture();  // Load texture images for basic models (not for OBJ files)
				
        //  create a "rotator" monitoring mouse mouvement
        rotator = new SimpleRotator(canvas, render);
        //  set initial camera position at z=40, with an "up" vector aligned with y axis
        //   (this defines the initial value of the modelview matrix )
        rotator.setView([0, 0, 1], [0, 1, 0], 40);

        ambientProductLoc = gl.getUniformLocation(prog, "ambientProduct");
        diffuseProductLoc = gl.getUniformLocation(prog, "diffuseProduct");
        specularProductLoc = gl.getUniformLocation(prog, "specularProduct");
		shininessLoc = gl.getUniformLocation(prog, "shininess");
		lightPositionLoc = gl.getUniformLocation(prog, "lightPosition");
		renderingoptionLoc = gl.getUniformLocation(prog, "renderingoption");
		textureLoc = gl.getUniformLocation(prog, "texture");
		
		gl.uniform4fv(lightPositionLoc, flatten(lightPosition));

		projection = perspective(70.0, 1.0, 1.0, 200.0);
		gl.uniformMatrix4fv(ProjectionLoc, false, flatten(projection));  // send projection matrix to the shader program
		
		// You can use basic models using the following lines

		object = createModelFromObjFile(ExtractDataFromOBJ("star-wars-arc-170-pbr.obj"));  // Extract vertices and normals from OBJ file
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
				case 'ArrowUp':
					// up arrow
					yoffset++;
					render();
					break;
				case 'ArrowDown':
					// down arrow
					yoffset--;
					render();
					break;
				case 'ArrowLeft':
					// left arrow
					xoffset--;
					render();
					break;
				case 'ArrowRight':
					// right arrow
					xoffset++;
					render();
					break;
				case 'PageUp':
					// page up
					zoffset--;
					render();
					break;
				case 'PageDown':
					// page down
					zoffset++;
					render();
					break;
				case 'Home':
					// change to fullscreen
					resize(canvas);
					// canvas.width  = 200; // in pixels
					// canvas.height = 100; // in pixels
					// alert(window.screen.availWidth);
					// alert(window.screen.availHeight);
					break;
			}
		};
		
		// managing the mousewheel (to scale the model)
		var mycanvas = document.getElementById("glcanvas");
		if (mycanvas.addEventListener) {
			// IE9, Chrome, Safari, Opera
			mycanvas.addEventListener("mousewheel", MouseWheelHandler, false);
			// Firefox
			mycanvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
		}
		// IE 6/7/8
		else mycanvas.attachEvent("onmousewheel", MouseWheelHandler);

    }
    catch (e) {
        document.getElementById("message").innerHTML =
             "Could not initialize WebGL: " + e;
        return;
    }

   	resize(canvas);  // size the canvas to the current window width and height

    render();
}

function MouseWheelHandler(e) {

	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	// note: when the wheel is moved, "delta" is incremented by +1 or -1
	
	modelscalefactor += delta*0.1*modelscalefactor;
	
	render()

	return false;
}

function resize(canvas) {  // ref. https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
	  // var realToCSSPixels = window.devicePixelRatio;

	  // var actualPanelWidth = Math.floor(0.85 * window.innerWidth * realToCSSPixels); // because we have set the right panel to be 85% of the window width
	  // var actualPanelHeight = Math.floor(0.96 * window.innerHeight * realToCSSPixels); 

  var actualPanelWidth = Math.floor(0.85 * window.innerWidth); // because we have set the right panel to be 85% of the window width
  var actualPanelHeight = Math.floor(0.96 * window.innerHeight); 

  var minDimension = Math.min(actualPanelWidth, actualPanelHeight);
    
   // Ajust the canvas this dimension (square)
    canvas.width  = minDimension;
    canvas.height = minDimension;
	
	gl.viewport(0, 0, canvas.width, canvas.height);

}