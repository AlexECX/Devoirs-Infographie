// Transcrypt'ed from Python, 2018-12-14 11:15:48
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Earth, Mars, Rotation, Venus} from './planets.js';
import {Mipmap, Skybox, Texture2D, set_texture_old} from './textures.js';
import {SpaceShip, Transform} from './shapes.js';
import {WebGLProgram, clear_canvas, init_webgl_inst} from './webgl_utils.js';
var __name__ = '__main__';
/*
The main module: 
- Will setup WebGL.
- Initialise the SpaceShip object
- Render the ship once and on onclick events
*/

//This is the main function
export var draw = function () {
	//init
	gl = init_webgl_inst ();
	var canvas = document.getElementById ('gl-canvas');
	//LOAD SHADER (standard texture mapping)
	var vertexShaderSource = getTextContent ('vshader');
	var fragmentShaderSource = getTextContent ('fshader');
	prog = WebGLProgram (gl, vertexShaderSource, fragmentShaderSource);
	prog_skybox = WebGLProgram (gl, getTextContent ('vshaderbox'), getTextContent ('fshaderbox'));
	prog_reflet = WebGLProgram (gl, getTextContent ('vshadermap'), getTextContent ('fshadermap'));
	prog.locate (gl.getAttribLocation, 'vcoords');
	prog.locate (gl.getAttribLocation, 'vnormal');
	prog.locate (gl.getAttribLocation, 'vtexcoord');
	prog.locate (gl.getUniformLocation, 'modelview');
	prog.locate (gl.getUniformLocation, 'projection');
	prog.locate (gl.getUniformLocation, 'normalMatrix');
	prog.locate (gl.getUniformLocation, 'lightPosition');
	prog.locate (gl.getUniformLocation, 'alpha');
	prog.locate (gl.getUniformLocation, 'texture');
	prog.locate (gl.getUniformLocation, 'shininess');
	prog_skybox.locate (gl.getAttribLocation, 'vcoords');
	prog_skybox.locate (gl.getAttribLocation, 'vnormal');
	prog_skybox.locate (gl.getAttribLocation, 'vtexcoord');
	prog_skybox.locate (gl.getUniformLocation, 'modelview');
	prog_skybox.locate (gl.getUniformLocation, 'projection');
	prog_skybox.locate (gl.getUniformLocation, 'skybox');
	prog_reflet.locate (gl.getAttribLocation, 'vcoords');
	prog_reflet.locate (gl.getAttribLocation, 'vnormal');
	prog_reflet.locate (gl.getUniformLocation, 'projection');
	prog_reflet.locate (gl.getUniformLocation, 'normalMatrix');
	prog_reflet.locate (gl.getUniformLocation, 'modelview');
	prog_reflet.locate (gl.getUniformLocation, 'skybox');
	ambientProduct = mult (lightAmbient, materialAmbient);
	diffuseProduct = mult (lightDiffuse, materialDiffuse);
	specularProduct = mult (lightSpecular, materialSpecular);
	projection = perspective (60.0, 1.0, 1.0, 3000.0);
	spaceship = SpaceShip ();
	skybox = Skybox (2999.0, Mipmap (gl, envImgPaths));
	earth = Earth ();
	mars = Mars ();
	venus = Venus ();
	box = createModelmap (cube (10.0));
	signature = createModel (cube (10.0));
	//preparation textures
	textureList = list ([]);
	textureList.append (Texture2D (gl, 'img/text1.jpg'));
	textureList.append (Texture2D (gl, 'img/text3.jpg'));
	textureList.append (Texture2D (gl, 'img/text5.jpg'));
	textureList.append (Texture2D (gl, 'img/textCanon.jpg'));
	textureList.append (Texture2D (gl, 'img/textCanon2.jpg'));
	textureList.append (Texture2D (gl, 'img/textCanon3.jpg'));
	textureList.append (Texture2D (gl, 'img/textBlanc.jpg'));
	textureList.append (Texture2D (gl, 'img/textCockpitGlass.jpg'));
	textureList.append (Texture2D (gl, 'img/earthmap1k.jpg'));
	textureList.append (Texture2D (gl, 'img/moonmap1k.jpg'));
	textureList.append (Texture2D (gl, 'img/mars_1k_color.jpg'));
	textureList.append (Texture2D (gl, 'img/venusmap.jpg'));
	textureList.append (Texture2D (gl, 'img/Signature.png'));
	kBoard_displace = Transform ();
	kBoard_displace.advancing = true;
	 
	document.onkeydown = function (e) {
	    var k = kBoard_displace
	    switch (e.key) {
	        case 'Home':
	            //resize the canvas to the current window width and height
	            resize(canvas)
	            break
	        case 'ArrowUp':
	            if (k.advancing == true) {
	                k.translate = mult (translate (0, 0, 5), k.translate);
	            }
	            else {
	                k.multi = mult (mult (k.rotate, k.translate), k.multi);
	                sky_rotate = mult(k.rotate, sky_rotate);
	                k.tranlate = translate (0, 0, 5);
	                k.rotate = mat4();
	                k.advancing = true;
	            }
	            break;
	        case 'ArrowDown':
	            if (k.advancing == true) {
	                k.translate = mult (translate (0, 0, -(5)), k.translate);
	            }
	            else {
	                k.multi = mult (mult (k.rotate, k.translate), k.multi);
	                sky_rotate = mult(k.rotate, sky_rotate);
	                k.tranlate = translate (0, 0, -5);
	                k.rotate = mat4();
	                k.advancing = true;
	            }            
	            break;
	        case 'ArrowRight':
	            if (!(k.advancing == true)) {
	                k.rotate = mult (rotate (2.0, 0, 1, 0), k.rotate);
	            }
	            else {
	                k.multi = mult (mult (k.rotate, k.translate), k.multi);
	                sky_rotate = mult(k.rotate, sky_rotate);
	                k.rotate = rotate (2.0, 0, 1, 0);
	                k.translate = mat4();
	                k.advancing = false;
	            }
	            break;
	        case 'ArrowLeft':
	            if (!(k.advancing == true)) {
	                k.rotate = mult (rotate (-2.0, 0, 1, 0), k.rotate);
	            }
	            else {
	                k.multi = mult (mult (k.rotate, k.translate), k.multi);
	                sky_rotate = mult(k.rotate, sky_rotate);
	                k.rotate = rotate (-2.0, 0, 1, 0);
	                k.translate = mat4();
	                k.advancing = false;
	            }            
	            break;
	    };
	};
	document.getElementById("Cloak").onclick = invisible;
	
	    
	globalRotator = Rotation (rotate (1.0, 0, 1, 0));
	setInterval (render, 50);
	render ();
};
export var invisible = function () {
	if (alpha == 0.01) {
		alpha = 0.011;
		setTimeout (function() {
		            alpha = 0.05;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 100);
		setTimeout (function() {
		            alpha = 0.1;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 200);
		setTimeout (function() {
		            alpha = 0.3;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 300);
		setTimeout (function() {
		            alpha = 0.5;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 400);
		setTimeout (function() {
		            alpha = 0.8;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 500);
		setTimeout (function() {
		            alpha = 1.0;
		            gl.uniform1f(alphaLoc, alpha);
		            gl.disable(gl.BLEND);
		            gl.depthMask(true);
		            render();
		        }
		, 600);
	}
	else if (alpha == 1.0) {
		alpha = 0.99;
		setTimeout (function() {
		            alpha = 0.8;
		            gl.uniform1f(alphaLoc, alpha);
		            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		            gl.enable(gl.BLEND);
		            gl.depthMask(false);
		            render();
		        }
		, 100);
		setTimeout (function() {
		            alpha = 0.5;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 200);
		setTimeout (function() {
		            alpha = 0.3;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 300);
		setTimeout (function() {
		            alpha = 0.1;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 400);
		setTimeout (function() {
		            alpha = 0.05;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 500);
		setTimeout (function() {
		            alpha = 0.01;
		            gl.uniform1f(alphaLoc, alpha);
		            render();
		        }
		, 600);
	}
};
export var render = function () {
	gl.clearColor (0.79, 0.76, 0.27, 1);
	clear_canvas (gl);
	spaceship.transform.multi = scale (0.3, 0.3, 0.3);
	var earth_scale = scale (30, 30, 30);
	var m = mult (translate (0, 0, 1000.0), earth_scale);
	earth.transform.multi = m;
	mars.transform.multi = mult (translate (1000.0, 0, 0), mult (earth_scale, scale (0.53, 0.53, 0.53)));
	venus.transform.multi = mult (translate (-(1000.0), 0, 0), mult (earth_scale, scale (0.94, 0.94, 0.94)));
	if (all ((function () {
		var __accu0__ = [];
		for (var t of textureList) {
			__accu0__.append (t.isloaded);
		}
		return __accu0__;
	}) ()) && skybox.isloaded ()) {
		var initialModelView = modelview;
		//initialise skybox program
		prog_skybox.useProgram ();
		gl.uniformMatrix4fv (prog_skybox.loc ('projection'), false, flatten (projection));
		gl.enableVertexAttribArray (prog_skybox.loc ('vcoords'));
		var m = mult (kBoard_displace.rotate, sky_rotate);
		modelview = mult (m, modelview);
		skybox.render (prog_skybox);
		modelview = initialModelView;
		//initialise env mapping program
		prog_reflet.useProgram ();
		gl.uniformMatrix4fv (prog_reflet.loc ('projection'), false, flatten (projection));
		gl.enableVertexAttribArray (prog_reflet.loc ('vcoords'));
		gl.enableVertexAttribArray (prog_reflet.loc ('vnormal'));
		gl.activeTexture (gl.TEXTURE0);
		gl.bindTexture (gl.TEXTURE_CUBE_MAP, skybox.mipmap.texture);
		gl.uniform1i (prog_reflet.loc ('skybox'), 0);
		var m = mult (kBoard_displace.rotate, kBoard_displace.translate);
		var m = mult (m, kBoard_displace.multi);
		modelview = mult (mult (m, modelview), translate (10, 10, 0));
		modelview = mult (modelview, globalRotator.rotation);
		normalMatrix = extractNormalMatrix (modelview);
		box.render (prog_reflet);
		modelview = initialModelView;
		//phong + texture general program
		prog.useProgram ();
		gl.uniform1f (prog.loc ('alpha'), alpha);
		gl.uniform1f (prog.loc ('shininess'), materialShininess);
		gl.uniform4fv (prog.loc ('lightPosition'), flatten (lightPosition));
		gl.uniformMatrix4fv (prog.loc ('projection'), false, flatten (projection));
		gl.enableVertexAttribArray (prog.loc ('vcoords'));
		gl.enableVertexAttribArray (prog.loc ('vnormal'));
		gl.enableVertexAttribArray (prog.loc ('vtexcoord'));
		modelview = mult (m, modelview);
		ModelviewLoc = prog.loc ('modelview');
		NormalMatrixLoc = prog.loc ('normalMatrix');
		CoordsLoc = prog.loc ('vcoords');
		NormalLoc = prog.loc ('vnormal');
		TexCoordLoc = prog.loc ('vtexcoord');
		spaceship.traverse ();
		earth.traverse ();
		mars.traverse ();
		venus.traverse ();
		//Signature box
		modelview = mult (modelview, translate (-(10), 10, 0));
		modelview = mult (modelview, globalRotator.rotation);
		gl.uniform1f (prog.loc ('alpha'), 0.5);
		gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable (gl.BLEND);
		gl.depthMask (false);
		set_texture_old (12);
		signature.render ();
		set_texture_old (0);
		gl.uniform1f (prog.loc ('alpha'), 1.0);
		gl.disable (gl.BLEND);
		gl.depthMask (true);
		modelview = initialModelView;
	}
};

//# sourceMappingURL=main.map