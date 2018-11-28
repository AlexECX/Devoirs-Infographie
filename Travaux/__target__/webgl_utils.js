// Transcrypt'ed from Python, 2018-11-27 20:58:16
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

//# sourceMappingURL=webgl_utils.map