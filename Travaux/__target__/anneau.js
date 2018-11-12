// Transcrypt'ed from Python, 2018-11-08 21:31:04
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Vector3D, Vector4D} from './py_vector.js';
import {clear_canvas, init_webgl_inst, select_shaders, webgl_render} from './webgl_utils.js';
var __name__ = '__main__';
/*
The main module: 
- Will setup WebGL.
- Launch JS Workers to recursively divide each faces of an object.
- The last worker calls a render function. It will render each faces 
  using the appropriate subset of points/vectors, with different colors. 
*/
var gl
export var prog = null;
//Dimension of render
export var render_D = 3;
export var CoordsLoc = null;
export var NormalLoc = null;
export var TexCoordLoc = null;
export var ProjectionLoc = null;
export var ModelviewLoc = null;
export var NormalMatrixLoc = null;
export var projection = null;
export var modelview = null;
export var flattenedmodelview = null;
export var normalMatrix = mat3 ();
export var rotator = null;
export var trirec = null;
export var sphere = null;
export var cylinder = null;
export var box = null;
export var teapot = null;
export var disk = null;
export var torus = null;
export var cone = null;
export var hemisphereinside = null;
export var hemisphereoutside = null;
export var thindisk = null;
export var quartersphereinside = null;
export var quartersphereoutside = null;
export var wing = null;
export var lightPosition = vec4 (20.0, 20.0, 100.0, 1.0);
export var lightAmbient = vec4 (1.0, 1.0, 1.0, 1.0);
export var lightDiffuse = vec4 (1.0, 1.0, 1.0, 1.0);
export var lightSpecular = vec4 (1.0, 1.0, 1.0, 1.0);
export var materialAmbient = vec4 (0.0, 0.1, 0.3, 1.0);
export var materialDiffuse = vec4 (0.48, 0.55, 0.69, 1.0);
export var materialSpecular = vec4 (0.48, 0.55, 0.69, 1.0);
export var materialShininess = 100.0;
export var ambientProduct = null;
export var diffuseProduct = null;
export var specularProduct = null;
//color codes (rgb)
export var BaseColors = list ([vec4 (0.0, 0.0, 0.0, 1.0), vec4 (1.0, 0.0, 0.0, 1.0), vec4 (1.0, 1.0, 0.0, 1.0), vec4 (0.0, 1.0, 0.0, 1.0), vec4 (0.0, 0.0, 1.0, 1.0), vec4 (1.0, 0.0, 1.0, 1.0), vec4 (0.0, 1.0, 1.0, 1.0), vec4 (1.0, 1.0, 1.0, 1.0)]);

//This is the main 3D function
export var draw = function () {
	//init
	gl = init_webgl_inst ();
	var canvas = document.getElementById ('gl-canvas');
	//LOAD SHADER (standard texture mapping)
	var vertexShaderSource = getTextContent ('vshader');
	var fragmentShaderSource = getTextContent ('fshader');
	prog = createProgram (gl, vertexShaderSource, fragmentShaderSource);
	gl.useProgram (prog);
	CoordsLoc = gl.getAttribLocation (prog, 'vcoords');
	NormalLoc = gl.getAttribLocation (prog, 'vnormal');
	TexCoordLoc = gl.getAttribLocation (prog, 'vtexcoord');
	ModelviewLoc = gl.getUniformLocation (prog, 'modelview');
	ProjectionLoc = gl.getUniformLocation (prog, 'projection');
	NormalMatrixLoc = gl.getUniformLocation (prog, 'normalMatrix');
	gl.enableVertexAttribArray (CoordsLoc);
	gl.enableVertexAttribArray (NormalLoc);
	gl.disableVertexAttribArray (TexCoordLoc);
	rotator = new SimpleRotator (canvas, render);
	rotator.setView (list ([0, 0, 1]), list ([0, 1, 0]), 40);
	ambientProduct = mult (lightAmbient, materialAmbient);
	diffuseProduct = mult (lightDiffuse, materialDiffuse);
	specularProduct = mult (lightSpecular, materialSpecular);
	gl.uniform4fv (gl.getUniformLocation (prog, 'ambientProduct'), flatten (ambientProduct));
	gl.uniform4fv (gl.getUniformLocation (prog, 'diffuseProduct'), flatten (diffuseProduct));
	gl.uniform4fv (gl.getUniformLocation (prog, 'specularProduct'), flatten (specularProduct));
	gl.uniform1f (gl.getUniformLocation (prog, 'shininess'), materialShininess);
	gl.uniform4fv (gl.getUniformLocation (prog, 'lightPosition'), flatten (lightPosition));
	projection = perspective (70.0, 1.0, 1.0, 200.0);
	gl.uniformMatrix4fv (ProjectionLoc, false, flatten (projection));
	trirec = createModel (triangle_rectangle (10.0));
	wing = Wing ();
	render ();
};
export var render = function () {
	gl.clearColor (0.79, 0.76, 0.27, 1);
	clear_canvas (gl);
	flattenedmodelview = rotator.getViewMatrix ();
	modelview = unflatten (flattenedmodelview);
	var initialModelView = modelview;
	normalMatrix = extractNormalMatrix (modelview);
	wing.traverse ();
	modelview = initialModelView;
};


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

