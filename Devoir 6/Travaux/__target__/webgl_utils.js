// Transcrypt'ed from Python, 2018-12-14 11:47:14
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'webgl_utils';
//Base render function
export var webgl_render = function (gl, program, mode, count) {
	gl.drawArrays (mode, 0, count);
};

//Clears the canva
export var clear_canvas = function (gl) {
	gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

//Initialise WebGL
export var init_webgl_inst = function () {
	var canvas = document.getElementById ('gl-canvas');
	var gl = canvas.getContext ('webgl');
	if (!(gl)) {
		var gl = canvas.getContext ('experimental-webgl');
	}
	if (!(gl)) {
		var __except0__ = 'Could not create WebGL context.';
		__except0__.__cause__ = null;
		throw __except0__;
	}
	gl.enable (gl.DEPTH_TEST);
	return gl;
	
	//Get the desired shader and return a program instance
};
export var select_shaders = function (gl) {
	var args = tuple ([].slice.apply (arguments).slice (1));
	var program = initShaders (gl, ...args);
	gl.useProgram (program);
	return program;
};
/**
* Recursively converts an iterable implementing __iter__, and all __iter__
* objects it contains, into bare array objects
*/
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
/**
* typeof compatibility for Transcrypt 
*/
export var js_typeof = function (value) {
	return typeof value
};

/**
* objet creation compatibility for Transcrypt.
*/
export var js_obj = function () {
	return {}
};
/**
* Encapsulation d'un programme WebGL. 
*  
*/
export var WebGLProgram =  __class__ ('WebGLProgram', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, gl, vshader, fshader) {
		self.gl = gl;
		var vsh = gl.createShader (gl.VERTEX_SHADER);
		gl.shaderSource (vsh, vshader);
		gl.compileShader (vsh);
		if (!(gl.getShaderParameter (vsh, gl.COMPILE_STATUS))) {
			var __except0__ = 'Error in vertex shader:  ' + gl.getShaderInfoLog (vsh);
			__except0__.__cause__ = null;
			throw __except0__;
		}
		var fsh = gl.createShader (gl.FRAGMENT_SHADER);
		gl.shaderSource (fsh, fshader);
		gl.compileShader (fsh);
		if (!(gl.getShaderParameter (fsh, gl.COMPILE_STATUS))) {
			var __except0__ = 'Error in vertex shader:  ' + gl.getShaderInfoLog (fsh);
			__except0__.__cause__ = null;
			throw __except0__;
		}
		var prog = gl.createProgram ();
		gl.attachShader (prog, vsh);
		gl.attachShader (prog, fsh);
		gl.linkProgram (prog);
		if (!(gl.getProgramParameter (prog, gl.LINK_STATUS))) {
			var __except0__ = 'Link error in program:  ' + gl.getProgramInfoLog (prog);
			__except0__.__cause__ = null;
			throw __except0__;
		}
		self.prog = prog;
		self.location_dict = dict ({});
	});}/**
	    * Permet de localiser et stocker la localisation d'une variable glsl 
	    */
	,
	get locate () {return __get__ (this, function (self, typeLoc, var_name) {
		self.location_dict [var_name] = __call__ (typeLoc, self.gl, self.prog, var_name);
		return self.location_dict [var_name];
	});}/**
	    * Permet d'obtenir la localisation d'une variable du programme
	    */
	,
	get loc () {return __get__ (this, function (self, var_name) {
		var value = self.location_dict [var_name];
		if (js_typeof (value) == 'undefined') {
			var __except0__ = KeyError (var_name);
			__except0__.__cause__ = null;
			throw __except0__;
		}
		else {
			return value;
		}
	});}/**
	    * gl.useProgram sur le programme 
	    */
	,
	get useProgram () {return __get__ (this, function (self) {
		self.gl.useProgram (self.prog);
	});}
});

//# sourceMappingURL=webgl_utils.map