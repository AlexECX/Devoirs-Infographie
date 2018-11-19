// Transcrypt'ed from Python, 2018-11-18 01:21:57
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'shapes';

/**
* Shortcut pour créer un objet ({} représente un dictionnaire en python).
*/
export var js_obj = function () {
	return {}
};

/**
* Structure pour encapsuler des transformations matriciel.
* L'attribut "multi" est employé pour appliquer une matrice,
* composé ou non, après toutes les autres
*/
export var Transform =  __class__ ('Transform', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		var kwargs = dict ();
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
					}
				}
				delete kwargs.__kwargtrans__;
			}
		}
		else {
		}
		self.translate = kwargs.py_get ('translate', mat4 ());
		self.rotate = kwargs.py_get ('rotate', mat4 ());
		self.scale = kwargs.py_get ('scale', mat4 ());
		self.multi = kwargs.py_get ('multi', mat4 ());
	});},
	get scale_factor () {return __get__ (this, function (self) {
		var obj = {}
		obj.x = self.scale [0] [0];
		obj.y = self.scale [1] [1];
		obj.z = self.scale [2] [2];
		return obj;
	});},
	get combine () {return __get__ (this, function (self) {
		return self.__class__ (__kwargtrans__ ({multi: mult (self.multi, mult (self.translate, mult (self.rotate, self.scale)))}));
	});},
	get __copy__ () {return __get__ (this, function (self) {
		var newone = self.__class__ (__kwargtrans__ ({translate: self.translate, rotate: self.rotate, scale: self.scale, multi: self.multi}));
		return newone;
	});}
});
/**
* Element de liste chainée
*/
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
/**
* Classe représente un élément d'un modèle. Permet d'encapsuler
* un sous ensemble de noeuds
*/
export var Figure =  __class__ ('Figure', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self.figure = list ([]);
		self.shapeList = list ([]);
		self.stack = list ([]);
		self.transform = Transform ();
	});},
	get generic_shape () {return __get__ (this, function (self, shapeList_index) {
		//Fonction render de base pour à peu près tous les noeuds
		var initialModelView = modelview;
		var scaleSafeMatrix = mult (self.transform.translate, self.transform.rotate);
		normalMatrix = extractNormalMatrix (mult (modelview, scaleSafeMatrix));
		var instanceMatrix = mult (self.transform.multi, scaleSafeMatrix);
		var instanceMatrix = mult (instanceMatrix, self.transform.scale);
		modelview = mult (modelview, instanceMatrix);
		self.shapeList [shapeList_index].render ();
		modelview = initialModelView;
	});},
	get traverse () {return __get__ (this, function (self) {
		//Permet de traverser la liste chainée de l'objet
		var _traverse = function (id) {
			self.stack.push (self.transform.__copy__ ());
			self.transform.translate = mult (self.transform.translate, self.figure [id].transform.translate);
			self.transform.rotate = mult (self.transform.rotate, self.figure [id].transform.rotate);
			self.transform.scale = mult (self.transform.scale, self.figure [id].transform.scale);
			self.transform.multi = mult (self.transform.multi, self.figure [id].transform.multi);
			self.figure [id].render ();
			if (self.figure [id].child != null) {
				_traverse (self.figure [id].child);
			}
			self.transform = self.stack.py_pop ();
			if (self.figure [id].sibling != null) {
				_traverse (self.figure [id].sibling);
			}
		};
		_traverse (0);
	});}
});
/**
* Classe mère du vaisseau.
*/
export var SpaceShip =  __class__ ('SpaceShip', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (SpaceShip, '__init__') (self);
		var ID = 0;
		self.shapeList.append (Wing ());
		self.shapeList.append (CenterPiece ());
		var wing_render = function () {
			var surface = self.shapeList [0];
			surface.transform = self.transform.combine ();
			surface.traverse ();
		};
		var m = Transform (__kwargtrans__ ({translate: translate (10, 0, 0), rotate: rotate (-(20.0), 0, 0, 1), scale: scale (1, 0.75, 1)}));
		self.figure.append (Node (m, wing_render, ID + 1, null));
		ID++;
		var m = Transform (__kwargtrans__ ({translate: translate (-(10), 0, 0), rotate: rotate (20.0, 0, 0, 1), scale: scale (-(1), 0.75, 1)}));
		self.figure.append (Node (m, wing_render, ID + 1, null));
		ID++;
		var center_render = function () {
			var surface = self.shapeList [1];
			surface.transform = self.transform;
			surface.traverse ();
		};
		var m = Transform (__kwargtrans__ ({multi: translate (0, 5, 5)}));
		self.figure.append (Node (m, center_render, null, null));
		ID++;
	});},
	get render () {return __get__ (this, function (self) {
		self.transform = Transform ();
		self.traverse ();
	});}
});
/**
* Une aile du vaisseau
*/
export var Wing =  __class__ ('Wing', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Wing, '__init__') (self);
		var size = 10.0;
		var cy_heigth = 20.0;
		var ID = 0;
		var generic_shape = self.generic_shape;
		self.shapeList.append (createModel (cube (size)));
		self.shapeList.append (createModel (uvCylinder (10.0, cy_heigth, 25.0, false, false)));
		self.shapeList.append (createModel (tetrahedre (10.0)));
		var rectangle = function () {
			generic_shape (0);
		};
		var cylinder = function () {
			generic_shape (1);
		};
		var tetra = function () {
			generic_shape (2);
		};
		//#start wing construct
		var m = Transform (__kwargtrans__ ({scale: scale (2, 0.5, 2)}));
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		var m = Transform (__kwargtrans__ ({translate: translate (0, 0, size), scale: scale (1, 1, 1)}));
		self.figure.append (Node (m, tetra, ID + 1, null));
		ID++;
		var m = Transform (__kwargtrans__ ({scale: scale (0.5, 1, 1.5)}));
		m.translate = translate ((size * 2) / 2 - size / 2, 0, -((size * 2) / 2 + (size * 3) / 2));
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		//#reactor
		/*
		        
		        def reactor():
		            surface = self.shapeList[2]
		            surface.transform = self.transform
		            surface.traverse()
		
		        m = Transform(
		            translate=translate(0,5,-15),
		            scale=scale(.5,.5,.10)
		        )
		        
		        self.figure.append(Node(m, reactor, ID + 1, None))
		        ID += 1
		        */
		var m = Transform (__kwargtrans__ ({translate: translate (0, 0, -(15)), scale: scale (0.4, 0.4, 0.03)}));
		self.figure.append (Node (m, cylinder, ID + 1, null));
		ID++;
		//#cannon 1/3
		var p_sc = m.scale_factor ();
		var m = Transform (__kwargtrans__ ({scale: scale (0.75, 0.8, 2 / 3)}));
		var sc = m.scale_factor ();
		m.translate = translate (5 + 5 * sc.x, 0, -(3));
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		//#cannon 2/3
		var p_sc = sc;
		var m = Transform (__kwargtrans__ ({scale: scale (0.8, 0.6, 0.5)}));
		var sc = m.scale_factor ();
		m.translate = translate (0, 0, size * p_sc.z + size * sc.z);
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		//#cannon 3/3
		var p_sc = sc;
		var m = Transform (__kwargtrans__ ({scale: scale (0.15, (3 / 4) * 0.5, 0.3)}));
		var sc = m.scale_factor ();
		m.translate = translate (0, 0, (size * p_sc.x) / 2 + (cy_heigth * sc.z) / 2);
		self.figure.append (Node (m, cylinder, null, null));
	});}
});
/**
* La partie central du vaisseau, ainsi que le cockpit
*/
export var CenterPiece =  __class__ ('CenterPiece', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (CenterPiece, '__init__') (self);
		var m = mat4 ();
		var size = 10.0;
		var cy_heigth = 5.0;
		var cy_r = 10.0;
		var ID = 0;
		var generic_shape = self.generic_shape;
		self.shapeList.append (createModel (cube (size)));
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 22.0, false, false)));
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 6.0, false, false)));
		self.shapeList.append (createModel (quad (size, size, size / 2)));
		self.shapeList.append (FrontCannon ());
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
		var transfo = Transform (__kwargtrans__ ({scale: scale (0.5, 1, 3)}));
		var m = transfo;
		self.figure.append (Node (m, rectangle, null, ID + 1));
		ID++;
		
		//#mainframe cockpit start
		var sc = transfo.scale_factor ();
		var transfo = Transform (__kwargtrans__ ({rotate: rotate (90.0, 0, 1, 0), scale: mult (scale (1, 0.5, 1), mat4invert (transfo.scale))}));
		transfo.translate = translate (0, 0, (size * sc.z) / 2);
		var m = transfo;
		self.figure.append (Node (m, cylinder, null, ID + 1));
		ID++;
		var sc = transfo.scale_factor ();
		var transfo = Transform (__kwargtrans__ ({rotate: rotate (50.0, 0, 0, 1), scale: scale (0.8, 1, 1), translate: translate (0, ((-(cy_r) * 1) / 2) * 0.45, ((cy_r * 1) / 2) * 1.15)}));
		var m = transfo;
		self.figure.append (Node (m, cylinder, null, ID + 1));
		ID++;
		var sc = transfo.scale_factor ();
		var transfo = Transform (__kwargtrans__ ({rotate: rotate (20.0, 0, 0, 1), translate: translate (0, (-(cy_r) * 1) / 4, (cy_r * 1) / 4)}));
		var m = transfo;
		self.figure.append (Node (m, cylinder, null, ID + 1));
		ID++;
		//#mainframe cockpit end
		        
		var sc = transfo.scale_factor ();
		var transfo = Transform (__kwargtrans__ ({rotate: rotate (-(80.0), 0, 0, 1), scale: scale (0.5, 0.5, 1), translate: translate (0, -(cy_heigth) * 1.1, cy_heigth * 0.8)}));
		var m = transfo;
		self.figure.append (Node (m, cylinder, ID + 1, null));
		ID++;
		//#canon
		var canon_right = function () {
			var surface = self.shapeList [4];
			surface.transform = self.transform.combine ();
			surface.traverse ();
		};
		var m = Transform (__kwargtrans__ ({translate: translate (cy_heigth / 2 + cy_heigth / 4, -(cy_heigth), 0), scale: mult (scale (0.5, 0.5, 0.5), mat4invert (scale (0.8, 0.5, 1))), rotate: mat4invert (mult (rotate (90.0, 0, 1, 0), rotate (70, 0, 0, 1)))}));
		self.figure.append (Node (m, canon_right, ID + 1, null));
		ID++;
		//#canon
		var canon_left = function () {
			var surface = self.shapeList [4];
			surface.transform = self.transform.combine ();
			surface.transform.translate = scale (-(1), 1, 1);
			surface.traverse ();
		};
		var m = m.__copy__ ();
		m.translate = translate (-(cy_heigth / 2 + cy_heigth / 4), -(cy_heigth), 0);
		self.figure.append (Node (m, canon_left, null, null));
	});}
});
/**
* Un canon avant du vaisseau
*/
export var FrontCannon =  __class__ ('FrontCannon', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (FrontCannon, '__init__') (self);
		var m = mat4 ();
		var size = 5.0;
		var cy_heigth = 2.5;
		var cy_r = 5.0;
		var ID = 0;
		var generic_shape = self.generic_shape;
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 6.0, false, false)));
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 25.0, false, false)));
		self.shapeList.append (createModel (quad (size, size, size / 2)));
		var cylinder6slice = function () {
			generic_shape (0);
		};
		var cylinder = function () {
			generic_shape (1);
		};
		var tri_rect = function () {
			generic_shape (2);
		};
		var transfo = Transform (__kwargtrans__ ({rotate: rotate (30.0, 0, 0, 1), scale: scale (1, 1, 5)}));
		var m = transfo;
		self.figure.append (Node (m, cylinder6slice, null, ID + 1));
		var p_ID = ID;
		ID++;
		var sc = transfo.scale_factor ();
		var transfo = Transform (__kwargtrans__ ({scale: scale (1 / 3, 1 / 3, 1 + 6 / 5), translate: translate (0, 0, cy_heigth * 6)}));
		var m = transfo;
		self.figure.append (Node (m, cylinder, null, ID + 1));
		ID++;
		var transfo = Transform (__kwargtrans__ ({scale: scale (1.2, 1.2, 1 / 6), translate: translate (0, 0, -(cy_heigth) * 3)}));
		var m = transfo;
		self.figure.append (Node (m, cylinder, null, null));
		ID++;
		self.figure [p_ID].sibling = ID;
		ID++;
		var sc = sc;
		var transfo = Transform (__kwargtrans__ ({rotate: mult (rotate (180.0, 0, 0, 1), rotate (-(90.0), 0, 1, 0)), scale: scale ((3 / 4) * size, 1, 0.5), translate: translate (-(cy_r) / 2, cy_r / 4, -(cy_heigth) * 5)}));
		var m = transfo;
		self.figure.append (Node (m, tri_rect, null, null));
		ID++;
	});}
});
/**
* L'extrémité d'un réacteur. Je n'ai pas réussi à terminer l'implémentation
*/
export var Reactor =  __class__ ('Reactor', [Figure], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Reactor, '__init__') (self);
		var size = 10.0;
		var ID = 0;
		var m = Transform ();
		var generic_shape = self.generic_shape;
		self.shapeList.append (createModel (cube (size)));
		var render = function (transform) {
			var initialModelView = modelview;
			var scaleSafeMatrix = mult (self.transform.translate, transform.translate);
			var scaleSafeMatrix = mult (scaleSafeMatrix, mult (self.transform.rotate, transform.rotate));
			normalMatrix = extractNormalMatrix (mult (modelview, scaleSafeMatrix));
			var instaceMatrix = mult (self.transform.multi, transform.multi);
			var instanceMatrix = mult (instaceMatrix, scaleSafeMatrix);
			var instanceMatrix = mult (instanceMatrix, transform.scale);
			modelview = mult (modelview, instanceMatrix);
			self.shapeList [0].render ();
			modelview = initialModelView;
		};
		var sides = function () {
			var transform = self.preTransformList [self.ids.nextId ()];
			var sc = self.transform.scale_factor ();
			transform.translate [0] [3] = transform.translate [0] [3] * sc.x;
			transform.scale = mult (transfo.scale, scale (1, sc.y, 1));
			self.transform.scale [0] [0] = 1;
			self.transform.scale [1] [1] = 1;
			render (transform);
			self.transform.scale = scale (sc.x, sc.y, sc.z);
		};
		var topbot = function () {
			var transform = self.preTransformList [self.ids.nextId ()];
			var sc = self.transform.scale_factor ();
			transform.translate [1] [3] = transform.translate [1] [3] * sc.y;
			transform.scale = mult (transfo.scale, scale (sc.x, 1, 1));
			self.transform.scale [0] [0] = 1;
			self.transform.scale [1] [1] = 1;
			render (transform);
			self.transform.scale = scale (sc.x, sc.y, sc.z);
		};
		var transfo = Transform (__kwargtrans__ ({translate: translate ((size / 2) * 0.9, 0, 0), scale: scale (0.1, 1, 1)}));
		self.preTransformList.append (transfo);
		self.figure.append (Node (m, sides, ID + 1, null));
		ID++;
		var transfo = Transform (__kwargtrans__ ({translate: translate (-((size / 2) * 0.9), 0, 0), scale: scale (0.1, 1, 1)}));
		self.preTransformList.append (transfo);
		self.figure.append (Node (m, sides, ID + 1, null));
		ID++;
		var transfo = Transform (__kwargtrans__ ({translate: translate (0, (size / 2) * 0.9, 0), scale: scale (1, 0.1, 1)}));
		self.preTransformList.append (transfo);
		self.figure.append (Node (m, topbot, ID + 1, null));
		ID++;
		var transfo = Transform (__kwargtrans__ ({translate: translate (0, -((size / 2) * 0.9), 0), scale: scale (1, 0.1, 1)}));
		self.preTransformList.append (transfo);
		self.figure.append (Node (m, topbot, null, null));
		ID++;
	});}
});

//# sourceMappingURL=shapes.map