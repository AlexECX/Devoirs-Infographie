from org.transcrypt import __pragma__, __new__  # __: skip
from MV import vec4, ortho, flatten  # __: skip
from javascript import Worker, document, alert   # __: skip
from WebGL import initShaders, WebGLUtils, requestAnimFrame  # __: skip

from py_vector import Vector3D, Vector4D
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

xAxis = 0
yAxis = 1
zAxis = 2

axis = 0
theta = [0, 0, 0]

ori_scale = Vector4D(.3,.3,.3,1)
ori_disp = Vector4D(0,0,0,0)


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


__pragma__('js', '{}', """
//This is the main 3D function""")


def draw():
    global gl
    global program
    global render_D
    global points, solidcolors, shadedcolors
    global NumVertices, xAxis, yAxis, zAxis, axis, theta

    gl = init_webgl_inst()
    clear_canvas(gl)
    program = select_shaders(gl, "vertex-shader2", "fragment-shader")

    colorCube()

    solidcolorsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW)

    vColorLoc = gl.getAttribLocation(program, "vColor")
    gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, False, 0, 0)
    gl.enableVertexAttribArray(vColorLoc)

    shadedcolorsBuffer = gl.createBuffer()

    thetaLoc = gl.getUniformLocation(program, "theta")

    __pragma__('js', """\n//event listeners for buttons""")

    def xSlider():
        global ori_disp
        s = float(this.value)
        ori_disp[0] = s #__:opov
    document.getElementById("xSlider").oninput = xSlider

    
    def ySlider():
        global ori_disp
        s = float(this.value)
        ori_disp[1] = s #__:opov
    document.getElementById("ySlider").oninput = ySlider

    def zSlider():
        global ori_disp
        s = float(this.value)
        ori_disp[2] = s #__:opov
    document.getElementById("zSlider").oninput = zSlider

    def SizeSlider():
        global ori_scale
        s = float(this.value)
        ori_scale = Vector4D(s,s,s,1) #__:opov
    document.getElementById("SizeSlider").oninput = SizeSlider

    def xButton():
        global axis
        axis = xAxis
    document.getElementById("xButton").onclick = xButton

    def yButton():
        global axis
        axis = yAxis
    document.getElementById("yButton").onclick = yButton

    def zButton():
        global axis
        axis = zAxis
    document.getElementById("zButton").onclick = zButton


    def ShadedButton():
        gl.bindBuffer(gl.ARRAY_BUFFER, shadedcolorsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(shadedcolors), gl.STATIC_DRAW)
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, False, 0, 0)
        gl.enableVertexAttribArray(vColorLoc)
    document.getElementById("ShadedButton").onclick = ShadedButton

    def SolidButton():
        gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW)
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, False, 0, 0)
        gl.enableVertexAttribArray(vColorLoc)
    document.getElementById("SolidButton").onclick = SolidButton

    __pragma__('js', """\n//Where the scaling and translating is done, followed by render""")
    def render_loop():
        global ori_scale, ori_disp
        clear_canvas(gl)
        theta[axis] += 2.0
        gl.uniform3fv(thetaLoc, theta)

        vDisplacementLoc = gl.getUniformLocation(program, "vDisplacement")
        vScaleLoc = gl.getUniformLocation(program, "vScale")

        __pragma__('js', """\n//The boxes """)
        __pragma__("opov")
        boxs_dist = [
            ori_disp,
            ori_disp + Vector4D(0, ori_scale[1]*2, 0, 0),
            ori_disp + Vector4D(ori_scale[0]*2, 0, 0, 0),
            ori_disp + Vector4D(ori_scale[0]*2, ori_scale[1]*2, 0, 0),
        ]
        __pragma__("noopov")

        for dist in boxs_dist:
            gl.uniform4fv(vDisplacementLoc, flatten(dist.as_list()))
            gl.uniform4fv(vScaleLoc, flatten(ori_scale.as_list()))
            render(gl, program, gl.TRIANGLES, points)

        stick_x = ori_scale * Vector4D(1/3, 2, 1/3, 1) #__:opov
        stick_y = ori_scale * Vector4D(2, 1/3, 1/3, 1) #__:opov

        __pragma__("opov")
        sticks_dist = [
            ori_disp + Vector4D(0, ori_scale[1], 0, 0),
            ori_disp + Vector4D(ori_scale[0]*2, ori_scale[1], 0, 0),
            ori_disp + Vector4D(ori_scale[0], 0, 0, 0),
            ori_disp + Vector4D(ori_scale[0], ori_scale[1]*2, 0, 0),
        ]
        __pragma__("noopov")

        __pragma__('js', """\n//The horizontal sticks """)
        for dist in sticks_dist[0:2]:
            gl.uniform4fv(vDisplacementLoc, flatten(dist.as_list()))
            gl.uniform4fv(vScaleLoc, flatten(stick_x.as_list()))
            render(gl, program, gl.TRIANGLES, points)
        
        __pragma__('js', """\n//The vertical sticks """)
        for dist in sticks_dist[2:4]:
            gl.uniform4fv(vDisplacementLoc, flatten(dist.as_list()))
            gl.uniform4fv(vScaleLoc, flatten(stick_y.as_list()))
            render(gl, program, gl.TRIANGLES, points)


        requestAnimFrame(render_loop)

    render_loop()


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


__pragma__('js', '{}', """
//JS worker that recursively divide a cube's face in 8 parts, count times.
//Six workers are used, the last worker calls the render function.""")
# def launch_worker(shape, count, last_worker):
#     def worker_receive(e):
#         global worker_points
#         global worker_count
#         worker_points.append(e.data[0])
#         worker_count += 1
#         if worker_count is last_worker:
#             worker_render()

#     worker1 = __new__(Worker('./__target__/worker.js'))
#     shape = js_list(shape)

#     worker1.onmessage = worker_receive
#     worker1.postMessage([shape, count])  # (cube[:4], count))


__pragma__('js', '{}', """
//Function called by the final worker""")
# def worker_render():
#     global gl
#     global worker_points
#     global program
#     pMatrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0)
#     projectionLoc = gl.getUniformLocation(program, "projection")
#     gl.uniformMatrix4fv(projectionLoc, False, flatten(pMatrix))
#     i = 0
#     for p in worker_points:
#         colorLoc = gl.getUniformLocation(program, "color")
#         gl.uniform4fv(colorLoc, flatten(BaseColors[i]))
#         render(gl, program, gl.TRIANGLES, p)
#         i += 1


__pragma__('js', '{}', """
//Render function using WebGL""")


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
