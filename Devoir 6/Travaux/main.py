from org.transcrypt import __pragma__, __new__  # __: skip
from MV import mat4, vec4, vec3, ortho, flatten, radians, rotate, scale, translate, mult  # __: skip
from javascript import document, Math   # __: skip

from webgl_utils import clear_canvas, init_webgl_inst, WebGLProgram
from shapes import SpaceShip, Transform
from textures import Texture2D, Mipmap, Skybox, set_texture_old
from planets import Earth, Mars, Venus, Rotation

__pragma__('js', """/*
The main module: 
- Will setup WebGL.
- Initialise the SpaceShip object
- Render the ship once and on onclick events
*/""")


__pragma__('js', '{}', """\n//This is the main function""")


def draw():
    global gl, prog, prog_skybox, prog_reflet, kBoard_displace
    global trirec, sphere, cylinder, box, spaceship, earth, mars, venus, signature
    global ambientProduct, diffuseProduct, specularProduct
    global CoordsLoc, NormalLoc, TexCoordLoc, ProjectionLoc, ModelviewLoc, \
        NormalMatrixLoc, projection, modelview, flattenedmodelview, \
        normalMatrix, rotator, alphaLoc, TextureLoc, SkyBoxLoc, LigthPositionLoc
    global textureList, envTexture, skybox, globalRotator

    __pragma__('js', '//init')

    gl = init_webgl_inst()
    canvas = document.getElementById("gl-canvas")
    # clear_canvas(gl)
    #prog = select_shaders(gl, "vshader", "fshader")

    __pragma__('js', '//LOAD SHADER (standard texture mapping)')
    vertexShaderSource = getTextContent("vshader")
    fragmentShaderSource = getTextContent("fshader")
    prog = WebGLProgram(gl, vertexShaderSource, fragmentShaderSource)
    prog_skybox = WebGLProgram(gl, getTextContent("vshaderbox"), getTextContent("fshaderbox"))
    prog_reflet = WebGLProgram(gl, getTextContent("vshadermap"), getTextContent("fshadermap"))
    #prog_reflet.useProgram()
    prog.locate(gl.getAttribLocation, "vcoords")
    prog.locate(gl.getAttribLocation, "vnormal")
    prog.locate(gl.getAttribLocation, "vtexcoord")
    prog.locate(gl.getUniformLocation, "modelview")
    prog.locate(gl.getUniformLocation, "projection")
    prog.locate(gl.getUniformLocation, "normalMatrix")
    prog.locate(gl.getUniformLocation, "lightPosition")
    prog.locate(gl.getUniformLocation, "alpha")
    prog.locate(gl.getUniformLocation, "texture")
    prog.locate(gl.getUniformLocation, "shininess")

    prog_skybox.locate(gl.getAttribLocation, "vcoords")
    prog_skybox.locate(gl.getAttribLocation, "vnormal")
    prog_skybox.locate(gl.getAttribLocation, "vtexcoord")
    prog_skybox.locate(gl.getUniformLocation, "modelview")
    prog_skybox.locate(gl.getUniformLocation, "projection")
    prog_skybox.locate(gl.getUniformLocation, "skybox")

    prog_reflet.locate(gl.getAttribLocation, "vcoords")
    prog_reflet.locate(gl.getAttribLocation, "vnormal")
    # prog_reflet.locate(gl.getAttribLocation, "vtexcoord")
    prog_reflet.locate(gl.getUniformLocation, "projection")
    prog_reflet.locate(gl.getUniformLocation, "normalMatrix")
    prog_reflet.locate(gl.getUniformLocation, "modelview")
    prog_reflet.locate(gl.getUniformLocation, "skybox")
    # prog_reflet.locate(gl.getUniformLocation, "minv")
    
    # CoordsLoc = gl.getAttribLocation(prog, "vcoords")
    # NormalLoc = gl.getAttribLocation(prog, "vnormal")
    # TexCoordLoc = gl.getAttribLocation(prog, "vtexcoord")
    # # general vertex shader uniforms
    # prog.ModelviewLoc = gl.getUniformLocation(prog, "modelview")
    # prog.ProjectionLoc = gl.getUniformLocation(prog, "projection")
    # prog.NormalMatrixLoc = gl.getUniformLocation(prog, "normalMatrix")
    # prog.LigthPositionLoc = gl.getUniformLocation(prog, "lightPosition")
    # # skybox vertex shader uniforms
    # prog_skybox.ModelviewLoc = gl.getUniformLocation(prog_skybox, "modelview")
    # prog_skybox.ProjectionLoc = gl.getUniformLocation(prog_skybox, "projection")
    # prog_skybox.NormalMatrixLoc = gl.getUniformLocation(prog_skybox, "normalMatrix")
    # prog_skybox.LigthPositionLoc = gl.getUniformLocation(prog_skybox, "lightPosition")
    
    
    # # locate variables for the Phong+texture fragment shaders
    # alphaLoc = gl.getUniformLocation(prog, "alpha")
    # TextureLoc = gl.getUniformLocation(prog, "texture")
    # # locate variables for the skybox fragment shaders
    # SkyBoxLoc = gl.getUniformLocation(prog_skybox, "skybox")

    ambientProduct = mult(lightAmbient, materialAmbient)
    diffuseProduct = mult(lightDiffuse, materialDiffuse)
    specularProduct = mult(lightSpecular, materialSpecular)

    #projection = perspective(70.0, 1.0, 1.0, 200.0)
    projection = perspective(60.0, 1.0, 1.0, 3000.0)

    # gl.uniform4fv(gl.getUniformLocation(
    #     prog, "ambientProduct"), flatten(ambientProduct))
    # gl.uniform4fv(gl.getUniformLocation(
    #     prog, "diffuseProduct"), flatten(diffuseProduct))
    # gl.uniform4fv(gl.getUniformLocation(
    #     prog, "specularProduct"), flatten(specularProduct))

    #  create a "rotator" monitoring mouse mouvement
    # rotator = __new__(SimpleRotator(canvas, render))
    #  set initial camera position at z=40, with an "up" vector aligned with y axis
    #   (this defines the initial value of the modelview matrix )
    # rotator.setView([.3, .2, .5], [0, 1.0, 0], 60)

    spaceship = SpaceShip()
    skybox = Skybox(2999.0, Mipmap(gl, envImgPaths))
    earth = Earth()
    mars = Mars()
    venus = Venus()
    box = createModelmap(cube(10.0))
    signature = createModel(cube(10.0))
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
    textureList.append(Texture2D(gl, "img/earthmap1k.jpg"))
    textureList.append(Texture2D(gl, "img/moonmap1k.jpg"))
    textureList.append(Texture2D(gl, "img/mars_1k_color.jpg"))
    textureList.append(Texture2D(gl, "img/venusmap.jpg"))
    textureList.append(Texture2D(gl, "img/Signature.png"))

    # managing arrow keys (to move up or down the model)
    kBoard_displace = Transform()
    kBoard_displace.advancing = True
    
    __pragma__('js', '{}', """ 
document.onkeydown = function (e) {
    var k = kBoard_displace
    switch (e.key) {
        case 'Home':
            //resize the canvas to the current window width and height
            resize(canvas)
            break
        case 'ArrowUp':
            if (k.advancing == true) {
                k.translate = mult (translate (0, 0, 5), k.translate);
            }
            else {
                k.multi = mult (mult (k.rotate, k.translate), k.multi);
                sky_rotate = mult(k.rotate, sky_rotate);
                k.tranlate = translate (0, 0, 5);
                k.rotate = mat4();
                k.advancing = true;
            }
            break;
        case 'ArrowDown':
            if (k.advancing == true) {
                k.translate = mult (translate (0, 0, -(5)), k.translate);
            }
            else {
                k.multi = mult (mult (k.rotate, k.translate), k.multi);
                sky_rotate = mult(k.rotate, sky_rotate);
                k.tranlate = translate (0, 0, -5);
                k.rotate = mat4();
                k.advancing = true;
            }            
            break;
        case 'ArrowRight':
            if (!(k.advancing == true)) {
                k.rotate = mult (rotate (2.0, 0, 1, 0), k.rotate);
            }
            else {
                k.multi = mult (mult (k.rotate, k.translate), k.multi);
                sky_rotate = mult(k.rotate, sky_rotate);
                k.rotate = rotate (2.0, 0, 1, 0);
                k.translate = mat4();
                k.advancing = false;
            }
            break;
        case 'ArrowLeft':
            if (!(k.advancing == true)) {
                k.rotate = mult (rotate (-2.0, 0, 1, 0), k.rotate);
            }
            else {
                k.multi = mult (mult (k.rotate, k.translate), k.multi);
                sky_rotate = mult(k.rotate, sky_rotate);
                k.rotate = rotate (-2.0, 0, 1, 0);
                k.translate = mat4();
                k.advancing = false;
            }            
            break;
    };
};
document.getElementById("Cloak").onclick = invisible;

    """)
    
    # gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    # gl.enable(gl.BLEND)
    # gl.depthMask(False)
    # setTimeout(invisible, 1500)
    globalRotator = Rotation(rotate(1.0, 0,1,0))
    setInterval(render, 50)
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



