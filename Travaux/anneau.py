from org.transcrypt import __pragma__, __new__  # __: skip
from MV import mat4, vec4, vec3, ortho, flatten, radians, rotate, scale, translate, mult  # __: skip
from javascript import document, Math   # __: skip

from webgl_utils import webgl_render, clear_canvas, init_webgl_inst, select_shaders
from py_vector import Vector3D, Vector4D


__pragma__('js', """/*
The main module: 
- Will setup WebGL.
- Launch JS Workers to recursively divide each faces of an object.
- The last worker calls a render function. It will render each faces 
  using the appropriate subset of points/vectors, with different colors. 
*/""")


__pragma__('js', 'var gl')
prog = None
__pragma__('js', '//Dimension of render')
render_D = 3
# othrt
# Location of the coords attribute variable in the standard texture mappping shader program.
CoordsLoc = None
NormalLoc = None
TexCoordLoc = None

# Location of the uniform variables in the standard texture mappping shader program.
ProjectionLoc = None
ModelviewLoc = None
NormalMatrixLoc = None


projection = None  # --- projection matrix
modelview = None   # modelview matrix
flattenedmodelview = None  # --- flattened modelview matrix

normalMatrix = mat3()  # --- create a 3X3 matrix that will affect normals

rotator = None   # A SimpleRotator object to enable rotation by mouse dragging.

trirec = None
sphere = None
cylinder = None
box = None
teapot = None
disk = None
torus = None
cone = None
hemisphereinside = None
hemisphereoutside = None
thindisk = None
quartersphereinside = None
quartersphereoutside = None
wing = None


lightPosition = vec4(20.0, 20.0, 100.0, 1.0)

lightAmbient = vec4(1.0, 1.0, 1.0, 1.0)
lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0)
lightSpecular = vec4(1.0, 1.0, 1.0, 1.0)

materialAmbient = vec4(0.0, 0.1, 0.3, 1.0)
materialDiffuse = vec4(0.48, 0.55, 0.69, 1.0)
materialSpecular = vec4(0.48, 0.55, 0.69, 1.0)
materialShininess = 100.0

ambientProduct = None
diffuseProduct = None
specularProduct = None


__pragma__('js', '//color codes (rgb)')
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


__pragma__('js', '{}', """\n//This is the main 3D function""")


def draw():
    global gl, prog, rotator
    global render_D
    global trirec, sphere, cylinder, box, teapot, disk, torus, cone,  \
        hemisphereinside, hemisphereoutside, thindisk, \
        quartersphereinside, quartersphereoutside, wing
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
    rotator.setView([0, 0, 1], [0, 1, 0], 40)

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
    trirec = createModel(triangle_rectangle(10.0))
    wing = Wing()
    # box = createModel(cube(10.0))

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
    normalMatrix = extractNormalMatrix(modelview)

    wing.traverse()
    # trirec.render()

    modelview = initialModelView


