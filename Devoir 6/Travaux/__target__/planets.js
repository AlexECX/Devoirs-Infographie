// Transcrypt'ed from Python, 2018-12-14 11:43:36
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {set_texture_old} from './textures.js';
import {Figure, Node, Transform} from './shapes.js';
var __name__ = 'planets';
/**
* Encapsulation d'une matrice de rotation auto incrémenté tout les 50 ms
*/
export var Rotation =  __class__ ('Rotation', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, r_matrix) {
		self.rotation = mat4 ();
		self.rotate_matrix = (r_matrix ? r_matrix : rotate (0.1, 0, 1, 0));
		setInterval (self.rotate, 50);
	});},
	get rotate () {return __get__ (this, function (self) {
		self.rotation = mult (self.rotation, self.rotate_matrix);
	});}
});
export var Earth =  __class__ ('Earth', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Earth, '__init__') (self);
		self.shapeList.append (createModel (uvSphere (10, 25.0, 25.0)));
		self.moon = Rotation (rotate (0.8, 0, 1, 0));
		self.moon_orbit = Rotation (rotate (-(0.2), 0, 1, 0));
		self.rotator = Rotation ();
		var render_planet = function () {
			set_texture_old (8);
			var save = self.transform.rotate;
			self.transform.rotate = mult (self.rotation, self.transform.rotate);
			self.generic_shape (self.shapeList [0]);
			self.transform.rotate = save;
			set_texture_old (0);
		};
		var m = Transform (__kwargtrans__ ({rotate: rotate (-(90.0), 1, 0, 0)}));
		self.figure.append (Node (m, render_planet, null, 1));
		var render_moon = function () {
			set_texture_old (9);
			var save = self.transform.rotate;
			self.transform.rotate = mult (self.moon.rotation, self.transform.rotate);
			self.transform.multi = mult (self.transform.multi, self.moon_orbit.rotation);
			self.generic_shape (self.shapeList [0]);
			self.transform.rotate = save;
			set_texture_old (0);
		};
		var m = Transform (__kwargtrans__ ({translate: translate (0, 0, -(22)), scale: scale (0.27, 0.27, 0.27)}));
		self.figure.append (Node (m, render_moon, null, null));
	});},
	get _get_rotation () {return __get__ (this, function (self) {
		return self.rotator.rotation;
	});}
});
Object.defineProperty (Earth, 'rotation', property.call (Earth, Earth._get_rotation));;
export var Mars =  __class__ ('Mars', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Mars, '__init__') (self);
		self.shapeList.append (createModel (uvSphere (10, 25.0, 25.0)));
		self.rotator = Rotation ();
		var render_planet = function () {
			set_texture_old (10);
			var save = self.transform.rotate;
			self.transform.rotate = mult (self.rotation, self.transform.rotate);
			self.generic_shape (self.shapeList [0]);
			self.transform.rotate = save;
			set_texture_old (0);
		};
		var m = Transform (__kwargtrans__ ({rotate: rotate (-(90.0), 1, 0, 0)}));
		self.figure.append (Node (m, render_planet, null, null));
	});},
	get _get_rotation () {return __get__ (this, function (self) {
		return self.rotator.rotation;
	});}
});
Object.defineProperty (Mars, 'rotation', property.call (Mars, Mars._get_rotation));;
export var Venus =  __class__ ('Venus', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Venus, '__init__') (self);
		self.shapeList.append (createModel (uvSphere (10, 25.0, 25.0)));
		self.rotator = Rotation ();
		var render_planet = function () {
			set_texture_old (11);
			var save = self.transform.rotate;
			self.transform.rotate = mult (self.rotation, self.transform.rotate);
			self.generic_shape (self.shapeList [0]);
			self.transform.rotate = save;
			set_texture_old (0);
		};
		var m = Transform (__kwargtrans__ ({rotate: rotate (-(90.0), 1, 0, 0)}));
		self.figure.append (Node (m, render_planet, null, null));
	});},
	get _get_rotation () {return __get__ (this, function (self) {
		return self.rotator.rotation;
	});}
});
Object.defineProperty (Venus, 'rotation', property.call (Venus, Venus._get_rotation));;

//# sourceMappingURL=planets.map