<<<<<<< HEAD
<<<<<<< HEAD
// Transcrypt'ed from Python, 2018-10-25 22:19:06
=======
// Transcrypt'ed from Python, 2018-10-25 15:56:48
>>>>>>> parent of 14aa77b... unsuccessfull variable displacement
=======
// Transcrypt'ed from Python, 2018-10-25 19:53:40
>>>>>>> parent of cd6b252... fail
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'py_vector';

//MV.mix implementation using python operator overload
export var mix = function (u, v, s) {
	var t = typeof s
	if (!(t === 'number')) {
		throw "mix: the last paramter " + s + " must be a number";
	}
	if (__ne__ (__call__ (len, null, u), __call__ (len, null, v))) {
		throw "vector dimension mismatch";
	}
	return __add__ (__mul__ (u, (function () {
		var __accu0__ = [];
		var __iterable0__ = u;
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var i = __getitem__ (__iterable0__, __index0__);
			__call__ (__accu0__.append, __accu0__, __sub__ (1, s));
		}
		return __accu0__;
	}) ()), __mul__ (v, (function () {
		var __accu0__ = [];
		var __iterable0__ = v;
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var i = __getitem__ (__iterable0__, __index0__);
			__call__ (__accu0__.append, __accu0__, s);
		}
		return __accu0__;
	}) ()));
};

