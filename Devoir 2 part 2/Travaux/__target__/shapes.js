// Transcrypt'ed from Python, 2018-10-18 08:47:31
var py_vector = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_py_vector__ from './py_vector.js';
__nest__ (py_vector, '', __module_py_vector__);
import {Vector2D, Vector3D} from './py_vector.js';
var __name__ = 'shapes';

//make_square is usually prefered.
export var make_square2D = function (size) {
	if (typeof size == 'undefined' || (size != null && size.hasOwnProperty ("__kwargtrans__"))) {;
		var size = 0.5;
	};
	var square = list ([Vector2D (-(size), -(size)), Vector2D (size, -(size)), Vector2D (size, size), Vector2D (-(size), size)]);
	return square;
};
export var make_square = function (size) {
	if (typeof size == 'undefined' || (size != null && size.hasOwnProperty ("__kwargtrans__"))) {;
		var size = 0.5;
	};
	var square = list ([Vector3D (-(size), -(size), 0), Vector3D (size, -(size), 0), Vector3D (size, size, 0), Vector3D (-(size), size, 0)]);
	return square;
};
export var make_cube = function (size, z) {
	if (typeof size == 'undefined' || (size != null && size.hasOwnProperty ("__kwargtrans__"))) {;
		var size = 0.5;
	};
	if (typeof z == 'undefined' || (z != null && z.hasOwnProperty ("__kwargtrans__"))) {;
		var z = 0;
	};
	var base = list ([Vector3D (-(size), -(size), size), Vector3D (-(size), size, size), Vector3D (size, size, size), Vector3D (size, -(size), size), Vector3D (-(size), -(size), -(size)), Vector3D (-(size), size, -(size)), Vector3D (size, size, -(size)), Vector3D (size, -(size), -(size))]);
	var cube = list ([list ([base [1], base [0], base [3], base [2]]), list ([base [2], base [3], base [7], base [6]]), list ([base [3], base [0], base [4], base [7]]), list ([base [6], base [5], base [1], base [2]]), list ([base [4], base [5], base [6], base [7]]), list ([base [5], base [4], base [0], base [1]])]);
	return cube;
};
export var make_triangle = function (size) {
	if (typeof size == 'undefined' || (size != null && size.hasOwnProperty ("__kwargtrans__"))) {;
		var size = 0.5;
	};
	var triangle = list ([Vector2D (-(size), size), Vector2D (-(size), -(size)), Vector2D (size, size)]);
	return triangle;
};

//Recursively divides a triangle in 3 parts, by count times
export var divide_triangle = function (tri, count) {
	var points = list ([]);
	if (count === 0) {
		var points = __add__ (points, tri);
		return points;
	}
	else {
		var ab = py_vector.mix (tri [0], tri [1], 1 / 3);
		var ac = py_vector.mix (tri [0], tri [2], 1 / 3);
		var bc = py_vector.mix (tri [1], tri [2], 1 / 3);
		count--;
		var p_list = list ([]);
		p_list.append (divide_triangle (tuple ([tri [2], ac, bc]), count));
		p_list.append (divide_triangle (tuple ([tri [0], ab, ac]), count));
		p_list.append (divide_triangle (tuple ([tri [1], bc, ab]), count));
		for (var i of p_list) {
			var points = __add__ (points, i);
		}
		return points;
	}
};

//Recursively divides a square in 8 parts, by count times
export var divide_square = function (sq, count) {
	var points = list ([]);
	if (count === 0) {
		var points = __add__ (points, __getslice__ (sq, 0, 3, 1));
		var points = __add__ (points, __getslice__ (sq, 1, 4, 1));
		var points = __add__ (points, list ([__getitem__ (sq, 2), __getitem__ (sq, 3), __getitem__ (sq, 0)]));
		return points;
	}
	else {
		var ab = py_vector.mix (sq [0], sq [1], 1 / 3);
		var ac = py_vector.mix (sq [0], sq [2], 1 / 3);
		var ad = py_vector.mix (sq [0], sq [3], 1 / 3);
		var ba = py_vector.mix (sq [1], sq [0], 1 / 3);
		var bc = py_vector.mix (sq [1], sq [2], 1 / 3);
		var bd = py_vector.mix (sq [1], sq [3], 1 / 3);
		var ca = py_vector.mix (sq [2], sq [0], 1 / 3);
		var cb = py_vector.mix (sq [2], sq [1], 1 / 3);
		var cd = py_vector.mix (sq [2], sq [3], 1 / 3);
		var da = py_vector.mix (sq [3], sq [0], 1 / 3);
		var db = py_vector.mix (sq [3], sq [1], 1 / 3);
		var dc = py_vector.mix (sq [3], sq [2], 1 / 3);
		count--;
		var p_list = list ([]);
		p_list.append (divide_square (tuple ([sq [0], ab, ac, ad]), count));
		p_list.append (divide_square (tuple ([ba, sq [1], bc, bd]), count));
		p_list.append (divide_square (tuple ([ca, cb, sq [2], cd]), count));
		p_list.append (divide_square (tuple ([da, db, dc, sq [3]]), count));
		p_list.append (divide_square (tuple ([ab, ba, bd, ac]), count));
		p_list.append (divide_square (tuple ([bd, bc, cb, ca]), count));
		p_list.append (divide_square (tuple ([db, ca, cd, dc]), count));
		p_list.append (divide_square (tuple ([ad, ac, db, da]), count));
		for (var i of p_list) {
			var points = __add__ (points, i);
		}
		return points;
	}
};

