// Transcrypt'ed from Python, 2018-11-27 22:08:56
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

//This is the main function
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
	alphaLoc = gl.getUniformLocation (prog, 'alpha');
	gl.uniform1f (alphaLoc, alpha);
	ModelviewLoc = gl.getUniformLocation (prog, 'modelview');
	ProjectionLoc = gl.getUniformLocation (prog, 'projection');
	NormalMatrixLoc = gl.getUniformLocation (prog, 'normalMatrix');
	gl.enableVertexAttribArray (CoordsLoc);
	gl.enableVertexAttribArray (NormalLoc);
	gl.enableVertexAttribArray (TexCoordLoc);
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
	box = createModel (cube (10.0));
	//preparation textures
	textureList = list ([]);
	textureList.append (initTexture ('img/text1.jpg', handleLoadedTexture));
	textureList.append (initTexture ('img/text3.jpg', handleLoadedTexture));
	textureList.append (initTexture ('img/text5.jpg', handleLoadedTexture));
	textureList.append (initTexture ('img/textCanon.jpg', handleLoadedTexture));
	textureList.append (initTexture ('img/textCanon2.jpg', handleLoadedTexture));
	textureList.append (initTexture ('img/textCanon3.jpg', handleLoadedTexture));
	textureList.append (initTexture ('img/textBlanc.jpg', handleLoadedTexture));
	textureList.append (initTexture ('img/textCockpitGlass.jpg', handleLoadedTexture));
	 
	document.onkeydown = function (e) {
	    switch (e.key) {
	        case 'Home':
	            //resize the canvas to the current window width and height
	            resize(canvas)
	            break
	    };
	};
	document.getElementById("Cloak").onclick = invisible;
	
	    
	render ();
};
export var invisible = function () {
	if (alpha == 0.01) {
		alpha = 1.0;
		gl.uniform1f (alphaLoc, alpha);
		gl.disable (gl.BLEND);
		gl.depthMask (true);
	}
	else if (alpha == 1.0) {
		alpha = 0.01;
		gl.uniform1f (alphaLoc, alpha);
		gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable (gl.BLEND);
		gl.depthMask (false);
	}
	render ();
};
export var handleLoadedTexture = function (texture) {
	gl.bindTexture (gl.TEXTURE_2D, texture);
	gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	ntextures_loaded++;
	render ();
	gl.bindTexture (gl.TEXTURE_2D, null);
};
export var render = function () {
	gl.clearColor (0.79, 0.76, 0.27, 1);
	clear_canvas (gl);
	flattenedmodelview = rotator.getViewMatrix ();
	modelview = unflatten (flattenedmodelview);
	var initialModelView = modelview;
	normalMatrix = extractNormalMatrix (modelview);
	spaceship.transform = Transform ();
	spaceship.transform.multi = scale (0.8, 0.8, 0.8);
	if (ntextures_loaded == len (textureList)) {
		spaceship.traverse ();
	}
	modelview = initialModelView;
};

//# sourceMappingURL=main.map