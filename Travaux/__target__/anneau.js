// Transcrypt'ed from Python, 2018-10-17 21:02:57
var shapes = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_shapes__ from './shapes.js';
__nest__ (shapes, '', __module_shapes__);
import {Vector3D, Vector4D} from './py_vector.js';
var __name__ = '__main__';
/*
The main module: 
- Will setup WebGL.
- Launch JS Workers to recursively divide each faces of an object.
- The last worker calls a render function. It will render each faces 
  using the appropriate subset of points/vectors, with different colors. 
*/
export var gl = null;
export var program = null;
export var canvas = null;
export var display = null;
//Dimension of render
export var render_D = 3;
//vertices
export var points = list ([]);
export var solidcolors = list ([]);
export var shadedcolors = list ([]);
//color codes (rgb)
export var BaseColors = list ([vec4 (0.0, 0.0, 0.0, 1.0), vec4 (1.0, 0.0, 0.0, 1.0), vec4 (1.0, 1.0, 0.0, 1.0), vec4 (0.0, 1.0, 0.0, 1.0), vec4 (0.0, 0.0, 1.0, 1.0), vec4 (1.0, 0.0, 1.0, 1.0), vec4 (0.0, 1.0, 1.0, 1.0), vec4 (1.0, 1.0, 1.0, 1.0)]);
//angles related
export var theta = list ([0, 0, 0]);
export var prevx = null;
export var prevy = null;
export var dragging = false;
export var anglex = 0;
export var angley = 0;
//The default scaling and display position
export var ori_scale = Vector4D (0.3, 0.3, 0.3, 1);
export var ori_disp = Vector4D (0, 0, 0, 0);