//Recursively divides the six faces of a cube in 8 parts, by count times.
//This function is depreciated in favor of a multithreaded method 
//using JS workers.
export var divide_cube = function (cube, count) {
	var points = list ([]);
	var p_list = list ([]);
	p_list.append (divide_square (cube.__getslice__ (0, 4, 1), count));
	p_list.append (divide_square (cube.__getslice__ (4, null, 1), count));
	p_list.append (divide_square (list ([cube [0], cube [1], cube [5], cube [4]]), count));
	p_list.append (divide_square (list ([cube [2], cube [3], cube [7], cube [6]]), count));
	p_list.append (divide_square (list ([cube [0], cube [3], cube [7], cube [4]]), count));
	p_list.append (divide_square (list ([cube [1], cube [2], cube [6], cube [5]]), count));
	for (var i of p_list) {
		var points = __add__ (points, i);
	}
	return points;
};

//Experimental functions

export var shift = function (shape, coord) {
	for (var vec of shape) {
		var vec = __call__ (__iadd__, null, vec, coord);
	}
	return shape;
};
export var rotate_left = function (shape) {
	var new_shape = list ([__add__ (__getitem__ (shape, 0), list ([__truediv__ (__neg__ (1), 8), 0, __truediv__ (__neg__ (1), 8)])), __add__ (__getitem__ (shape, 1), list ([__truediv__ (__neg__ (1), 8), 0, __truediv__ (__neg__ (1), 8)])), __add__ (__getitem__ (shape, 2), list ([__truediv__ (__neg__ (1), 8), 0, __truediv__ (1, 8)])), __add__ (__getitem__ (shape, 3), list ([__truediv__ (__neg__ (1), 8), 0, __truediv__ (1, 8)])), __add__ (__getitem__ (shape, 4), list ([__truediv__ (1, 8), 0, __truediv__ (1, 8)])), __add__ (__getitem__ (shape, 5), list ([__truediv__ (1, 8), 0, __truediv__ (1, 8)])), __add__ (__getitem__ (shape, 6), list ([__truediv__ (1, 8), 0, __truediv__ (__neg__ (1), 8)])), __add__ (__getitem__ (shape, 7), list ([__truediv__ (1, 8), 0, __truediv__ (__neg__ (1), 8)]))]);
	return new_shape;
};
export var rotate_up = function (shape) {
	var new_shape = list ([__add__ (__getitem__ (shape, 0), list ([0, __truediv__ (1, 8), __truediv__ (__neg__ (1), 8)])), __add__ (__getitem__ (shape, 1), list ([0, __truediv__ (1, 8), __truediv__ (1, 8)])), __add__ (__getitem__ (shape, 2), list ([0, __truediv__ (1, 8), __truediv__ (1, 8)])), __add__ (__getitem__ (shape, 3), list ([0, __truediv__ (1, 8), __truediv__ (__neg__ (1), 8)])), __add__ (__getitem__ (shape, 4), list ([0, __truediv__ (__neg__ (1), 8), __truediv__ (1, 8)])), __add__ (__getitem__ (shape, 5), list ([0, __truediv__ (__neg__ (1), 8), __truediv__ (__neg__ (1), 8)])), __add__ (__getitem__ (shape, 6), list ([0, __truediv__ (__neg__ (1), 8), __truediv__ (__neg__ (1), 8)])), __add__ (__getitem__ (shape, 7), list ([0, __truediv__ (__neg__ (1), 8), __truediv__ (1, 8)]))]);
	return new_shape;
};

//# sourceMappingURL=shapes.map