//Custom made Vector classes translated from python to JS.
//Mainly used for operator overload functionnality, and to try the 
//Transcrypt transpiler functionnalities.
export var Vector =  __class__ ('Vector', [object], {
	__module__: __name__,
	coord: list ([]),
	get __init__ () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		self.coord = (function () {
			var __accu0__ = [];
			for (var i of args) {
				__accu0__.append (float (i));
			}
			return __accu0__;
		}) ();
	});},
	get __str__ () {return __get__ (this, function (self) {
		return '{}{}'.format (self.__class__.__name__, self.coord);
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return '{}{}'.format (self.__class__.__name__, self.coord);
	});}
	//Add list[] functionnalities
	,
	get __getitem__ () {return __get__ (this, function (self, item) {
		return self.coord [item];
	});}
	//Add list[key] = value functionnalities
	,
	get __setitem__ () {return __get__ (this, function (self, key, value) {
		self.coord [key] = value;
	});}
	//Add iterability
	,
	get __iter__ () {return __get__ (this, function* (self) {
		for (var item of self.coord) {
			yield item;
		}
		});},
	[Symbol.iterator] () {return this.__iter__ ()}
	//Add len() functionnality
	,
	get __len__ () {return __get__ (this, function (self) {
		return len (self.coord);
	});}
	//Python abs() method overload
	,
	get __abs__ () {return __get__ (this, function (self) {
		var result = (function () {
			var __accu0__ = [];
			for (var c of self.coord) {
				__accu0__.append (c / c);
			}
			return __accu0__;
		}) ();
		return self.__class__ (...result);
	});}
	//Negation operator overload
	,
	get __neg__ () {return __get__ (this, function (self) {
		var result = (function () {
			var __accu0__ = [];
			for (var c of self.coord) {
				__accu0__.append (-(c));
			}
			return __accu0__;
		}) ();
		return self.__class__ (...result);
	});}
	//Equality == operator overload
	,
	get __eq__ () {return __get__ (this, function (self, vector) {
		if (__ne__ (__call__ (len, null, self), __call__ (len, null, vector))) {
			return false;
		}
		for (var i = 0; i < __call__ (len, null, self.coord); i++) {
			if (__ne__ (__getitem__ (self.coord, i), __getitem__ (vector, i))) {
				return false;
			}
		}
		return true;
	});}
	//Equality != operator overload
	,
	get __ne__ () {return __get__ (this, function (self, vector) {
		return (__call__ (self.__eq__, self, vector) ? false : true);
	});}
	//Operator + overload (self + vector case)
	,
	get __add__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __add__ (__getitem__ (self.coord, i), __call__ (float, null, vector)));
				}
				return __accu0__;
			}) ();
		}
		else {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __add__ (__getitem__ (self.coord, i), __getitem__ (vector, i)));
				}
				return __accu0__;
			}) ();
		}
		return __call__ (self.__class__, self, ...result);
	});}
	//Operator + overload (vector + self case)
	,
	get __radd__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __add__ (__getitem__ (self.coord, i), __call__ (float, null, vector)));
				}
				return __accu0__;
			}) ();
		}
		else {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __add__ (__getitem__ (self.coord, i), __getitem__ (vector, i)));
				}
				return __accu0__;
			}) ();
		}
		return __call__ (self.__class__, self, ...result);
	});}
	//Operator += overload
	,
	get __iadd__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var __iterable0__ = self.coord;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var i = __getitem__ (__iterable0__, __index0__);
				__setitem__ (self.coord, i, __call__ (__iadd__, null, __getitem__ (self.coord, i), __add__ (__getitem__ (vector, i), __call__ (float, null, vector))));
			}
		}
		else {
			var __iterable0__ = self.coord;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var i = __getitem__ (__iterable0__, __index0__);
				__setitem__ (self.coord, i, __call__ (__iadd__, null, __getitem__ (self.coord, i), __getitem__ (vector, i)));
			}
		}
		return self;
	});}
	//Operator - overload (self - vector case)
	,
	get __sub__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __sub__ (__getitem__ (self.coord, i), __call__ (float, null, vector)));
				}
				return __accu0__;
			}) ();
		}
		else {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __sub__ (__getitem__ (self.coord, i), __getitem__ (vector, i)));
				}
				return __accu0__;
			}) ();
		}
		return __call__ (self.__class__, self, ...result);
	});}
	//Operator - overload (vector - self case)
	,
	get __rsub__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __sub__ (__getitem__ (self.coord, i), __call__ (float, null, vector)));
				}
				return __accu0__;
			}) ();
		}
		else {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __sub__ (__getitem__ (self.coord, i), __getitem__ (vector, i)));
				}
				return __accu0__;
			}) ();
		}
		return __call__ (self.__class__, self, ...result);
	});}
	//Operator -= overload
	,
	get __isub__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var __iterable0__ = self.coord;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var i = __getitem__ (__iterable0__, __index0__);
				__setitem__ (self.coord, i, __call__ (__isub__, null, __getitem__ (self.coord, i), __add__ (__getitem__ (vector, i), __call__ (float, null, vector))));
			}
		}
		else {
			for (var i = 0; i < __call__ (len, null, self.coord); i++) {
				__setitem__ (self.coord, i, __call__ (__isub__, null, __getitem__ (self.coord, i), __getitem__ (vector, i)));
			}
		}
		return self;
	});}
	//Operator * overload (self + vector case)
	,
	get __mul__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __mul__ (__getitem__ (self.coord, i), __call__ (float, null, vector)));
				}
				return __accu0__;
			}) ();
		}
		else {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __mul__ (__getitem__ (self.coord, i), __getitem__ (vector, i)));
				}
				return __accu0__;
			}) ();
		}
		return __call__ (self.__class__, self, ...result);
	});}
	//Operator * overload (vector + self case)
	,
	get __rmul__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __mul__ (__getitem__ (self.coord, i), __call__ (float, null, vector)));
				}
				return __accu0__;
			}) ();
		}
		else {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __mul__ (__getitem__ (self.coord, i), __getitem__ (vector, i)));
				}
				return __accu0__;
			}) ();
		}
		return __call__ (self.__class__, self, ...result);
	});}
	//Operator *= overload
	,
	get __imul__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var __iterable0__ = self.coord;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var i = __getitem__ (__iterable0__, __index0__);
				__setitem__ (self.coord, i, __call__ (__imul__, null, __getitem__ (self.coord, i), __add__ (__getitem__ (vector, i), __call__ (float, null, vector))));
			}
		}
		else {
			for (var i = 0; i < __call__ (len, null, self.coord); i++) {
				__setitem__ (self.coord, i, __call__ (__imul__, null, __getitem__ (self.coord, i), __getitem__ (vector, i)));
			}
		}
		return self;
	});}
	//Operator / overload (self + vector case)
	,
	get __truediv__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __truediv__ (__getitem__ (self.coord, i), __call__ (float, null, vector)));
				}
				return __accu0__;
			}) ();
		}
		else {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __truediv__ (__getitem__ (self.coord, i), __getitem__ (vector, i)));
				}
				return __accu0__;
			}) ();
		}
		return __call__ (self.__class__, self, ...result);
	});}
	//Operator / overload (vector + self case)
	,
	get __rtruediv__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __truediv__ (__getitem__ (self.coord, i), __call__ (float, null, vector)));
				}
				return __accu0__;
			}) ();
		}
		else {
			var result = (function () {
				var __accu0__ = [];
				for (var i = 0; i < __call__ (len, null, self.coord); i++) {
					__call__ (__accu0__.append, __accu0__, __truediv__ (__getitem__ (self.coord, i), __getitem__ (vector, i)));
				}
				return __accu0__;
			}) ();
		}
		return __call__ (self.__class__, self, ...result);
	});}
	//Operator /= overload
	,
	get __itruediv__ () {return __get__ (this, function (self, vector) {
		if (__call__ (isinstance, null, vector, tuple ([int, float, str]))) {
			var __iterable0__ = self.coord;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var i = __getitem__ (__iterable0__, __index0__);
				__setitem__ (self.coord, i, __call__ (__idiv__, null, __getitem__ (self.coord, i), __add__ (__getitem__ (vector, i), __call__ (float, null, vector))));
			}
		}
		else {
			for (var i = 0; i < __call__ (len, null, self.coord); i++) {
				__setitem__ (self.coord, i, __call__ (__idiv__, null, __getitem__ (self.coord, i), __getitem__ (vector, i)));
			}
		}
		return self;
	});}
	//Return the vector lenght of the vector
	,
	get length_vec () {return __get__ (this, function (self) {
		var sqrt_components = 0;
		for (var coord of self.coord) {
			sqrt_components += coord * coord;
		}
		return Math.pow (sqrt_components, 0.5);
	});}
	//Return a normalized Vector
	,
	get normalize () {return __get__ (this, function (self) {
		if (self.is_normalized) {
			return self.__class__ (...self.coord);
		}
		else {
			return self / self.length_vec ();
		}
	});}
	//Return vector coordinates as a list
	,
	get as_list () {return __get__ (this, function (self) {
		return self.coord.__getslice__ (0, null, 1);
	});}
	//
	,
	get _get_is_normalized () {return __get__ (this, function (self) {
		return self.length_vec () == 1.0;
	});}
	//Find the dot product of 2 vectors (produit scalaire)
	,
	get dot () {return __get__ (this, function (self, vector) {
		var dot = 0.0;
		var vec1 = self.normalize ();
		var vec2 = self.__class__ (...vector).normalize ();
		for (var i = 0; i < len (vec2); i++) {
			var dot = __call__ (__iadd__, null, dot, __mul__ (__getitem__ (vec1, i), __getitem__ (vec2, i)));
		}
		return dot;
	});}
});
Object.defineProperty (Vector, 'is_normalized', property.call (Vector, Vector._get_is_normalized));;
export var Vector2D =  __class__ ('Vector2D', [Vector], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		__super__ (Vector2D, '__init__') (self, ...args);
		while (len (self.coord) < 2) {
			self.coord.append (0.0);
		}
		self.coord = self.coord.__getslice__ (0, 2, 1);
	});}
});
export var Vector3D =  __class__ ('Vector3D', [Vector], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		__super__ (Vector3D, '__init__') (self, ...args);
		while (len (self.coord) < 3) {
			self.coord.append (0.0);
		}
		self.coord = self.coord.__getslice__ (0, 3, 1);
	});}
	/*Find the cross product of 2 vectors and
	    return the resulting vector. (math representation is vector x vector)*/
	,
	get cross () {return __get__ (this, function (self, vec2) {
		var vector1 = self;
		var vector2 = __call__ (self.__class__, self, ...vec2);
		return __call__ (self.__class__, self, __sub__ (__mul__ (__getitem__ (vector1, 1), __getitem__ (vector2, 2)), __mul__ (__getitem__ (vector1, 2), __getitem__ (vector2, 1))), __sub__ (__mul__ (__getitem__ (vector1, 2), __getitem__ (vector2, 0)), __mul__ (__getitem__ (vector1, 0), __getitem__ (vector2, 2))), __sub__ (__mul__ (__getitem__ (vector1, 0), __getitem__ (vector2, 1)), __mul__ (__getitem__ (vector1, 1), __getitem__ (vector2, 0))));
	});}
});
export var Vector4D =  __class__ ('Vector4D', [Vector], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		__call__ (__call__ (__super__, null, Vector4D, '__init__'), null, self, ...args);
		while (__lt__ (__call__ (len, null, self.coord), 3)) {
			__call__ (self.coord.append, self.coord, 0.0);
		}
		if (__lt__ (__call__ (len, null, self.coord), 4)) {
			__setitem__ (self.coord, 3, 1);
		}
		self.coord = __getslice__ (self.coord, 0, 4, 1);
	});}
});

//# sourceMappingURL=py_vector.map