//This is the main 3D function
export var draw = function () {
	//init
	gl = init_webgl_inst ();
	clear_canvas (gl);
	program = select_shaders (gl, 'vertex-shader2', 'fragment-shader');
	canvas = document.getElementById ('gl-canvas');
	canvas.addEventListener ('mousedown', doMouseDown, false);
	display = document.getElementById ('display');
	//make the cube (with colors)
	colorCube ();
	//color buffers
	var solidcolorsBuffer = gl.createBuffer ();
	var shadedcolorsBuffer = gl.createBuffer ();
	
	//event listeners for buttons
	var ShadedButton = function () {
		gl.bindBuffer (gl.ARRAY_BUFFER, shadedcolorsBuffer);
		gl.bufferData (gl.ARRAY_BUFFER, flatten (shadedcolors), gl.STATIC_DRAW);
		gl.vertexAttribPointer (vColorLoc, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray (vColorLoc);
		render_event ();
	};
	document.getElementById ('ShadedButton').onclick = ShadedButton;
	var SolidButton = function () {
		gl.bindBuffer (gl.ARRAY_BUFFER, solidcolorsBuffer);
		gl.bufferData (gl.ARRAY_BUFFER, flatten (solidcolors), gl.STATIC_DRAW);
		gl.vertexAttribPointer (vColorLoc, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray (vColorLoc);
		render_event ();
	};
	document.getElementById ('SolidButton').onclick = SolidButton;
	
	//Prep for first render, using solid colors
	gl.bindBuffer (gl.ARRAY_BUFFER, solidcolorsBuffer);
	gl.bufferData (gl.ARRAY_BUFFER, flatten (solidcolors), gl.STATIC_DRAW);
	var vColorLoc = gl.getAttribLocation (program, 'vColor');
	gl.vertexAttribPointer (vColorLoc, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray (vColorLoc);
	render_event ();
};


function doMouseDown(evt) {
    if (dragging)
        return;
    dragging = true;
    document.addEventListener("mousemove", doMouseDrag, false);
    document.addEventListener("mouseup", doMouseUp, false);
    var box = canvas.getBoundingClientRect();
    prevx = evt.clientX - box.left;
    prevy = canvas.height + (evt.clientY - box.top);
}
function doMouseDrag(evt) {
    if (!dragging)
        return;
    var box = canvas.getBoundingClientRect();
    var x = evt.clientX - box.left;
    var y = canvas.height + (evt.clientY - box.top);

    anglex += y - prevy;
    angley += x - prevx;

    display.innerHTML = "<div> anglex = " + anglex + " ***** angley = " + angley +" </div>";

    prevx = x;
    prevy = y;
    
    render_event();
    
}
function doMouseUp(evt) {
    if (dragging) {
        document.removeEventListener("mousemove", doMouseDrag, false);
        document.removeEventListener("mouseup", doMouseUp, false);
        dragging = false;
    }
}




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



//rx, ry, rz, rotation matrix 
export var matrice_rxz = function () {
	var angles = list ([radians (theta [0]), radians (theta [1]), radians (theta [2])]);
	var c = vec3 (Math.cos (angles [0]), Math.cos (angles [1]), Math.cos (angles [2]));
	var s = vec3 (Math.sin (angles [0]), Math.sin (angles [1]), Math.sin (angles [2]));
	var rx = mat4 (1.0, 0.0, 0.0, 0.0, 0.0, c [0], -(s [0]), 0.0, 0.0, s [0], c [0], 0.0, 0.0, 0.0, 0.0, 1.0);
	var ry = mat4 (c [1], 0.0, s [1], 0.0, 0.0, 1.0, 0.0, 0.0, -(s [1]), 0.0, c [1], 0.0, 0.0, 0.0, 0.0, 1.0);
	var rz = mat4 (c [2], -(s [2]), 0.0, 0.0, s [2], c [2], 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
	var mat_result = mult (rx, ry);
	var mat_result = mult (mat_result, rz);
	return mat_result;
};

//Where the rotation/translating/scaling is done, followed by render
export var render_event = function () {
	clear_canvas (gl);
	theta [0] = anglex / 10.0;
	theta [1] = angley / 10.0;
	var thetaLoc = gl.getUniformLocation (program, 'theta');
	gl.uniform3fv (thetaLoc, theta);
	var modelViewLoc = gl.getUniformLocation (program, 'modelView');
	
	//The boxes 
	/*
	boxs_disp = [
	    ori_disp,
	    ori_disp + Vector4D(0, ori_scale[1]*2, 0, 0),
	    ori_disp + Vector4D(ori_scale[0]*2, 0, 0, 0),
	    ori_disp + Vector4D(ori_scale[0]*2, ori_scale[1]*2, 0, 0),
	]
	*/ 
	var boxs_disp = list ([ori_disp, __add__ (ori_disp, __call__ (Vector4D, null, 0, __mul__ (__getitem__ (ori_scale, 1), 2), 0, 0)), __add__ (ori_disp, __call__ (Vector4D, null, __mul__ (__getitem__ (ori_scale, 0), 2), 0, 0, 0)), __add__ (ori_disp, __call__ (Vector4D, null, __mul__ (__getitem__ (ori_scale, 0), 2), __mul__ (__getitem__ (ori_scale, 1), 2), 0, 0))]);
	for (var dist of boxs_disp) {
		var modelView = mult (matrice_rxz (), translate (...dist.as_list ()));
		var modelView = mult (modelView, scale (...ori_scale.as_list ()));
		gl.uniformMatrix4fv (modelViewLoc, false, flatten (modelView));
		render (gl, program, gl.TRIANGLES, points);
	}
	
	//The sticks 
	/*
	stick_x = ori_scale * Vector4D(1/3, 2, 1/3, 1)
	stick_y = ori_scale * Vector4D(2, 1/3, 1/3, 1)
	*/ 
	var stick_x = __mul__ (ori_scale, __call__ (Vector4D, null, __truediv__ (1, 3), 2, __truediv__ (1, 3), 1));
	var stick_y = __mul__ (ori_scale, __call__ (Vector4D, null, 2, __truediv__ (1, 3), __truediv__ (1, 3), 1));
	/*
	sticks_disp = [
	    ori_disp + Vector4D(0, ori_scale[1], 0, 0),
	    ori_disp + Vector4D(ori_scale[0]*2, ori_scale[1], 0, 0),
	    ori_disp + Vector4D(ori_scale[0], 0, 0, 0),
	    ori_disp + Vector4D(ori_scale[0], ori_scale[1]*2, 0, 0),
	]
	*/ 
	var sticks_disp = list ([__add__ (ori_disp, __call__ (Vector4D, null, 0, __getitem__ (ori_scale, 1), 0, 0)), __add__ (ori_disp, __call__ (Vector4D, null, __mul__ (__getitem__ (ori_scale, 0), 2), __getitem__ (ori_scale, 1), 0, 0)), __add__ (ori_disp, __call__ (Vector4D, null, __getitem__ (ori_scale, 0), 0, 0, 0)), __add__ (ori_disp, __call__ (Vector4D, null, __getitem__ (ori_scale, 0), __mul__ (__getitem__ (ori_scale, 1), 2), 0, 0))]);
	
	//Render horizontal sticks 
	for (var dist of sticks_disp.__getslice__ (0, 2, 1)) {
		var modelView = mult (matrice_rxz (), translate (...dist.as_list ()));
		var modelView = mult (modelView, scale (...stick_x.as_list ()));
		gl.uniformMatrix4fv (modelViewLoc, false, flatten (modelView));
		render (gl, program, gl.TRIANGLES, points);
	}
	
	//Render vertical sticks 
	for (var dist of sticks_disp.__getslice__ (2, 4, 1)) {
		var modelView = mult (matrice_rxz (), translate (...dist.as_list ()));
		var modelView = mult (modelView, scale (...stick_y.as_list ()));
		gl.uniformMatrix4fv (modelViewLoc, false, flatten (modelView));
		render (gl, program, gl.TRIANGLES, points);
	}
};
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

//function getScriptPath(foo){ return window.URL.createObjectURL(new Blob([foo.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1]],{type:'text/javascript'})); }


//# sourceMappingURL=anneau.map