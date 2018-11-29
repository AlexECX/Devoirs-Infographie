// Transcrypt'ed from Python, 2018-11-29 12:57:24
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {set_texture} from './textures.js';
import {Figure, Node, Transform} from './shapes.js';
var __name__ = 'planets';
export var Mars =  __class__ ('Mars', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Mars, '__init__') (self);
		var sphere_r = 10.0;
		self.shapeList.append (createModel (uvSphere (sphere_r, 25.0, 25.0)));
		var render_planet = function () {
			set_texture (2);
			self.generic_shape (self.shapeList [0]);
			set_texture (0);
		};
		var m = Transform ();
		self.figure.append (Node (m, render_planet, null, null));
		self.planet_rotate = mat4 ();
		setInterval (self.rotate, 50);
	});},
	get rotate () {return __get__ (this, function (self) {
		self.planet_rotate = mult (self.planet_rotate, rotate (0.5, 0, 1, 0));
	});}
});

//# sourceMappingURL=planets.map