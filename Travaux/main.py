from org.transcrypt import __pragma__, __new__  # __: skip
from MV import mat4, vec4, vec3, ortho, flatten, radians, rotate, scale, translate, mult  # __: skip
from javascript import document, Math   # __: skip

from webgl_utils import webgl_render, clear_canvas, init_webgl_inst, select_shaders
from shapes import SpaceShip, Transform
from textures import Texture2D, Mipmap, Skybox
from planets import Mars

__pragma__('js', """/*
The main module: 
- Will setup WebGL.
- Initialise the SpaceShip object
- Render the ship once and on onclick events
*/""")


__pragma__('js', '{}', """\n//This is the main function""")


def draw():
    global gl, prog, prog_skybox, mars
    global trirec, sphere, cylinder, box,  spaceship
    global ambientProduct, diffuseProduct, specularProduct
    global CoordsLoc, NormalLoc, TexCoordLoc, ProjectionLoc, ModelviewLoc, \
        NormalMatrixLoc, projection, modelview, flattenedmodelview, \
        normalMatrix, rotator, alphaLoc, TextureLoc, SkyBoxLoc, LigthPositionLoc
    global textureList, envTexture, envbox

    __pragma__('js', '//init')
    gl = init_webgl_inst()
    canvas = document.getElementById("gl-canvas")
    # clear_canvas(gl)
    #prog = select_shaders(gl, "vshader", "fshader")

    __pragma__('js', '//LOAD SHADER (standard texture mapping)')
    vertexShaderSource = getTextContent("vshader")
    fragmentShaderSource = getTextContent("fshader")
    prog = createProgram(gl, vertexShaderSource, fragmentShaderSource)
    prog_skybox = createProgram(gl, vertexShaderSource, getTextContent("fshaderbox"))
    
    # locate variables for vertex shaders
    CoordsLoc = gl.getAttribLocation(prog, "vcoords")
    NormalLoc = gl.getAttribLocation(prog, "vnormal")
    TexCoordLoc = gl.getAttribLocation(prog, "vtexcoord")
    # general vertex shader uniforms
    prog.ModelviewLoc = gl.getUniformLocation(prog, "modelview")
    prog.ProjectionLoc = gl.getUniformLocation(prog, "projection")
    prog.NormalMatrixLoc = gl.getUniformLocation(prog, "normalMatrix")
    prog.LigthPositionLoc = gl.getUniformLocation(prog, "lightPosition")
    # skybox vertex shader uniforms
    prog_skybox.ModelviewLoc = gl.getUniformLocation(prog, "modelview")
    prog_skybox.ProjectionLoc = gl.getUniformLocation(prog, "projection")
    prog_skybox.NormalMatrixLoc = gl.getUniformLocation(prog, "normalMatrix")
    prog_skybox.LigthPositionLoc = gl.getUniformLocation(prog, "lightPosition")
    
    # locate variables for the Phong+texture fragment shaders
    alphaLoc = gl.getUniformLocation(prog, "alpha")
    TextureLoc = gl.getUniformLocation(prog, "texture")
    # locate variables for the skybox fragment shaders
    SkyBoxLoc = gl.getUniformLocation(prog_skybox, "skybox")

    ambientProduct = mult(lightAmbient, materialAmbient)
    diffuseProduct = mult(lightDiffuse, materialDiffuse)
    specularProduct = mult(lightSpecular, materialSpecular)

    #projection = perspective(70.0, 1.0, 1.0, 200.0)
    projection = perspective(60.0, 1.0, 1.0, 2000.0)

    # gl.uniform4fv(gl.getUniformLocation(
    #     prog, "ambientProduct"), flatten(ambientProduct))
    # gl.uniform4fv(gl.getUniformLocation(
    #     prog, "diffuseProduct"), flatten(diffuseProduct))
    # gl.uniform4fv(gl.getUniformLocation(
    #     prog, "specularProduct"), flatten(specularProduct))
    __pragma__('js', '{}', """//initialise general program""")
    gl.useProgram(prog)
    gl.uniform1f(alphaLoc, alpha)
    gl.uniform1f(gl.getUniformLocation(
        prog, "shininess"), materialShininess)
    gl.uniform4fv(prog.LigthPositionLoc, flatten(lightPosition))
    # send projection matrix to the shader program
    gl.uniformMatrix4fv(prog.ProjectionLoc, False, flatten(projection))

    __pragma__('js', '{}', """//initialise skybox program""")
    gl.useProgram(prog_skybox)
    gl.uniform4fv(prog_skybox.LigthPositionLoc, flatten(lightPosition))
    # send projection matrix to the shader program
    gl.uniformMatrix4fv(prog_skybox.ProjectionLoc, False, flatten(projection))

    #  create a "rotator" monitoring mouse mouvement
    rotator = __new__(SimpleRotator(canvas, render))
    #  set initial camera position at z=40, with an "up" vector aligned with y axis
    #   (this defines the initial value of the modelview matrix )
    rotator.setView([.3, .2, .5], [0, 1.0, 0], 60)

    spaceship = SpaceShip()
    envbox = Skybox(1999.0, Mipmap(gl, envImgPaths))
    mars = Mars()
    #box = createModel(empty_cube(10.0, 2.0))
    #box = createModel(cube(10.0))
    __pragma__('js', '{}', """//preparation textures""")

    textureList = []
    textureList.append(Texture2D(gl, "img/text1.jpg"))
    textureList.append(Texture2D(gl, "img/text3.jpg"))
    textureList.append(Texture2D(gl, "img/text5.jpg"))
    textureList.append(Texture2D(gl, "img/textCanon.jpg"))
    textureList.append(Texture2D(gl, "img/textCanon2.jpg"))
    textureList.append(Texture2D(gl, "img/textCanon3.jpg"))
    textureList.append(Texture2D(gl, "img/textBlanc.jpg"))
    textureList.append(Texture2D(gl, "img/textCockpitGlass.jpg"))

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
    
    # gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    # gl.enable(gl.BLEND)
    # gl.depthMask(False)
    # setTimeout(invisible, 1500)
    #setInterval(render, 50)
    render()


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