__pragma__('js', '{}', """

function unflatten(matrix) {
    var result = mat4();
    result[0][0] = matrix[0]; result[1][0] = matrix[1]; result[2][0] = matrix[2]; result[3][0] = matrix[3];
    result[0][1] = matrix[4]; result[1][1] = matrix[5]; result[2][1] = matrix[6]; result[3][1] = matrix[7];
    result[0][2] = matrix[8]; result[1][2] = matrix[9]; result[2][2] = matrix[10]; result[3][2] = matrix[11];
    result[0][3] = matrix[12]; result[1][3] = matrix[13]; result[2][3] = matrix[14]; result[3][3] = matrix[15];

    return result;
}

function extractNormalMatrix(matrix) { // This function computes the transpose of the inverse of 
    // the upperleft part (3X3) of the modelview matrix (see http://www.lighthouse3d.com/tutorials/glsl-tutorial/the-normal-matrix/ )

    var result = mat3();
    var upperleft = mat3();
    var tmp = mat3();

    upperleft[0][0] = matrix[0][0];  // if no scaling is performed, one can simply use the upper left
    upperleft[1][0] = matrix[1][0];  // part (3X3) of the modelview matrix
    upperleft[2][0] = matrix[2][0];

    upperleft[0][1] = matrix[0][1];
    upperleft[1][1] = matrix[1][1];
    upperleft[2][1] = matrix[2][1];

    upperleft[0][2] = matrix[0][2];
    upperleft[1][2] = matrix[1][2];
    upperleft[2][2] = matrix[2][2];

    tmp = matrixinvert(upperleft);
    result = transpose(tmp);

    return result;
}

function matrixinvert(matrix) {

    var result = mat3();

    var det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) -
                 matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                 matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);

    var invdet = 1 / det;

    // inverse of matrix m
    result[0][0] = (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) * invdet;
    result[0][1] = (matrix[0][2] * matrix[2][1] - matrix[0][1] * matrix[2][2]) * invdet;
    result[0][2] = (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) * invdet;
    result[1][0] = (matrix[1][2] * matrix[2][0] - matrix[1][0] * matrix[2][2]) * invdet;
    result[1][1] = (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) * invdet;
    result[1][2] = (matrix[1][0] * matrix[0][2] - matrix[0][0] * matrix[1][2]) * invdet;
    result[2][0] = (matrix[1][0] * matrix[2][1] - matrix[2][0] * matrix[1][1]) * invdet;
    result[2][1] = (matrix[2][0] * matrix[0][1] - matrix[0][0] * matrix[2][1]) * invdet;
    result[2][2] = (matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]) * invdet;

    return result;
}

// The following function is used to create an "object" (called "model") containing all the informations needed
// to draw a particular element (sphere, cylinder, cube,...). 
// Note that the function "model.render" is defined inside "createModel" but it is NOT executed.
// That function is only executed when we call it explicitly in render().

function createModel(modelData) {

	// the next line defines an "object" in Javascript
	// (note that there are several ways to define an "object" in Javascript)
	var model = {};
	
	// the following lines defines "members" of the "object"
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.textureBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;

	// the "members" are then used to load data from "modelData" in the graphic card
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTextureCoords, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

	// The following function is NOT executed here. It is only DEFINED to be used later when we
	// call the ".render()" method.
    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(CoordsLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(NormalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(TexCoordLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.uniformMatrix4fv(ModelviewLoc, false, flatten(modelview));    //--- load flattened modelview matrix
        gl.uniformMatrix3fv(NormalMatrixLoc, false, flatten(normalMatrix));  //--- load flattened normal matrix

        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
        console.log(this.count);
    }
	
	// we now return the "object".
    return model;
}



function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var vsh = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsh, vertexShaderSource);
    gl.compileShader(vsh);
    if (!gl.getShaderParameter(vsh, gl.COMPILE_STATUS)) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
    }
    var fsh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if (!gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
        throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}


function getTextContent(elementID) {
    var element = document.getElementById(elementID);
    var fsource = "";
    var node = element.firstChild;
    var str = "";
    while (node) {
        if (node.nodeType == 3) // this is a text node
            str += node.textContent;
        node = node.nextSibling;
    }
    return str;
}


function resize(canvas) {  // ref. https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    var realToCSSPixels = window.devicePixelRatio;

    var actualPanelWidth = Math.floor(0.85 * window.innerWidth * realToCSSPixels); // because, in the HTML file, we have set the right panel to be 85% of the window width
    var actualPanelHeight = Math.floor(0.96 * window.innerHeight * realToCSSPixels); 

    var minDimension = Math.min(actualPanelWidth, actualPanelHeight);
    
   // Ajust the canvas to this dimension (square)
    canvas.width  = minDimension;
    canvas.height = minDimension;
	
	gl.viewport(0, 0, canvas.width, canvas.height);

}
""")


class Node:

    def __init__(self, transform=None, render=None, sibling=None, child=None):
        self.transform = transform
        self.render = render
        self.sibling = sibling
        self.child = child


class Wing:

    figure = []
    points_list = []
    stack = []
    modelViewMatrix = mat4()
    #m = None

    def __init__(self):
        global gl

        m = mat4()
        #m = mult(m, translate(5,0,0))
        #m = mult(m, rotate(20.0, 0,0,1))

        self.points_list.append(createModel(cube(10.0)))
        self.figure.append(Node(m, self.render))

        # self.points_list.append(createModel(cube(5.0)))
        # #m = mult(m, translate(20.0-5.0, 0, -20.0))
        # self.figure.append(Node(m, self.render2))

    def render(self):
        global modelview, normalMatrix

        initialModelView = modelview
        normalMatrix = extractNormalMatrix(modelview)
        instanceMatrix = mult(self.modelViewMatrix, scale(2, 0.25, 2))
        modelview = mult(modelview, instanceMatrix)
        self.points_list[0].render()
        modelview = initialModelView

        initialModelView = modelview
        instanceMatrix = mult(mat4(), translate(0, 0, -25/2))
        modelview = mult(modelview, instanceMatrix)
        normalMatrix = extractNormalMatrix(modelview)
        instanceMatrix = mult(instanceMatrix, scale(0.5, 0.25, 3))
        modelview = mult(modelview, instanceMatrix)
        self.points_list[0].render()
        modelview = initialModelView

    # def render2(self):
    #     global modelview, normalMatrix

    #     normalMatrix = extractNormalMatrix(modelview)
    #     instanceMatrix = mult(self.modelViewMatrix, scale(1, 0.5, 5.0))
    #     initialModelView = modelview
    #     modelview = mult(modelview, instanceMatrix)
    #     modelview = initialModelView
    #     self.points_list[1].render()

    def traverse(self, id=0):
        global modelview

        self.stack.push(self.modelViewMatrix)
        self.modelViewMatrix = mult(
            self.modelViewMatrix, self.figure[id].transform)
        self.figure[id].render()
        if self.figure[id].child != None:
            self.traverse(self.figure[id].child)

        self.modelViewMatrix = self.stack.pop()
        if self.figure[id].sibling != None:
            self.traverse(self.figure[id].sibling)


__pragma__('js', '{}', """
//Recursively converts an iterable implementing __iter__, and all __iter__
//objects it contains, into bare list objects""")


def js_list(iterable):
    if hasattr(iterable, "__iter__"):
        return [js_list(i) for i in iterable]  # __:opov
    else:
        return iterable