# def handleLoadedTexture(texture):
#     global ntextures_loaded
#     gl.bindTexture(gl.TEXTURE_2D, texture)
#     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, True)
#     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
#                   gl.UNSIGNED_BYTE, texture.image)
#     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
#     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

#     ntextures_loaded += 1

#     render()  # Call render function when the image has been loaded (to make sure the model is displayed)

#     gl.bindTexture(gl.TEXTURE_2D, None)


def render():
    global flattenedmodelview, modelview, normalMatrix, ntextures_loaded,\
        ntextures_tobeloaded, skybox, ModelviewLoc, NormalMatrixLoc, kBoard_displace,\
        sky_rotate, lightPosition, CoordsLoc, NormalLoc, TexCoordLoc

    gl.clearColor(0.79, 0.76, 0.27, 1)
    clear_canvas(gl)
    
    spaceship.transform.multi = scale(.30, .30, .30)
    earth_scale = scale(30, 30, 30)
    m = mult(translate(0,0,1000.0), earth_scale)
    earth.transform.multi = m
    mars.transform.multi = mult(translate(1000.0,0,0), 
                                mult(earth_scale, scale(0.53,0.53,0.53))
                            )
    venus.transform.multi = mult(translate(-1000.0,0,0), 
                                mult(earth_scale, scale(0.94,0.94,0.94))
                            )
    # earth.transform.rotate = earth.planet_rotate
   # earth.transform.multi = mult(earth.transform.multi, mars_scale)
    # spaceship.traverse()

    # if texture image has been loaded
    if (all([t.isloaded for t in textureList])
        and skybox.isloaded()):

        # m = mult(kBoard_displace.rotate, kBoard_displace.translate)
        # m = mult(m, kBoard_displace.multi)
        # lightPosition_save = lightPosition
        # lightPosition = add(vec4(m[0][3],m[1][3],m[2][3],0), lightPosition)
        # lightPosition[3] = 1
        
        initialModelView = modelview
        __pragma__('js', '{}', """//initialise skybox program""")
        prog_skybox.useProgram()
        # send projection matrix to the shader program
        gl.uniformMatrix4fv(prog_skybox.loc("projection"), False, flatten(projection))
        gl.enableVertexAttribArray(prog_skybox.loc("vcoords"))
        # gl.uniform4fv(prog_skybox.loc("lightPosition"), flatten(lightPosition))

        m = mult(kBoard_displace.rotate, sky_rotate)
        modelview = mult(m, modelview)
        skybox.render(prog_skybox)

        modelview = initialModelView
        __pragma__('js', '{}', """//initialise env mapping program""")
        prog_reflet.useProgram()
        gl.uniformMatrix4fv(prog_reflet.loc("projection"), False, flatten(projection))
        gl.enableVertexAttribArray(prog_reflet.loc("vcoords"))
        gl.enableVertexAttribArray(prog_reflet.loc("vnormal"))

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.mipmap.texture)
        # Send texture to sampler
        gl.uniform1i(prog_reflet.loc("skybox"), 0)

        m = mult(kBoard_displace.rotate, kBoard_displace.translate)
        m = mult(m, kBoard_displace.multi)
        modelview = mult(mult(m, modelview), translate(10,10,0))
        modelview = mult(modelview, globalRotator.rotation)
        normalMatrix = extractNormalMatrix(modelview)
        box.render(prog_reflet)

        modelview = initialModelView
        __pragma__('js', '{}', """//phong + texture general program""")
        prog.useProgram()
        gl.uniform1f(prog.loc("alpha"), alpha)
        gl.uniform1f(prog.loc("shininess"), materialShininess)
        gl.uniform4fv(prog.loc("lightPosition"), flatten(lightPosition))
        gl.uniformMatrix4fv(prog.loc("projection"), False, flatten(projection))
        gl.enableVertexAttribArray(prog.loc("vcoords"))
        gl.enableVertexAttribArray(prog.loc("vnormal"))
        gl.enableVertexAttribArray(prog.loc("vtexcoord"))

        modelview = mult(m, modelview)
        ModelviewLoc = prog.loc("modelview")
        NormalMatrixLoc = prog.loc("normalMatrix")
        # gl.uniform4fv(prog.loc("lightPosition"), flatten(lightPosition))        
        
        CoordsLoc = prog.loc("vcoords")
        NormalLoc = prog.loc("vnormal")
        TexCoordLoc = prog.loc("vtexcoord")
        
        spaceship.traverse()
        earth.traverse()
        mars.traverse()
        venus.traverse()

        __pragma__('js', '{}', """//Signature box""")
        modelview = mult(modelview, translate(-10,10,0))
        modelview = mult(modelview, globalRotator.rotation)
        gl.uniform1f(prog.loc("alpha"), 0.5)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.enable(gl.BLEND)
        gl.depthMask(False)
        set_texture_old(12)
        signature.render()
        set_texture_old(0)
        gl.uniform1f(prog.loc("alpha"), 1.0)
        gl.disable(gl.BLEND)
        gl.depthMask(True)

        modelview = initialModelView
        # lightPosition = lightPosition_save
        

