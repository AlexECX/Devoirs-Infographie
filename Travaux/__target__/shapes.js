// Transcrypt'ed from Python, 2018-12-04 14:31:44
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {set_texture} from './textures.js';
var __name__ = 'shapes';

/**
* Shortcut pour créer un objet ({} représente un dictionnaire en python).
*/
export var js_obj = function () {
	return {}
};
/**
* Shortcut to set Ambiant, Diffuse and Specular properties. 
*/
export var set_colors = function (Ka, Kd, Ks) {
	ambientProduct = mult (lightAmbient, Ka);
	diffuseProduct = mult (lightDiffuse, Kd);
	specularProduct = mult (lightSpecular, Ks);
	gl.uniform4fv (gl.getUniformLocation (prog, 'ambientProduct'), flatten (ambientProduct));
	gl.uniform4fv (gl.getUniformLocation (prog, 'diffuseProduct'), flatten (diffuseProduct));
	gl.uniform4fv (gl.getUniformLocation (prog, 'specularProduct'), flatten (specularProduct));
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
	get __init__ () {return __get__ (this, function (self, shapes) {
		if (typeof shapes == 'undefined' || (shapes != null && shapes.hasOwnProperty ("__kwargtrans__"))) {;
			var shapes = null;
		};
		self.figure = list ([]);
		self.shapeList = (shapes ? shapes : list ([]));
		self.stack = list ([]);
		self.transform = Transform ();
	});},
	get generic_shape () {return __get__ (this, function (self, shape_object) {
		//Fonction render de base pour à peu près tous les noeuds
		var initialModelView = modelview;
		var scaleSafeMatrix = mult (self.transform.translate, self.transform.rotate);
		normalMatrix = extractNormalMatrix (mult (modelview, scaleSafeMatrix));
		var instanceMatrix = mult (self.transform.multi, scaleSafeMatrix);
		var instanceMatrix = mult (instanceMatrix, self.transform.scale);
		modelview = mult (modelview, instanceMatrix);
		shape_object.render ();
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
		var m = Transform (__kwargtrans__ ({multi: translate (0, 5, 2)}));
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
		self.shapeList.append (createModel (cube (size)));
		self.shapeList.append (createModel (uvCylinder (10.0, cy_heigth, 25.0, false, false)));
		self.shapeList.append (createModel (tetrahedre (10.0)));
		self.shapeList.append (createModel (uvCylinder (10.0, cy_heigth, 25.0, true, true)));
		var rectangle = function () {
			self.generic_shape (self.shapeList [0]);
		};
		var wing_logo = function () {
			set_texture (1);
			self.generic_shape (self.shapeList [0]);
			set_texture (0);
		};
		var wing_long = function () {
			set_texture (2);
			self.generic_shape (self.shapeList [0]);
			set_texture (0);
		};
		var canon_main = function () {
			set_texture (3);
			self.generic_shape (self.shapeList [0]);
			set_texture (0);
		};
		var canon_housing = function () {
			set_texture (4);
			self.generic_shape (self.shapeList [0]);
			set_texture (0);
		};
		var canon_end = function () {
			set_texture (5);
			self.generic_shape (self.shapeList [1]);
			set_texture (0);
		};
		var cylinder = function () {
			self.generic_shape (self.shapeList [1]);
		};
		var reactor = function () {
			var Ka = vec4 ();
			var Kd = vec4 (255 / 255, 111 / 255, 71 / 255);
			var Ks = vec4 ();
			set_colors (Ka, Kd, Ks);
			set_texture (6);
			self.generic_shape (self.shapeList [1]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
			set_texture (0);
		};
		var reactor_exterior = function () {
			var Ka = vec4 ();
			var Kd = vec4 (17 / 255, 18 / 255, 13 / 255);
			var Ks = materialSpecular.__getslice__ (0, null, 1);
			set_colors (Ka, Kd, Ks);
			self.generic_shape (self.shapeList [3]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
		};
		var tetra = function () {
			var Ka = vec4 ();
			var Kd = vec4 (92 / 255, 22 / 255, 22 / 255);
			var Ks = materialSpecular.__getslice__ (0, null, 1);
			set_colors (Ka, Kd, Ks);
			self.generic_shape (self.shapeList [2]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
		};
		//#start wing construct
		var m = Transform (__kwargtrans__ ({scale: scale (2, 0.5, 2)}));
		self.figure.append (Node (m, wing_logo, null, ID + 1));
		ID++;
		var m = Transform (__kwargtrans__ ({translate: translate (0, 0, size), scale: scale (1, 1, 1)}));
		self.figure.append (Node (m, tetra, ID + 1, null));
		ID++;
		var m = Transform (__kwargtrans__ ({scale: scale (0.5, 1, 1.5)}));
		m.translate = translate ((size * 2) / 2 - size / 2, 0, -((size * 2) / 2 + (size * 3) / 2));
		self.figure.append (Node (m, wing_long, null, ID + 1));
		ID++;
		//#reactor interior
		var m = Transform (__kwargtrans__ ({translate: translate (0, 0, -(15)), scale: scale (0.4, 0.4, 0.03)}));
		self.figure.append (Node (m, reactor, ID + 2, ID + 1));
		ID++;
		//#reactor exterior
		var m = Transform (__kwargtrans__ ({scale: scale (1.01, 1.01, 2)}));
		self.figure.append (Node (m, reactor_exterior, null, null));
		ID++;
		//#cannon 1/3
		var m = Transform (__kwargtrans__ ({scale: scale (0.75, 0.8, 2 / 3)}));
		m.translate = translate (5 + 5 * 0.75, 0, -(3));
		self.figure.append (Node (m, canon_main, null, ID + 1));
		ID++;
		//#cannon 2/3
		var m = Transform (__kwargtrans__ ({scale: scale (0.8, 0.6, 0.5)}));
		m.translate = translate (0, 0, (size * 2) / 3 + size * 0.5);
		self.figure.append (Node (m, canon_housing, null, ID + 1));
		ID++;
		//#cannon 3/3
		var m = Transform (__kwargtrans__ ({scale: scale (0.15, (3 / 4) * 0.5, 0.3)}));
		m.translate = translate (0, 0, (size * 0.8) / 2 + (cy_heigth * 0.3) / 2);
		self.figure.append (Node (m, canon_end, null, null));
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
		self.shapeList.append (createModel (cube (size)));
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 22.0, false, false)));
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 6.0, false, false)));
		self.shapeList.append (createModel (quad (size, size, size / 2)));
		self.shapeList.append (FrontCannon ());
		var rectangle = function () {
			var Ka = vec4 (0.13, 0.13, 0.13);
			var Kd = vec4 (64 / 255, 64 / 255, 64 / 255);
			var Ks = materialSpecular.__getslice__ (0, null, 1);
			set_colors (Ka, Kd, Ks);
			self.generic_shape (self.shapeList [0]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
		};
		var cylinder = function () {
			var Ka = vec4 ();
			var Kd = vec4 (72 / 255, 7 / 255, 7 / 255);
			var Ks = materialSpecular.__getslice__ (0, null, 1);
			set_colors (Ka, Kd, Ks);
			set_texture (0);
			self.generic_shape (self.shapeList [1]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
			set_texture (0);
		};
		var cockpit_glass = function () {
			var Ka = vec4 (0.13, 0.13, 0.13);
			var Kd = materialDiffuse.__getslice__ (0, null, 1);
			var Ks = vec4 (0.75, 0.75, 0.75);
			set_colors (Ka, Kd, Ks);
			set_texture (7);
			self.generic_shape (self.shapeList [1]);
			set_texture (0);
		};
		var front_cylinder = function () {
			var Ka = vec4 ();
			var Kd = vec4 (92 / 255, 22 / 255, 22 / 255);
			var Ks = vec4 ();
			set_colors (Ka, Kd, Ks);
			self.generic_shape (self.shapeList [1]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
		};
		var m = Transform (__kwargtrans__ ({scale: scale (0.5, 1, 2.5)}));
		self.figure.append (Node (m, rectangle, ID + 1, ID + 2));
		ID++;
		var m = Transform (__kwargtrans__ ({scale: scale (0.505, 0.7, 0.7), rotate: rotate (45.0, 1, 0, 0), translate: translate (0, 0, size * 1.25)}));
		self.figure.append (Node (m, rectangle, null, null));
		ID++;
		
		//#mainframe cockpit start
		var m = Transform (__kwargtrans__ ({translate: translate (0, 0, size * 1.35), rotate: rotate (90.0, 0, 1, 0), scale: mult (scale (1, 0.5, 0.999), mat4invert (scale (0.5, 1, 2.5)))}));
		self.figure.append (Node (m, cylinder, null, ID + 1));
		ID++;
		var m = Transform (__kwargtrans__ ({rotate: rotate (50.0, 0, 0, 1), scale: scale (0.8, 1, 0.999), translate: translate (0, ((-(cy_r) * 1) / 2) * 0.45, ((cy_r * 1) / 2) * 1.15)}));
		self.figure.append (Node (m, cylinder, null, ID + 1));
		ID++;
		var m = Transform (__kwargtrans__ ({rotate: rotate (20.0, 0, 0, 1), translate: translate (0, (-(cy_r) * 1) / 4, (cy_r * 1) / 4), scale: scale (1, 1, 1.01)}));
		self.figure.append (Node (m, cylinder, ID + 1, ID + 2));
		ID++;
		var m = Transform (__kwargtrans__ ({rotate: rotate (-(30.0), 0, 0, 1), scale: scale (0.5, 0.5, 0.999), translate: translate (0, 4.5, 0)}));
		self.figure.append (Node (m, cockpit_glass, null, null));
		ID++;
		//#mainframe cockpit end
		        
		//#front
		var m = Transform (__kwargtrans__ ({rotate: rotate (-(80.0), 0, 0, 1), scale: scale (0.5, 0.5, 1.01), translate: translate (0, -(cy_heigth) * 1.15, cy_heigth * 0.8)}));
		self.figure.append (Node (m, front_cylinder, ID + 1, null));
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
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 6.0, false, false)));
		self.shapeList.append (createModel (uvCylinder (cy_r, cy_heigth, 25.0, false, false)));
		self.shapeList.append (createModel (quad (size, size, size / 2)));
		var cylinder6slice = function () {
			var Ka = vec4 ();
			var Kd = vec4 (191 / 255, 191 / 255, 191 / 255);
			var Ks = materialSpecular.__getslice__ (0, null, 1);
			set_colors (Ka, Kd, Ks);
			self.generic_shape (self.shapeList [0]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
		};
		var cylinder1 = function () {
			var Ka = vec4 ();
			var Kd = vec4 (65 / 255, 65 / 255, 65 / 255);
			var Ks = materialSpecular.__getslice__ (0, null, 1);
			set_colors (Ka, Kd, Ks);
			self.generic_shape (self.shapeList [1]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
		};
		var cylinder2 = function () {
			var Ka = vec4 ();
			var Kd = vec4 (103 / 255, 103 / 255, 103 / 255);
			var Ks = materialSpecular.__getslice__ (0, null, 1);
			set_colors (Ka, Kd, Ks);
			self.generic_shape (self.shapeList [1]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
		};
		var tri_rect = function () {
			var Ka = vec4 ();
			var Kd = vec4 (56 / 255, 15 / 255, 19 / 255);
			var Ks = materialSpecular.__getslice__ (0, null, 1);
			set_colors (Ka, Kd, Ks);
			self.generic_shape (self.shapeList [2]);
			set_colors (materialAmbient, materialDiffuse, materialSpecular);
		};
		var m = Transform (__kwargtrans__ ({rotate: rotate (30.0, 0, 0, 1), scale: scale (1, 1, 5)}));
		self.figure.append (Node (m, cylinder6slice, null, ID + 1));
		var p_ID = ID;
		ID++;
		var m = Transform (__kwargtrans__ ({scale: scale (1 / 3, 1 / 3, 1 + 6 / 5), translate: translate (0, 0, cy_heigth * 6)}));
		self.figure.append (Node (m, cylinder1, null, ID + 1));
		ID++;
		var m = Transform (__kwargtrans__ ({scale: scale (1.2, 1.2, 1 / 6), translate: translate (0, 0, -(cy_heigth) * 3)}));
		self.figure.append (Node (m, cylinder2, null, null));
		ID++;
		self.figure [p_ID].sibling = ID;
		ID++;
		var m = Transform (__kwargtrans__ ({rotate: mult (rotate (180.0, 0, 0, 1), rotate (-(90.0), 0, 1, 0)), scale: scale ((3 / 4) * size, 1, 0.5), translate: translate (-(cy_r) / 2, cy_r / 4, -(cy_heigth) * 5)}));
		self.figure.append (Node (m, tri_rect, null, null));
		ID++;
	});}
});

//# sourceMappingURL=shapes.map