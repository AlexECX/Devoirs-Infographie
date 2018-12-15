// Transcrypt'ed from Python, 2018-12-14 11:40:21
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {render} from './main.js';
var __name__ = 'textures';
/**
* Shortcut to set the texture (deprecated). 
* TODO replace texture search by index
*/
export var set_texture_old = function (index) {
	gl.activeTexture (gl.TEXTURE0);
	gl.bindTexture (gl.TEXTURE_2D, textureList [index].texture);
	gl.uniform1i (gl.getUniformLocation (prog.prog, 'texture'), 0);
};
export var set_mipmap = function (mipmap) {
	gl.activeTexture (gl.TEXTURE0);
	gl.bindTexture (gl.TEXTURE_CUBE_MAP, mipmap.texture);
	gl.uniform1i (gl.getUniformLocation (prog.prog, 'skybox'), 0);
};
/**
* Encapsule une WebGL Texture 2D. Génère la texture à partir du chemin
* vers une image et l'associe à un handler qui traite la texture d'est
* quelle est chargé.
*/
export var Texture2D =  __class__ ('Texture2D', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, gl, path) {
		self.gl = gl;
		self.isloaded = false;
		self.img = null;
		self.loadedTextures = 0;
		self.texture = gl.createTexture ();
		self.img = new Image ();
		self.img.onload = function () { self.handleLoadedTexture2D(self.texture) }
		self.img.src = path;
	});},
	get handleLoadedTexture2D () {return __get__ (this, function (self, texture) {
		var gl = self.gl;
		gl.bindTexture (gl.TEXTURE_2D, texture);
		gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.img);
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		self.isloaded = true;
		self.loadedTextures++;
		render ();
		gl.bindTexture (gl.TEXTURE_2D, null);
	});}
});
/**
* Encapsule une WebGL Mipmap (gl.TEXTURE_CUBE_MAP seulement). Génère la 
* cube_map à partir d'une liste de 6 chemin vers des images et l'associe 
* à un handler qui traite la texture d'est quelle est chargé.
*/
export var Mipmap =  __class__ ('Mipmap', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, gl, paths) {
		self.gl = gl;
		self.isloaded = false;
		self.imgs = list ([]);
		self.map_size = len (paths);
		self.loadedTextures = 0;
		self.texture = gl.createTexture ();
		for (var path of paths) {
			var img = new Image ();
			img.onload = function () { self.handleLoadedTextureMap(self.texture) }
			img.src = path;
			self.imgs.append (img);
		}
	});},
	get handleLoadedTextureMap () {return __get__ (this, function (self, texture) {
		self.loadedTextures++;
		var gl = self.gl;
		if (self.loadedTextures == self.map_size) {
			gl.bindTexture (gl.TEXTURE_CUBE_MAP, texture);
			gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, false);
			var targets = list ([gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]);
			for (var [j, img] of enumerate (self.imgs)) {
				gl.texImage2D (targets [j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
				gl.texParameteri (gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri (gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
			gl.generateMipmap (gl.TEXTURE_CUBE_MAP);
			self.isloaded = true;
			render ();
			gl.bindTexture (gl.TEXTURE_2D, null);
		}
	});}
});
/**
* Encapsulation d'une skybox. 
* @size la taille de la skybox
* @mipmap la texture utilisé par la skybox
*/
export var Skybox =  __class__ ('Skybox', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, size, mipmap) {
		self.skybox = createModelbox (cube (size));
		self.mipmap = mipmap;
	});},
	get render () {return __get__ (this, function (self, program) {
		gl.activeTexture (gl.TEXTURE0);
		gl.bindTexture (gl.TEXTURE_CUBE_MAP, self.mipmap.texture);
		gl.uniform1i (program.loc ['skybox'], 0);
		self.skybox.render (program);
	});},
	get isloaded () {return __get__ (this, function (self) {
		return self.mipmap.isloaded;
	});}
});

//# sourceMappingURL=textures.map