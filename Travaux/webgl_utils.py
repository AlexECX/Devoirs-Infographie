from org.transcrypt import __pragma__  # __: skip
from javascript import document, alert   # __: skip
from WebGL import initShaders, WebGLUtils, requestAnimFrame  # __: skip


__pragma__('js', '//Base render function')
def webgl_render(gl, program, mode, count):
    gl.drawArrays(mode, 0, count)
    #gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 )

__pragma__('js', '{}', """
//Clears the canva""")
def clear_canvas(gl):
    gl.js_clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

__pragma__('js', '{}', """
//Initialise WebGL""")
def init_webgl_inst():
    canvas = document.getElementById("gl-canvas")
    gl = canvas.getContext("webgl")
    if (not gl):
        gl = canvas.getContext("experimental-webgl")
    
    if (not gl) :
        raise "Could not create WebGL context."

    gl.enable(gl.DEPTH_TEST)

    return gl

    __pragma__('js', '{}', """
//Get the desired shader and return a program instance""")
def select_shaders(gl, *args):
    program = initShaders(gl, *args)
    gl.useProgram(program)
    return program


__pragma__('js', '{}', """/**
* Recursively converts an iterable implementing __iter__, and all __iter__
* objects it contains, into bare array objects
*/""")
def js_list(iterable):
    if hasattr(iterable, "__iter__"):
        return [js_list(i) for i in iterable]  # __:opov
    else:
        return iterable
