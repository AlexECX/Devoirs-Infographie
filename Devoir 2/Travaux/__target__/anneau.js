// Transcrypt'ed from Python, 2018-10-03 21:11:25
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Vector3D, Vector4D} from './py_vector.js';
var __name__ = '__main__';
/*
The main module: 
- Will setup WebGL.
- Will generate a square "ring", using points of a single cube.
*/
export var gl = null;
export var program = null;
//2D or 3D dimension
export var render_D = 3;
export var points = list ([]);
export var solidcolors = list ([]);
export var shadedcolors = list ([]);
export var xAxis = 0;
export var yAxis = 1;
export var zAxis = 2;
export var axis = 0;
export var theta = list ([0, 0, 0]);
//The starting cube scalling
export var ori_scale = Vector4D (0.3, 0.3, 0.3, 1);
//The starting cube displacement from the origin 0
export var ori_disp = Vector4D (0, 0, 0, 0);
export var BaseColors = list ([vec4 (0.0, 0.0, 0.0, 1.0), vec4 (1.0, 0.0, 0.0, 1.0), vec4 (1.0, 1.0, 0.0, 1.0), vec4 (0.0, 1.0, 0.0, 1.0), vec4 (0.0, 0.0, 1.0, 1.0), vec4 (1.0, 0.0, 1.0, 1.0), vec4 (0.0, 1.0, 1.0, 1.0), vec4 (1.0, 1.0, 1.0, 1.0)]);

//This is the main 3D function
export var draw = function () {
	gl = init_webgl_inst ();
	clear_canvas (gl);
	program = select_shaders (gl, 'vertex-shader2', 'fragment-shader');
	colorCube ();
	var solidcolorsBuffer = gl.createBuffer ();
	gl.bindBuffer (gl.ARRAY_BUFFER, solidcolorsBuffer);
	gl.bufferData (gl.ARRAY_BUFFER, flatten (solidcolors), gl.STATIC_DRAW);
	var vColorLoc = gl.getAttribLocation (program, 'vColor');
	gl.vertexAttribPointer (vColorLoc, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray (vColorLoc);
	var shadedcolorsBuffer = gl.createBuffer ();
	var thetaLoc = gl.getUniformLocation (program, 'theta');
	
	//event listeners for buttons
	var xSlider = function () {
		var s = float (this.value);
		__setitem__ (ori_disp, 0, s);
	};
	document.getElementById ('xSlider').oninput = xSlider;
	var ySlider = function () {
		var s = float (this.value);
		__setitem__ (ori_disp, 1, s);
	};
	document.getElementById ('ySlider').oninput = ySlider;
	var zSlider = function () {
		var s = float (this.value);
		__setitem__ (ori_disp, 2, s);
	};
	document.getElementById ('zSlider').oninput = zSlider;
	var SizeSlider = function () {
		var s = float (this.value);
		ori_scale = __call__ (Vector4D, null, s, s, s, 1);
	};
	document.getElementById ('SizeSlider').oninput = SizeSlider;
	var xButton = function () {
		axis = xAxis;
	};
	document.getElementById ('xButton').onclick = xButton;
	var yButton = function () {
		axis = yAxis;
	};
	document.getElementById ('yButton').onclick = yButton;
	var zButton = function () {
		axis = zAxis;
	};
	document.getElementById ('zButton').onclick = zButton;
	var ShadedButton = function () {
		gl.bindBuffer (gl.ARRAY_BUFFER, shadedcolorsBuffer);
		gl.bufferData (gl.ARRAY_BUFFER, flatten (shadedcolors), gl.STATIC_DRAW);
		gl.vertexAttribPointer (vColorLoc, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray (vColorLoc);
	};
	document.getElementById ('ShadedButton').onclick = ShadedButton;
	var SolidButton = function () {
		gl.bindBuffer (gl.ARRAY_BUFFER, solidcolorsBuffer);
		gl.bufferData (gl.ARRAY_BUFFER, flatten (solidcolors), gl.STATIC_DRAW);
		gl.vertexAttribPointer (vColorLoc, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray (vColorLoc);
	};
	document.getElementById ('SolidButton').onclick = SolidButton;
	
	//Where the scaling and translating is done, followed by render
	var render_loop = function () {
		clear_canvas (gl);
		theta [axis] += 2.0;
		gl.uniform3fv (thetaLoc, theta);
		var vDisplacementLoc = gl.getUniformLocation (program, 'vDisplacement');
		var vScaleLoc = gl.getUniformLocation (program, 'vScale');
		
		//The boxes 
		var boxs_dist = list ([
            ori_disp, 
            __add__ (ori_disp, __call__ (Vector4D, null, 0, __mul__ (__getitem__ (ori_scale, 1), 2), 0, 0)), 
            __add__ (ori_disp, __call__ (Vector4D, null, __mul__ (__getitem__ (ori_scale, 0), 2), 0, 0, 0)), 
            __add__ (ori_disp, __call__ (Vector4D, null, __mul__ (__getitem__ (ori_scale, 0), 2), __mul__ (__getitem__ (ori_scale, 1), 2), 0, 0))
        ]);
		for (var dist of boxs_dist) {
			gl.uniform4fv (vDisplacementLoc, flatten (dist.as_list ()));
			gl.uniform4fv (vScaleLoc, flatten (ori_scale.as_list ()));
			render (gl, program, gl.TRIANGLES, points);
        }
        
        //The sticks
		var stick_x = __mul__ (ori_scale, __call__ (Vector4D, null, __truediv__ (1, 3), 2, __truediv__ (1, 3), 1));
		var stick_y = __mul__ (ori_scale, __call__ (Vector4D, null, 2, __truediv__ (1, 3), __truediv__ (1, 3), 1));
		var sticks_dist = list ([
            __add__ (ori_disp, __call__ (Vector4D, null, 0, __getitem__ (ori_scale, 1), 0, 0)), 
            __add__ (ori_disp, __call__ (Vector4D, null, __mul__ (__getitem__ (ori_scale, 0), 2), __getitem__ (ori_scale, 1), 0, 0)), 
            __add__ (ori_disp, __call__ (Vector4D, null, __getitem__ (ori_scale, 0), 0, 0, 0)),
            __add__ (ori_disp, __call__ (Vector4D, null, __getitem__ (ori_scale, 0), __mul__ (__getitem__ (ori_scale, 1), 2), 0, 0))
        ]);
		
		//The horizontal sticks 
		for (var dist of sticks_dist.__getslice__ (0, 2, 1)) {
			gl.uniform4fv (vDisplacementLoc, flatten (dist.as_list ()));
			gl.uniform4fv (vScaleLoc, flatten (stick_x.as_list ()));
			render (gl, program, gl.TRIANGLES, points);
		}
		
		//The vertical sticks 
		for (var dist of sticks_dist.__getslice__ (2, 4, 1)) {
			gl.uniform4fv (vDisplacementLoc, flatten (dist.as_list ()));
			gl.uniform4fv (vScaleLoc, flatten (stick_y.as_list ()));
			render (gl, program, gl.TRIANGLES, points);
		}
		requestAnimFrame (render_loop);
	};
	render_loop ();
};

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) 
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.8, 0.8, 0.8, 1.0 ],  // gray
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
            // for solid colored faces use 
            solidcolors.push(vertexColors[a]);

            // for shaded colored faces use 
            shadedcolors.push(vertexColors[indices[i]]);
    }

}

