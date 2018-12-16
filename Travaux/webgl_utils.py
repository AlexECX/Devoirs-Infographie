from WebGL import WebGLUtils, initShaders, requestAnimFrame #__: skip
from javascript import alert, document #__: skip
from org.transcrypt import __pragma__ #__: skip
from js_compat import js_typeof


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

    if (not gl):
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
* Encapsulation d'un WebGLProgram. 
*/""")
class Program:

    def __init__(self, gl, vshader, fshader):
        self.gl = gl
        vsh = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vsh, vshader)
        gl.compileShader(vsh)
        if not gl.getShaderParameter(vsh, gl.COMPILE_STATUS):
            raise "Error in vertex shader:  " + gl.getShaderInfoLog(vsh)

        fsh = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fsh, fshader)
        gl.compileShader(fsh)
        if not gl.getShaderParameter(fsh, gl.COMPILE_STATUS):
            raise "Error in vertex shader:  " + gl.getShaderInfoLog(fsh)

        prog = gl.createProgram()
        gl.attachShader(prog, vsh)
        gl.attachShader(prog, fsh)
        gl.linkProgram(prog)

        if not gl.getProgramParameter(prog, gl.LINK_STATUS):
            raise "Link error in program:  " + gl.getProgramInfoLog(prog)

        self.prog = prog
        self.location_dict = {}

    __pragma__('js', '{}', """/**
    * Permet de localiser et stocker la localisation d'une variable glsl 
    */""")
    def locate(self, typeLoc, var_name):
        self.location_dict[var_name] = __call__(typeLoc, self.gl, self.prog, var_name)
        return self.location_dict[var_name]

    __pragma__('js', '{}', """/**
    * Permet d'obtenir la localisation d'une variable du programme
    */""")
    def loc(self, var_name):
        value = self.location_dict.get(var_name)
        if value == None:
            raise KeyError("'"+var_name+"'",  __new__(Error()))
        else:
            return value

    __pragma__('js', '{}', """/**
    * gl.useProgram sur le programme 
    */""")
    def useProgram(self):
        self.gl.useProgram(self.prog)

    
