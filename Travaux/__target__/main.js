// Transcrypt'ed from Python, 2018-11-29 12:54:42
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Mars} from './planets.js';
import {Mipmap, Skybox, Texture2D} from './textures.js';
import {SpaceShip, Transform} from './shapes.js';
import {clear_canvas, init_webgl_inst, select_shaders, webgl_render} from './webgl_utils.js';
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
	prog = createProgram (gl, vertexShaderSource, fragmentShaderSource);
	gl.useProgram (prog);
	CoordsLoc = gl.getAttribLocation (prog, 'vcoords');
	NormalLoc = gl.getAttribLocation (prog, 'vnormal');
	TexCoordLoc = gl.getAttribLocation (prog, 'vtexcoord');
	alphaLoc = gl.getUniformLocation (prog, 'alpha');
	ModelviewLoc = gl.getUniformLocation (prog, 'modelview');
	ProjectionLoc = gl.getUniformLocation (prog, 'projection');
	NormalMatrixLoc = gl.getUniformLocation (prog, 'normalMatrix');
	rotator = new SimpleRotator (canvas, render);
	rotator.setView (list ([0.3, 0.2, 0.5]), list ([0, 1.0, 0]), 60);
	ambientProduct = mult (lightAmbient, materialAmbient);
	diffuseProduct = mult (lightDiffuse, materialDiffuse);
	specularProduct = mult (lightSpecular, materialSpecular);
	gl.uniform4fv (gl.getUniformLocation (prog, 'ambientProduct'), flatten (ambientProduct));
	gl.uniform4fv (gl.getUniformLocation (prog, 'diffuseProduct'), flatten (diffuseProduct));
	gl.uniform4fv (gl.getUniformLocation (prog, 'specularProduct'), flatten (specularProduct));
	gl.uniform1f (gl.getUniformLocation (prog, 'shininess'), materialShininess);
	gl.uniform4fv (gl.getUniformLocation (prog, 'lightPosition'), flatten (lightPosition));
	projection = perspective (60.0, 1.0, 1.0, 2000.0);
	gl.uniformMatrix4fv (ProjectionLoc, false, flatten (projection));
	spaceship = SpaceShip ();
	envbox = Skybox (1000.0, Mipmap (gl, envImgPaths));
	mars = Mars ();
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
	 
	document.onkeydown = function (e) {
	    switch (e.key) {
	        case 'Home':
	            //resize the canvas to the current window width and height
	            resize(canvas)
	            break
	    };
	};
	document.getElementById("Cloak").onclick = invisible;
	
	    
	gl.uniform1f (alphaLoc, alpha);
	setInterval (render, 50);
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
export var initEnvMap = function (paths, onload) {
	var texture = gl.createTexture ();
	for (var path of paths) {
		texture.image = new Image ();
		
		        texture.image.onload = function (){
		            onload(texture);
		        }
	}
};
export var handleLoadedTexture = function (texture) {
	gl.bindTexture (gl.TEXTURE_2D, texture);
	gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	ntextures_loaded++;
	render ();
	gl.bindTexture (gl.TEXTURE_2D, null);
};
export var render = function () {
	gl.clearColor (0.79, 0.76, 0.27, 1);
	clear_canvas (gl);
	flattenedmodelview = rotator.getViewMatrix ();
	modelview = unflatten (flattenedmodelview);
	spaceship.transform.multi = scale (0.3, 0.3, 0.3);
	var mars_scale = mult (scale (0.3, 0.3, 0.3), scale (100, 100, 100));
	var m = mult (translate (0, 0, 1000.0), mars.planet_rotate);
	var m = mult (m, mars_scale);
	mars.transform.multi = m;
	if (all ((function () {
		var __accu0__ = [];
		for (var t of textureList) {
			__accu0__.append (t.isloaded);
		}
		return __accu0__;
	}) ()) && envbox.isloaded ()) {
		gl.enableVertexAttribArray (CoordsLoc);
		gl.enableVertexAttribArray (NormalLoc);
		gl.enableVertexAttribArray (TexCoordLoc);
		spaceship.traverse ();
		mars.traverse ();
	}
};


function handleLoadedTextureMap(texture) {

    ct++;
    if (ct == 6) {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        var targets = [
           gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
           gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
           gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];
        for (var j = 0; j < 6; j++) {
            gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

        texture.isloaded = true;

        render();  // Call render function when the image has been loaded (to insure the model is displayed)

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function initTexture2() {

    var urls = [
       "img/nebula_posx.png", "img/nebula_negx.png",
       "img/nebula_posy.png", "img/nebula_negy.png",
       "img/nebula_posz.png", "img/nebula_negz.png"
    ];

    texIDmap0 = gl.createTexture();
    texIDmap0.isloaded = false;  // this class member is created only to check if the image has been loaded

    for (var i = 0; i < 6; i++) {
        img[i] = new Image();
        img[i].onload = function () {  // this function is called when the image download is complete

            handleLoadedTextureMap(texIDmap0);
        }
        img[i].src = urls[i];   // this line starts the image downloading thread

    }


}

export function render2() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projection = perspective(60.0, 1.0, 1.0, 2000.0);

    //--- Get the rotation matrix obtained by the displacement of the mouse
    //---  (note: the matrix obtained is already "flattened" by the function getViewMatrix)
    flattenedmodelview = rotator.getViewMatrix();
    modelview = unflatten(flattenedmodelview);

    //--- Now extract the matrix that will affect normals (3X3).
    //--- It is achieved by simply taking the upper left portion (3X3) of the modelview matrix
    //--- (since normals are not affected by translations, only by rotations). 

    //normalMatrix = extractNormalMatrix(modelview);

    if (envbox.isloaded() ) {  // if texture images have been loaded

        var initialmodelview = modelview;

        // Draw the environment (box)
        gl.useProgram(prog); // Select the shader program that is used for the environment box.

        gl.uniformMatrix4fv(ProjectionLoc, false, flatten(projection));

        gl.enableVertexAttribArray(CoordsLoc);
        gl.disableVertexAttribArray(NormalLoc);     // normals are not used for the box
        gl.disableVertexAttribArray(TexCoordLoc);  // texture coordinates not used for the box

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, envbox.mipmap.texture);
        // Send texture to sampler
        gl.uniform1i(skyboxLoc, 0);

        envbox.skybox.render();

    }

}

//# sourceMappingURL=main.map