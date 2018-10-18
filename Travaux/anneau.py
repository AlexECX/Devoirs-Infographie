from org.transcrypt import __pragma__, __new__  # __: skip
from MV import mat4, vec4, vec3, ortho, flatten, radians, rotate, scale, translate, mult  # __: skip
from javascript import Worker, document, alert, Math   # __: skip
from WebGL import initShaders, WebGLUtils, requestAnimFrame  # __: skip

from py_vector import Vector3D, Vector4D
import shapes
# import shapes

__pragma__('js', """/*
The main module: 
- Will setup WebGL.
- Launch JS Workers to recursively divide each faces of an object.
- The last worker calls a render function. It will render each faces 
  using the appropriate subset of points/vectors, with different colors. 
*/""")


gl = None
program = None
__pragma__('js', '//2D or 3D dimension')
render_D = 3

points = []
solidcolors = []
shadedcolors = []

theta = [0, 0, 0]

ori_scale = Vector4D(.3, .3, .3, 1)
ori_disp = Vector4D(0, 0, 0, 0)


BaseColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  # black
    vec4(1.0, 0.0, 0.0, 1.0),  # red
    vec4(1.0, 1.0, 0.0, 1.0),  # yellow
    vec4(0.0, 1.0, 0.0, 1.0),  # green
    vec4(0.0, 0.0, 1.0, 1.0),  # blue
    vec4(1.0, 0.0, 1.0, 1.0),  # magenta
    vec4(0.0, 1.0, 1.0, 1.0),  # cyan
    vec4(1.0, 1.0, 1.0, 1.0),  # white
]

canvas = None
display = None
prevx = None
prevy = None
dragging = False
anglex = 0
angley = 0


__pragma__('js', '{}', """

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

""")


__pragma__('js', '{}', """
//This is the main 3D function""")


def draw():
    global gl, program
    global render_D
    global points, solidcolors, shadedcolors
    global NumVertices, theta
    global canvas, display

    canvas = document.getElementById("gl-canvas")
    canvas.addEventListener("mousedown", doMouseDown, False)
    display = document.getElementById("display")

    gl = init_webgl_inst()
    clear_canvas(gl)
    program = select_shaders(gl, "vertex-shader2", "fragment-shader")

    colorCube()

    solidcolorsBuffer = gl.createBuffer()
    shadedcolorsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW)

    vColorLoc = gl.getAttribLocation(program, "vColor")
    gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, False, 0, 0)
    gl.enableVertexAttribArray(vColorLoc)

    __pragma__('js', """\n//event listeners for buttons""")
    def ShadedButton():
        gl.bindBuffer(gl.ARRAY_BUFFER, shadedcolorsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(shadedcolors), gl.STATIC_DRAW)
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, False, 0, 0)
        gl.enableVertexAttribArray(vColorLoc)
        render_event()
    document.getElementById("ShadedButton").onclick = ShadedButton

    def SolidButton():
        gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW)
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, False, 0, 0)
        gl.enableVertexAttribArray(vColorLoc)
        render_event()
    document.getElementById("SolidButton").onclick = SolidButton
    

    render_event()

def colorCube_t():
    global points, solidcolors
    shape = shapes.make_cube()

    for i,face in enumerate(shape):
        points.append(face[0])
        points.append(face[1])
        points.append(face[2])
        points.append(face[0])
        points.append(face[2])
        points.append(face[3])
        for x in range(6):
            solidcolors.append(BaseColors[i])

        points = js_list(points)


__pragma__('js', '{}', """

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

""")


__pragma__('js', """\n//rx, ry, rz, rotation matrix """)


def matrice_rxz():

    angles = [radians(theta[0]), radians(theta[1]), radians(theta[2])]
    c = vec3(Math.cos(angles[0]), Math.cos(angles[1]), Math.cos(angles[2]))
    s = vec3(Math.sin(angles[0]), Math.sin(angles[1]), Math.sin(angles[2]))

    rx = mat4(1.0,  0.0,  0.0, 0.0,
              0.0,  c[0],  -s[0], 0.0,
              0.0, s[0],  c[0], 0.0,
              0.0,  0.0,  0.0, 1.0)

    ry = mat4(c[1], 0.0, s[1], 0.0,
              0.0, 1.0,  0.0, 0.0,
              -s[1], 0.0,  c[1], 0.0,
              0.0, 0.0,  0.0, 1.0)

    rz = mat4(c[2],  -s[2], 0.0, 0.0,
              s[2],  c[2], 0.0, 0.0,
              0.0,  0.0, 1.0, 0.0,
              0.0,  0.0, 0.0, 1.0)

    mat_result = mult(rx, ry)
    mat_result = mult(mat_result, rz)

    return mat_result