// The following function is used to create an "object" (called "model") containing all the informations needed
// to draw a particular element (sphere, cylinder, cube,...). 
// Note that the function "model.render" is defined inside "createModel" but it is NOT executed.
// That function is only executed when we call it explicitly in render().

function createModel(modelData) {

	// the next line defines an "object" in Javascript
	// (note that there are several ways to define an "object" in Javascript)
	var model = {};
	
	// the following lines defines "members" of the "object"
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.textureBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;

	// the "members" are then used to load data from "modelData" in the graphic card
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTextureCoords, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

	// The following function is NOT executed here. It is only DEFINED to be used later when we
	// call the ".render()" method.
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
	
	// we now return the "object".
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

export var Node =  __class__ ('Node', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, transform, render, sibling, child) {
		if (typeof transform == 'undefined' || (transform != null && transform.hasOwnProperty ("__kwargtrans__"))) {;
			var transform = null;
		};
		if (typeof render == 'undefined' || (render != null && render.hasOwnProperty ("__kwargtrans__"))) {;
			var render = null;
		};
		if (typeof sibling == 'undefined' || (sibling != null && sibling.hasOwnProperty ("__kwargtrans__"))) {;
			var sibling = null;
		};
		if (typeof child == 'undefined' || (child != null && child.hasOwnProperty ("__kwargtrans__"))) {;
			var child = null;
		};
		self.transform = transform;
		self.render = render;
		self.sibling = sibling;
		self.child = child;
	});}
});
export var Wing =  __class__ ('Wing', [object], {
	__module__: __name__,
	figure: list ([]),
	points_list: list ([]),
	stack: list ([]),
	modelViewMatrix: mat4 (),
	get __init__ () {return __get__ (this, function (self) {
		var m = mat4 ();
		self.points_list.append (createModel (cube (10.0)));
		self.figure.append (Node (m, self.render));
	});},
	get render () {return __get__ (this, function (self) {
		var initialModelView = modelview;
		normalMatrix = extractNormalMatrix (modelview);
		var instanceMatrix = mult (self.modelViewMatrix, scale (2, 0.25, 2));
		modelview = mult (modelview, instanceMatrix);
		self.points_list [0].render ();
		modelview = initialModelView;
		var initialModelView = modelview;
		var instanceMatrix = mult (mat4 (), translate (0, 0, -(25) / 2 - 1));
		modelview = mult (modelview, instanceMatrix);
		normalMatrix = extractNormalMatrix (modelview);
		var instanceMatrix = mult (instanceMatrix, scale (0.5, 0.25, 3));
		modelview = mult (modelview, instanceMatrix);
		self.points_list [0].render ();
		modelview = initialModelView;
	});},
	get traverse () {return __get__ (this, function (self, id) {
		if (typeof id == 'undefined' || (id != null && id.hasOwnProperty ("__kwargtrans__"))) {;
			var id = 0;
		};
		self.stack.push (self.modelViewMatrix);
		self.modelViewMatrix = mult (self.modelViewMatrix, self.figure [id].transform);
		self.figure [id].render ();
		if (self.figure [id].child != null) {
			self.traverse (self.figure [id].child);
		}
		self.modelViewMatrix = self.stack.py_pop ();
		if (self.figure [id].sibling != null) {
			self.traverse (self.figure [id].sibling);
		}
	});}
});

//Recursively converts an iterable implementing __iter__, and all __iter__
//objects it contains, into bare list objects
export var js_list = function (iterable) {
	if (hasattr (iterable, '__iter__')) {
		return (function () {
			var __accu0__ = [];
			var __iterable0__ = iterable;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var i = __getitem__ (__iterable0__, __index0__);
				(function () {
					var __accu1__ = __accu0__;
					return __call__ (__accu1__.append, __accu1__, __call__ (js_list, null, i));
				}) ();
			}
			return __accu0__;
		}) ();
	}
	else {
		return iterable;
	}
};

//# sourceMappingURL=anneau.map