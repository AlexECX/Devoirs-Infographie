from org.transcrypt import __pragma__, __new__  # __: skip
from MV import mat4, vec4, vec3, ortho, flatten, radians, rotate, scale, translate, mult  # __: skip
from javascript import document, Math   # __: skip

from webgl_utils import webgl_render, clear_canvas, init_webgl_inst, select_shaders
from shapes import SpaceShip, Transform


__pragma__('js', """/*
The main module: 
- Will setup WebGL.
- Initialise the SpaceShip object
- Render the ship once and on onclick events
*/""")


# gl = None
# prog = None
# __pragma__('js', '//Dimension of render')
# render_D = 3
# # othrt
# # Location of the coords attribute variable in the standard texture mappping shader program.
# CoordsLoc = None
# NormalLoc = None
# TexCoordLoc = None

# # Location of the uniform variables in the standard texture mappping shader program.
# ProjectionLoc = None
# ModelviewLoc = None
# NormalMatrixLoc = None


# projection = None  # --- projection matrix
# modelview = None   # modelview matrix
# flattenedmodelview = None  # --- flattened modelview matrix

# normalMatrix = mat3()  # --- create a 3X3 matrix that will affect normals

# rotator = None   # A SimpleRotator object to enable rotation by mouse dragging.

# trirec = None
# sphere = None
# cylinder = None
# box = None
# teapot = None
# disk = None
# torus = None
# cone = None
# hemisphereinside = None
# hemisphereoutside = None
# thindisk = None
# quartersphereinside = None
# quartersphereoutside = None
# wing = None


# lightPosition = vec4(20.0, 20.0, 100.0, 1.0)

# lightAmbient = vec4(1.0, 1.0, 1.0, 1.0)
# lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0)
# lightSpecular = vec4(1.0, 1.0, 1.0, 1.0)

# materialAmbient = vec4(0.0, 0.1, 0.3, 1.0)
# materialDiffuse = vec4(0.48, 0.55, 0.69, 1.0)
# materialSpecular = vec4(0.48, 0.55, 0.69, 1.0)
# materialShininess = 100.0

# ambientProduct = None
# diffuseProduct = None
# specularProduct = None


# __pragma__('js', '//color codes (rgb)')
# BaseColors = [
#     vec4(0.0, 0.0, 0.0, 1.0),  # black
#     vec4(1.0, 0.0, 0.0, 1.0),  # red
#     vec4(1.0, 1.0, 0.0, 1.0),  # yellow
#     vec4(0.0, 1.0, 0.0, 1.0),  # green
#     vec4(0.0, 0.0, 1.0, 1.0),  # blue
#     vec4(1.0, 0.0, 1.0, 1.0),  # magenta
#     vec4(0.0, 1.0, 1.0, 1.0),  # cyan
#     vec4(1.0, 1.0, 1.0, 1.0),  # white
# ]


__pragma__('js', '{}', """\n//This is the main 3D function""")