//Render function using WebGL
export var render = function (gl, program, mode, vertices) {
	var vPositionLoc = gl.getAttribLocation (program, 'vPosition');
	var bufferId = gl.createBuffer ();
	gl.bindBuffer (gl.ARRAY_BUFFER, bufferId);
	gl.bufferData (gl.ARRAY_BUFFER, flatten (vertices), gl.STATIC_DRAW);
	gl.enableVertexAttribArray (vPositionLoc);
	gl.vertexAttribPointer (vPositionLoc, render_D, gl.FLOAT, false, 0, 0);
	gl.drawArrays (mode, 0, len (vertices));
};

//Clears the canva
export var clear_canvas = function (gl) {
	gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

//Get the desired shader and return a program instance
export var select_shaders = function (gl) {
	var args = tuple ([].slice.apply (arguments).slice (1));
	var program = initShaders (gl, ...args);
	gl.useProgram (program);
	return program;
};

//Initialise WebGL
export var init_webgl_inst = function () {
	var canvas = document.getElementById ('gl-canvas');
	var gl = WebGLUtils.setupWebGL (canvas);
	if (!(gl)) {
		alert ("WebGL isn't available");
	}
	gl.viewport (0, 0, canvas.width, canvas.height);
	gl.clearColor (1.0, 1.0, 1.0, 1.0);
	gl.enable (gl.DEPTH_TEST);
	return gl;
};

//Recursively converts an iterable implementing __iter__, and all __iter__
//objects it contains, into bare list objects
export var js_list = function (iterable) {
	if (hasattr (iterable, '__iter__')) {
		return (function () {
			var __accu0__ = [];
			var __iterable0__ = iterable;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var i = __getitem__ (__iterable0__, __index0__);
				__call__ (__accu0__.append, __accu0__, __call__ (js_list, null, i));
			}
			return __accu0__;
		}) ();
	}
	else {
		return iterable;
	}
};


//# sourceMappingURL=anneau.map