__pragma__('js', """\n//Where the rotation/translating/scaling is done, followed by render""")
def render_event():
    global ori_scale, ori_disp, anglex, angley
    clear_canvas(gl)
    theta[0] = anglex/10.0
    theta[1] = angley/10.0

    thetaLoc = gl.getUniformLocation(program, "theta")
    gl.uniform3fv(thetaLoc, theta)
    modelViewLoc = gl.getUniformLocation(program, "modelView")

    __pragma__('js', """\n//The boxes """)
    __pragma__('js', """/*
boxs_dist = [
    ori_disp,
    ori_disp + Vector4D(0, ori_scale[1]*2, 0, 0),
    ori_disp + Vector4D(ori_scale[0]*2, 0, 0, 0),
    ori_disp + Vector4D(ori_scale[0]*2, ori_scale[1]*2, 0, 0),
]
*/ """)
    __pragma__("opov")
    boxs_dist = [
        ori_disp,
        ori_disp + Vector4D(0, ori_scale[1]*2, 0, 0),
        ori_disp + Vector4D(ori_scale[0]*2, 0, 0, 0),
        ori_disp + Vector4D(ori_scale[0]*2, ori_scale[1]*2, 0, 0),
    ]
    __pragma__("noopov")

    for dist in boxs_dist:
        modelView = mult(matrice_rxz(), translate(*dist.as_list()))
        modelView = mult(modelView, scale(*ori_scale.as_list()))
        gl.uniformMatrix4fv(modelViewLoc, False, flatten(modelView))
        render(gl, program, gl.TRIANGLES, points)

    __pragma__('js', """\n//The sticks """)
    __pragma__('js', """/*
stick_x = ori_scale * Vector4D(1/3, 2, 1/3, 1)
stick_y = ori_scale * Vector4D(2, 1/3, 1/3, 1)
*/ """)
    stick_x = ori_scale * Vector4D(1/3, 2, 1/3, 1)  # __:opov
    stick_y = ori_scale * Vector4D(2, 1/3, 1/3, 1)  # __:opov
    __pragma__('js', """/*
sticks_dist = [
    ori_disp + Vector4D(0, ori_scale[1], 0, 0),
    ori_disp + Vector4D(ori_scale[0]*2, ori_scale[1], 0, 0),
    ori_disp + Vector4D(ori_scale[0], 0, 0, 0),
    ori_disp + Vector4D(ori_scale[0], ori_scale[1]*2, 0, 0),
]
*/ """)
    __pragma__("opov")
    sticks_dist = [
        ori_disp + Vector4D(0, ori_scale[1], 0, 0),
        ori_disp + Vector4D(ori_scale[0]*2, ori_scale[1], 0, 0),
        ori_disp + Vector4D(ori_scale[0], 0, 0, 0),
        ori_disp + Vector4D(ori_scale[0], ori_scale[1]*2, 0, 0),
    ]
    __pragma__("noopov")

    __pragma__('js', """\n//Render horizontal sticks """)
    for dist in sticks_dist[0:2]:
        modelView = mult(matrice_rxz(), translate(*dist.as_list()))
        modelView = mult(modelView, scale(*stick_x.as_list()))
        gl.uniformMatrix4fv(modelViewLoc, False, flatten(modelView))
        render(gl, program, gl.TRIANGLES, points)

    __pragma__('js', """\n//Render vertical sticks """)
    for dist in sticks_dist[2:4]:
        modelView = mult(matrice_rxz(), translate(*dist.as_list()))
        modelView = mult(modelView, scale(*stick_y.as_list()))
        gl.uniformMatrix4fv(modelViewLoc, False, flatten(modelView))
        render(gl, program, gl.TRIANGLES, points)


def render(gl, program, mode, vertices):
    global render_D
    vPositionLoc = gl.getAttribLocation(program, "vPosition")

    bufferId = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW)

    gl.enableVertexAttribArray(vPositionLoc)

    gl.vertexAttribPointer(vPositionLoc, render_D, gl.FLOAT, False, 0, 0)

    gl.drawArrays(mode, 0, len(vertices))


__pragma__('js', '{}', """
//Clears the canva""")


def clear_canvas(gl):
    gl.js_clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)


__pragma__('js', '{}', """
//Get the desired shader and return a program instance""")


def select_shaders(gl, *args):
    program = initShaders(gl, *args)
    gl.useProgram(program)
    return program


__pragma__('js', '{}', """
//Initialise WebGL""")


def init_webgl_inst():
    canvas = document.getElementById("gl-canvas")
    gl = WebGLUtils.setupWebGL(canvas)
    if not gl:
        alert("WebGL isn't available")

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    return gl


__pragma__('js', '{}', """
//Recursively converts an iterable implementing __iter__, and all __iter__
//objects it contains, into bare list objects""")


def js_list(iterable):
    if hasattr(iterable, "__iter__"):
        return [js_list(i) for i in iterable]  # __:opov
    else:
        return iterable


__pragma__('js', '{}', """
//function getScriptPath(foo){ return window.URL.createObjectURL(new Blob([foo.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1]],{type:'text/javascript'})); }
""")
