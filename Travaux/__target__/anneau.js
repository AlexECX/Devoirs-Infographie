// Transcrypt'ed from Python, 2018-11-19 12:41:33
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {SpaceShip, Transform} from './shapes.js';
import {clear_canvas, init_webgl_inst, select_shaders, webgl_render} from './webgl_utils.js';
var __name__ = '__main__';
/*
The main module: 
- Will setup WebGL.
- Initialise the SpaceShip object
- Render the ship once and on onclick events
*/
//Dimension of render
//color codes (rgb)

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
	rotator.setView (list ([0, 0, 1]), list ([0, 1, 0]), 60);
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
	spaceship = SpaceShip ();
	box = createModel (empty_cube (10.0, 2.0));
	render ();
};
export var render = function () {
	gl.clearColor (0.79, 0.76, 0.27, 1);
	clear_canvas (gl);
	flattenedmodelview = rotator.getViewMatrix ();
	modelview = unflatten (flattenedmodelview);
	var initialModelView = modelview;
	normalMatrix = extractNormalMatrix (modelview);
	modelview = mult (modelview, scale (1, 4, 0.5));
	box.render ();
	modelview = initialModelView;
};

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