def draw():
    global gl, prog, rotator
    global render_D
    global trirec, sphere, cylinder, box, teapot, disk, torus, cone,  \
        hemisphereinside, hemisphereoutside, thindisk, \
        quartersphereinside, quartersphereoutside, wing, spaceship
    global ambientProduct, diffuseProduct, specularProduct
    global CoordsLoc, NormalLoc, TexCoordLoc, ProjectionLoc, ModelviewLoc, \
        NormalMatrixLoc, projection, modelview, flattenedmodelview, \
        normalMatrix, rotator

    __pragma__('js', '//init')
    gl = init_webgl_inst()
    canvas = document.getElementById("gl-canvas")
    # clear_canvas(gl)
    #prog = select_shaders(gl, "vshader", "fshader")

    __pragma__('js', '//LOAD SHADER (standard texture mapping)')
    vertexShaderSource = getTextContent("vshader")
    fragmentShaderSource = getTextContent("fshader")
    prog = createProgram(gl, vertexShaderSource, fragmentShaderSource)

    gl.useProgram(prog)

    # locate variables for further use
    CoordsLoc = gl.getAttribLocation(prog, "vcoords")
    NormalLoc = gl.getAttribLocation(prog, "vnormal")
    TexCoordLoc = gl.getAttribLocation(prog, "vtexcoord")

    ModelviewLoc = gl.getUniformLocation(prog, "modelview")
    ProjectionLoc = gl.getUniformLocation(prog, "projection")
    NormalMatrixLoc = gl.getUniformLocation(prog, "normalMatrix")

    gl.enableVertexAttribArray(CoordsLoc)
    gl.enableVertexAttribArray(NormalLoc)
    # we do not need texture coordinates
    gl.disableVertexAttribArray(TexCoordLoc)

    #  create a "rotator" monitoring mouse mouvement
    rotator = __new__(SimpleRotator(canvas, render))
    #  set initial camera position at z=40, with an "up" vector aligned with y axis
    #   (this defines the initial value of the modelview matrix )
    rotator.setView([0, 0, 1], [0, 1, 0], 60)

    ambientProduct = mult(lightAmbient, materialAmbient)
    diffuseProduct = mult(lightDiffuse, materialDiffuse)
    specularProduct = mult(lightSpecular, materialSpecular)

    gl.uniform4fv(gl.getUniformLocation(
        prog, "ambientProduct"), flatten(ambientProduct))
    gl.uniform4fv(gl.getUniformLocation(
        prog, "diffuseProduct"), flatten(diffuseProduct))
    gl.uniform4fv(gl.getUniformLocation(
        prog, "specularProduct"), flatten(specularProduct))
    gl.uniform1f(gl.getUniformLocation(prog, "shininess"), materialShininess)

    gl.uniform4fv(gl.getUniformLocation(
        prog, "lightPosition"), flatten(lightPosition))

    projection = perspective(70.0, 1.0, 1.0, 200.0)
    # send projection matrix to the shader program
    gl.uniformMatrix4fv(ProjectionLoc, False, flatten(projection))

    # In the following lines, we create different "elements" (sphere, cylinder, box, disk,...).
    # These elements are "objects" returned by the "createModel()" function.
    # The "createModel()" function requires one parameter which contains all the information needed
    # to create the "object". The functions "uvSphere()", "uvCylinder()", "cube()",... are described
    # in the file "basic-objects-IFS.js". They return an "object" containing vertices, normals,
    # texture coordinates and indices.
    #

    # sphere = createModel(uvSphere(10.0, 25.0, 25.0))
    # cylinder = createModel(uvCylinder(10.0, 20.0, 25.0, False, False))
    #trirec = createModel(triangle_rectangle(10.0))
    spaceship = SpaceShip()
    box = createModel(empty_cube(10.0, 2.0))

    # teapot = createModel(teapotModel)
    # disk = createModel(ring(5.0, 10.0, 25.0))
    # torus = createModel(uvTorus(15.0, 5.0, 25.0, 25.0))
    # cone = createModel(uvCone(10.0, 20.0, 25.0, True))

    # hemisphereinside = createModel(uvHemisphereInside(10.0, 25.0, 25.0))
    # hemisphereoutside = createModel(uvHemisphereOutside(10.0, 25.0, 25.0))
    # thindisk = createModel(ring(9.5, 10.0, 25.0))

    # quartersphereinside = createModel(uvQuartersphereInside(10.0, 25.0, 25.0))
    # quartersphereoutside = createModel(uvQuartersphereOutside(10.0, 25.0, 25.0))

    # managing arrow keys (to move up or down the model)
    __pragma__('js', """ 
    document.onkeydown = function (e) {
        switch (e.key) {
            case 'Home':
                # resize the canvas to the current window width and height
                resize(canvas)
                break
        };
    };
    """)

    render()


def render():
    global flattenedmodelview, modelview, normalMatrix
    gl.clearColor(0.79, 0.76, 0.27, 1)
    clear_canvas(gl)

    flattenedmodelview = rotator.getViewMatrix()
    modelview = unflatten(flattenedmodelview)
    initialModelView = modelview
    # normalMatrix = extractNormalMatrix(modelview)
    # modelview = mult(modelview, scale(1, 4, .5))
    # box.render()
    spaceship.transform = Transform()
    spaceship.transform.multi = scale(.25,.25,.25)
    spaceship.traverse()
    

    modelview = initialModelView


__pragma__('js', '{}', """
//Recursively converts an iterable implementing __iter__, and all __iter__
//objects it contains, into bare list objects""")


def js_list(iterable):
    if hasattr(iterable, "__iter__"):
        return [js_list(i) for i in iterable]  # __:opov
    else:
        return iterable
