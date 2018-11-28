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


__pragma__('js', '{}', """\n//This is the main function""")


def draw():
    global gl, prog
    global trirec, sphere, cylinder, box,  spaceship
    global ambientProduct, diffuseProduct, specularProduct
    global CoordsLoc, NormalLoc, TexCoordLoc, ProjectionLoc, ModelviewLoc, \
        NormalMatrixLoc, projection, modelview, flattenedmodelview, \
        normalMatrix, rotator, alphaLoc
    global textureList

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
    alphaLoc = gl.getUniformLocation(prog, "alpha")

    ModelviewLoc = gl.getUniformLocation(prog, "modelview")
    ProjectionLoc = gl.getUniformLocation(prog, "projection")
    NormalMatrixLoc = gl.getUniformLocation(prog, "normalMatrix")

    gl.enableVertexAttribArray(CoordsLoc)
    gl.enableVertexAttribArray(NormalLoc)
    gl.enableVertexAttribArray(TexCoordLoc)

    #  create a "rotator" monitoring mouse mouvement
    rotator = __new__(SimpleRotator(canvas, render))
    #  set initial camera position at z=40, with an "up" vector aligned with y axis
    #   (this defines the initial value of the modelview matrix )
    rotator.setView([.3, .2, .5], [0, 1.0, 0], 60)

    ambientProduct = mult(lightAmbient, materialAmbient)
    diffuseProduct = mult(lightDiffuse, materialDiffuse)
    specularProduct = mult(lightSpecular, materialSpecular)

    gl.uniform4fv(gl.getUniformLocation(
        prog, "ambientProduct"), flatten(ambientProduct))
    gl.uniform4fv(gl.getUniformLocation(
        prog, "diffuseProduct"), flatten(diffuseProduct))
    gl.uniform4fv(gl.getUniformLocation(
        prog, "specularProduct"), flatten(specularProduct))
    gl.uniform1f(gl.getUniformLocation(
        prog, "shininess"), materialShininess)

    gl.uniform4fv(gl.getUniformLocation(
        prog, "lightPosition"), flatten(lightPosition))

    projection = perspective(70.0, 1.0, 1.0, 200.0)
    # send projection matrix to the shader program
    gl.uniformMatrix4fv(ProjectionLoc, False, flatten(projection))

    spaceship = SpaceShip()
    #box = createModel(empty_cube(10.0, 2.0))
    box = createModel(cube(10.0))

    __pragma__('js', '{}', """//preparation textures""")
    textureList = []
    textureList.append(initTexture("img/text1.jpg", handleLoadedTexture))
    textureList.append(initTexture("img/text3.jpg", handleLoadedTexture))
    textureList.append(initTexture("img/text5.jpg", handleLoadedTexture))
    textureList.append(initTexture("img/textCanon.jpg", handleLoadedTexture))
    textureList.append(initTexture("img/textCanon2.jpg", handleLoadedTexture))
    textureList.append(initTexture("img/textCanon3.jpg", handleLoadedTexture))
    textureList.append(initTexture("img/textBlanc.jpg", handleLoadedTexture))
    textureList.append(initTexture(
        "img/textCockpitGlass.jpg", handleLoadedTexture))

    # managing arrow keys (to move up or down the model)
    __pragma__('js', '{}', """ 
document.onkeydown = function (e) {
    switch (e.key) {
        case 'Home':
            //resize the canvas to the current window width and height
            resize(canvas)
            break
    };
};
document.getElementById("Cloak").onclick = invisible;

    """)
    gl.uniform1f(alphaLoc, alpha)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    gl.depthMask(False)
    setTimeout(invisible, 2000)
    render()

# def cloak():
#     global invisibility_timeout
#     window.clearTimeout(invisibility_timeout)
#     v = setTimeout(invisible, 2)


def invisible():
    global alpha

    if alpha == 0.01:
        alpha = 0.011
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.05;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 100)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.1;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 200)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.3;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 300)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.5;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 400)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.8;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 500)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 1.0;
            gl.uniform1f(alphaLoc, alpha);
            gl.disable(gl.BLEND);
            gl.depthMask(true);
            render();
        }"""), 600)
    elif alpha == 1.0:
        alpha = 0.99
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.8;
            gl.uniform1f(alphaLoc, alpha);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
            gl.depthMask(false);
            render();
        }"""), 100)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.5;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 200)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.3;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 300)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.1;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 400)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.05;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 500)
        setTimeout(__pragma__('js', '{}', """function() {
            alpha = 0.01;
            gl.uniform1f(alphaLoc, alpha);
            render();
        }"""), 600)


def handleLoadedTexture(texture):
    global ntextures_loaded
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, True)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                  gl.UNSIGNED_BYTE, texture.image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

    ntextures_loaded += 1

    render()  # Call render function when the image has been loaded (to make sure the model is displayed)

    gl.bindTexture(gl.TEXTURE_2D, None)


def render():
    global flattenedmodelview, modelview, normalMatrix, ntextures_loaded,\
        ntextures_tobeloaded

    gl.clearColor(0.79, 0.76, 0.27, 1)
    clear_canvas(gl)

    # g = Matrice4(2)
    # c = Matrice4(3)
    # k = c * g #__: opov

    flattenedmodelview = rotator.getViewMatrix()
    modelview = unflatten(flattenedmodelview)
    initialModelView = modelview
    normalMatrix = extractNormalMatrix(modelview)
    # modelview = mult(modelview, scale(1, 4, .5))
    # box.render()
    spaceship.transform = Transform()
    spaceship.transform.multi = scale(.80, .80, .80)
    # spaceship.traverse()

    # if texture image has been loaded
    if ntextures_loaded == len(textureList):

        spaceship.traverse()

    modelview = initialModelView