def initEnvMap(paths, onload):
    texture = gl.createTexture()

    for path in paths:
        texture.image = __new__(Image())
        __pragma__('js', '{}', """
        texture.image.onload = function (){
            onload(texture);
        }""")


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
        ntextures_tobeloaded, envbox, ModelviewLoc, NormalMatrixLoc

    gl.clearColor(0.79, 0.76, 0.27, 1)
    clear_canvas(gl)

    # g = Matrice4(2)
    # c = Matrice4(3)
    # k = c * g #__: opov

    flattenedmodelview = rotator.getViewMatrix()
    modelview = unflatten(flattenedmodelview)
    #initialModelView = modelview
    #normalMatrix = extractNormalMatrix(modelview)
    # modelview = mult(modelview, scale(1, 4, .5))
    # box.render()
    #spaceship.transform = Transform()
    spaceship.transform.multi = scale(.30, .30, .30)
    mars_scale = mult(scale(.30,.30,.30), scale(100, 100, 100))
    m = mult(translate(0,0,1000.0), mars.planet_rotate)
    m = mult(m, mars_scale)
    mars.transform.multi = m
   # mars.transform.multi = mult(mars.transform.multi, mars_scale)
    # spaceship.traverse()

    # if texture image has been loaded
    if (all([t.isloaded for t in textureList])
        and envbox.isloaded()):

        ModelviewLoc = prog_skybox.ModelviewLoc
        NormalMatrixLoc = prog_skybox.NormalMatrixLoc
        gl.useProgram(prog_skybox)
        # gl.uniform1i(gl.getUniformLocation(prog_skybox, "selector"), 1)
        # gl.enableVertexAttribArray(CoordsLoc)
        # gl.disableVertexAttribArray(NormalLoc)
        # gl.disableVertexAttribArray(TexCoordLoc)
        # envbox.render()
        # gl.enableVertexAttribArray(CoordsLoc)
        #gl.uniform1f(gl.getUniformLocation(prog, "selector"), 1.0)
        ModelviewLoc = prog.ModelviewLoc
        NormalMatrixLoc = prog.NormalMatrixLoc
        gl.useProgram(prog)
        gl.enableVertexAttribArray(CoordsLoc)
        gl.enableVertexAttribArray(NormalLoc)
        gl.enableVertexAttribArray(TexCoordLoc)
        spaceship.traverse()
        mars.traverse()

    #modelview = initialModelView

        


__pragma__('js', '{}', """

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

}""")
