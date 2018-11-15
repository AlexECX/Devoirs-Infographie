// Transcrypt'ed from Python, 2018-11-14 21:53:59
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'shapes';
export var js_obj = function () {
	var obj = {}
	return obj;
};
export var vec3_obj = function (x, y, z) {
	var vec = js_obj ();
	vec.x = x;
	vec.y = y;
	vec.z = z;
	return vec;
};
export var transformations = function (translate, rotation, scaling) {
	var obj = {}
	    obj.translate = translate || mat4()
	    obj.rotate = rotation || mat4()
	    obj.scale = scaling || mat4()
	    
	return obj;
};
export var tri_heigth = function (b, c) {
	var a = Math.sqrt (c * c - (b / 2) * (b / 2));
	return a;
};
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
export var Figure =  __class__ ('Figure', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self.figure = list ([]);
		self.shapeList = list ([]);
		self.scaleList = list ([]);
		self.ids = js_obj ();
		self.stack = list ([]);
		self.modelViewMatrix = mat4 ();
		self.preTransformList = list ([]);
		self.ids.list = list ([]);
		self.ids.id = -(1);
		var nextId = function () {
			self.ids.id = self.ids.id + 1;
			return self.ids.id;
		};
		self.ids.nextId = nextId;
	});},
	get traverse () {return __get__ (this, function (self) {
		self.ids.id = -(1);
		var _traverse = function (id) {
			self.stack.push (self.modelViewMatrix);
			self.modelViewMatrix = mult (self.modelViewMatrix, self.figure [id].transform);
			self.figure [id].render ();
			if (self.figure [id].child != null) {
				_traverse (self.figure [id].child);
			}
			self.modelViewMatrix = self.stack.py_pop ();
			if (self.figure [id].sibling != null) {
				_traverse (self.figure [id].sibling);
			}
		};
		_traverse (0);
	});}
});
export var SpaceShip =  __class__ ('SpaceShip', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (SpaceShip, '__init__') (self);
		var ID = 0;
		var m = mat4 ();
		var wing_render = function () {
			var surface = self.shapeList [0];
			surface.modelViewMatrix = self.modelViewMatrix;
			surface.traverse ();
		};
		self.shapeList.append (Wing ());
		var m = mult (translate (10, 0, 0), rotate (-(20.0), 0, 0, 1));
		self.figure.append (Node (m, wing_render, ID + 1, null));
		ID++;
		var m = mult (translate (-(10), 0, 0), rotate (20.0, 0, 0, 1));
		var m = mult (m, scale (-(1), 1, 1));
		self.figure.append (Node (m, wing_render, ID + 1, null));
		ID++;
		self.shapeList.append (CenterPiece ());
		var center_render = function () {
			var surface = self.shapeList [1];
			surface.modelViewMatrix = self.modelViewMatrix;
			surface.traverse ();
		};
		var m = translate (0, 5, 5);
		self.figure.append (Node (m, center_render, null, null));
		ID++;
	});},
	get render () {return __get__ (this, function (self) {
		self.modelViewMatrix = mat4 ();
		self.traverse ();
	});}
});
export var Wing =  __class__ ('Wing', [Figure], {
	__module__: __name__,
	size: 10.0,
	cy_heigth: 20.0,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Wing, '__init__') (self);
		var m = mat4 ();
		var size = self.size;
		var cy_heigth = self.cy_heigth;
		var ID = 0;
		self.shapeList.append (createModel (cube (size)));
		self.shapeList.append (createModel (uvCylinder (10.0, cy_heigth, 25.0, false, false)));
		var generic_shape = function (shapeList_index) {
			var sc = self.scaleList [self.ids.nextId ()];
			var initialModelView = modelview;
			normalMatrix = extractNormalMatrix (mult (modelview, self.modelViewMatrix));
			var instanceMatrix = mult (self.modelViewMatrix, scale (sc.x, sc.y, sc.z));
			modelview = mult (modelview, instanceMatrix);
			self.shapeList [shapeList_index].render ();
			modelview = initialModelView;
		};
		var rectangle = function () {
			generic_shape (0);
		};
		var cylinder = function () {
			generic_shape (1);
		};
		var sc = vec3_obj (2, 0.5, 2);
		self.scaleList.append (sc);
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		var sc = vec3_obj (sc.x / 2, sc.y, sc.z * 1.5);
		self.scaleList.append (sc);
		var m = translate ((sc.x * size) / 2, 0, -(size * sc.z - ((size * sc.z) / 1.5) / 4));
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		var p_sc = self.scaleList [1];
		var reactor = function () {
			var sc = self.scaleList [self.ids.nextId ()];
			var size = self.size;
			var initialModelView = modelview;
			var instanceMatrix = mult (self.modelViewMatrix, translate (0, (size * sc.y - (size * sc.y) * 0.1) / 2, 0));
			normalMatrix = extractNormalMatrix (mult (modelview, self.modelViewMatrix));
			var instanceMatrix = mult (instanceMatrix, scale (sc.x, sc.y * 0.1, sc.z));
			modelview = mult (modelview, instanceMatrix);
			self.shapeList [0].render ();
			modelview = initialModelView;
			var instanceMatrix = mult (self.modelViewMatrix, translate (0, -(size * sc.y - (size * sc.y) * 0.1) / 2, 0));
			normalMatrix = extractNormalMatrix (mult (modelview, self.modelViewMatrix));
			var instanceMatrix = mult (instanceMatrix, scale (sc.x, sc.y * 0.1, sc.z));
			modelview = mult (modelview, instanceMatrix);
			self.shapeList [0].render ();
			modelview = initialModelView;
			var instanceMatrix = mult (self.modelViewMatrix, translate ((size * sc.x - (size * sc.x) * 0.1) / 2, 0, 0));
			normalMatrix = extractNormalMatrix (mult (modelview, self.modelViewMatrix));
			var instanceMatrix = mult (instanceMatrix, scale (sc.x * 0.1, sc.y, sc.z));
			modelview = mult (modelview, instanceMatrix);
			self.shapeList [0].render ();
			modelview = initialModelView;
			var instanceMatrix = mult (self.modelViewMatrix, translate (-(size * sc.x - (size * sc.x) * 0.1) / 2, 0, 0));
			normalMatrix = extractNormalMatrix (mult (modelview, self.modelViewMatrix));
			var instanceMatrix = mult (instanceMatrix, scale (sc.x * 0.1, sc.y, sc.z));
			modelview = mult (modelview, instanceMatrix);
			self.shapeList [0].render ();
			modelview = initialModelView;
		};
		var sc = vec3_obj (p_sc.x * 0.75, p_sc.y * 0.75, p_sc.z * 0.1);
		self.scaleList.append (sc);
		var m = translate (0, 0, -((size * p_sc.z) / 2));
		self.figure.append (Node (m, reactor, ID + 1, null));
		ID++;
		var sc = vec3_obj (p_sc.x * 0.75, p_sc.y * 0.8, (p_sc.z * 2) / 3);
		self.scaleList.append (sc);
		var m = translate ((p_sc.x * size) / 2 + (sc.x * size) / 2, 0, (-(size) * p_sc.z) * 0.15);
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		var sc = vec3_obj (sc.x * 0.8, sc.y * 0.6, sc.z * 0.5);
		var p_sc = self.scaleList [2];
		self.scaleList.append (sc);
		var m = translate (0, 0, size * p_sc.x + size * sc.x);
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		var sc = vec3_obj ((sc.y * 0.8) / 2, (sc.y * 0.8) / 2, sc.z / 4);
		var p_sc = self.scaleList [2];
		self.scaleList.append (sc);
		var m = translate (0, 0, (size * p_sc.x) / 2 + (cy_heigth * sc.z) / 2);
		self.figure.append (Node (m, cylinder, null, null));
	});}
});
export var CenterPiece =  __class__ ('CenterPiece', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (CenterPiece, '__init__') (self);
		self.transform = transformations ();
		var m = mat4 ();
		var size = 10.0;
		var cy_heigth = 5.0;
		var cy_r = 10.0;
		var ID = 0;
		self.shapeList.append (createModel (cube (size)));
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 12.0, false, false)));
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 6.0, false, false)));
		self.shapeList.append (createModel (quad (size, size, size / 2)));
		var generic_shape = function (shapeList_index) {
			var sc = self.scaleList [self.ids.nextId ()];
			var initialModelView = modelview;
			normalMatrix = extractNormalMatrix (mult (modelview, self.modelViewMatrix));
			var instanceMatrix = mult (self.modelViewMatrix, scale (sc.x, sc.y, sc.z));
			modelview = mult (modelview, instanceMatrix);
			self.shapeList [shapeList_index].render ();
			modelview = initialModelView;
		};
		var rectangle = function () {
			generic_shape (0);
		};
		var cylinder = function () {
			generic_shape (1);
		};
		var cylinder6slice = function () {
			generic_shape (2);
		};
		var tri_rect = function () {
			generic_shape (3);
		};
		var sc = vec3_obj (0.5, 1, 3);
		var m = transformations (null, null, scale (sc.x, sc.y, sc.z));
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		var transfo = transformations ();
		transfo.rotate = rotate (90.0, 0, 1, 0);
		transfo.translate = translate (0, 0, (size * sc.z) / 2);
		var m = mult (trans, rotation);
		var sc = vec3_obj (1, 0.5, 1);
		self.scaleList.append (sc);
		self.figure.append (Node (m, cylinder, ID + 1, null));
		ID++;
		var trans = mult (trans, translate (0, ((-(cy_r) * sc.z) / 2) * 0.45, ((cy_r * sc.z) / 2) * 1.15));
		var rotation = mult (rotate (50.0, 1, 0, 0), rotation);
		var m = mult (trans, rotation);
		var sc = vec3_obj (sc.x * 0.8, sc.y, sc.z);
		self.scaleList.append (sc);
		self.figure.append (Node (m, cylinder, ID + 1, null));
		ID++;
		var trans = mult (trans, translate (0, ((-(cy_r) * sc.z) / 2) * 0.5, (cy_r * sc.z) / 4));
		var rotation = mult (rotate (20.0, 1, 0, 0), rotation);
		var m = mult (trans, rotation);
		var sc = vec3_obj (sc.x, sc.y, sc.z);
		self.scaleList.append (sc);
		self.figure.append (Node (m, cylinder, ID + 1, null));
		ID++;
		var m = mult (trans, translate (0, (-(cy_heigth) * sc.x) * 1.1, cy_heigth * sc.z));
		var m = mult (m, rotate (90.0, 0, 1, 0));
		var m = mult (m, rotate (60.0, 0, 0, 1));
		var sc = vec3_obj (sc.y * 0.5, sc.y * 0.5, sc.z);
		self.scaleList.append (sc);
		self.figure.append (Node (m, cylinder, ID + 1, null));
		ID++;
		var trans = mult (trans, translate ((cy_heigth * sc.z) / 2 + (cy_r * 0.25) / 2, -(cy_heigth) * sc.z, 0));
		var m = mult (trans, rotate (30.0, 0, 0, 1));
		var sc = vec3_obj (0.25, 0.25, 1);
		self.scaleList.append (sc);
		self.figure.append (Node (m, cylinder6slice, ID + 1, null));
		ID++;
		var trans = mult (trans, translate ((-(cy_r) * sc.x) / 2, (cy_r * sc.y) / 4, -(cy_heigth)));
		var m = mult (trans, mult (rotate (180.0, 0, 0, 1), rotate (-(90.0), 0, 1, 0)));
		var sc = vec3_obj (1, 0.25, 0.1);
		self.scaleList.append (sc);
		self.figure.append (Node (m, tri_rect, null, null));
		ID++;
	});},
	get traverse () {return __get__ (this, function (self) {
		self.ids.id = -(1);
		var _traverse = function (id) {
			self.stack.push (self.transform);
			if (self.tranform.translate) {
				// pass;
			}
			self.tranform.translate = mult ();
			self.modelViewMatrix = mult (self.modelViewMatrix, self.figure [id].transform);
			self.figure [id].render ();
			if (self.figure [id].child != null) {
				_traverse (self.figure [id].child);
			}
			self.modelViewMatrix = self.stack.py_pop ();
			if (self.figure [id].sibling != null) {
				_traverse (self.figure [id].sibling);
			}
		};
		_traverse (0);
	});}
});
export var FrontCannon =  __class__ ('FrontCannon', [object], {
	__module__: __name__,
});

//# sourceMappingURL=shapes.map