from main import render
from org.transcrypt import __pragma__, __new__  # __: skip
from JS import Image  # __: skip

__pragma__('js', '{}', """/**
* Shortcut to set the texture (deprecated). 
* TODO replace texture search by index
*/""")


def set_texture_old(index):
    global gl, prog, textureList
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureList[index].texture)

    # Send texture to sampler
    gl.uniform1i(gl.getUniformLocation(prog.prog, "texture"), 0)


def set_mipmap(mipmap):
    global gl, prog
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, mipmap.texture)
    # Send texture to sampler
    gl.uniform1i(gl.getUniformLocation(prog.prog, "skybox"), 0)


__pragma__('js', '{}', """/**
* Encapsule une WebGL Texture 2D. Génère la texture à partir du chemin
* vers une image et l'associe à un handler qui traite la texture d'est
* quelle est chargé.
*/""")


class Texture2D:

    def __init__(self, gl, path):
        self.gl = gl
        self.isloaded = False
        self.img = None
        self.texture = gl.createTexture()

        self.img = __new__(Image())
        self.img.onload = __pragma__(
            'js', '{}', """function () { self.handleLoadedTexture2D(self.texture) }""")
        self.img.src = path

    def handleLoadedTexture2D(self, texture):
        gl = self.gl
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, True)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                      gl.UNSIGNED_BYTE, self.img)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

        self.isloaded = True

        render()  # Call render function when the image has been loaded (to make sure the model is displayed)

        gl.bindTexture(gl.TEXTURE_2D, None)


__pragma__('js', '{}', """/**
* Encapsule une WebGL TEXTURE_CUBE_MAP. Génère la 
* cube_map à partir d'une liste de 6 chemin vers des images et l'associe 
* à un handler qui traite les textures lorsqu'elles sont tous chargées.
*/""")


class TextureCubeMap:

    def __init__(self, gl, paths):
        self.gl = gl
        self.isloaded = False
        self.imgs = []
        self.map_size = len(paths)
        self.loadedTextures = 0
        self.texture = gl.createTexture()

        for path in paths:
            img = __new__(Image())
            img.onload = __pragma__(
                'js', '{}', """function () { self.handleLoadedTextureMap(self.texture) }""")
            img.src = path
            self.imgs.append(img)

    def handleLoadedTextureMap(self, texture):

        self.loadedTextures += 1
        gl = self.gl
        if self.loadedTextures == self.map_size:
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, False)
            targets = [
                gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
            ]
            for j, img in enumerate(self.imgs):
                gl.texImage2D(targets[j], 0, gl.RGBA,
                              gl.RGBA, gl.UNSIGNED_BYTE, img)
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,
                                 gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,
                                 gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

            gl.generateMipmap(gl.TEXTURE_CUBE_MAP)

            self.isloaded = True

            render()

            gl.bindTexture(gl.TEXTURE_2D, None)


__pragma__('js', '{}', """/**
* Encapsulation d'une skybox. 
* @size la taille de la skybox
* @cubemap la texture utilisé par la skybox
*/""")


class Skybox:

    def __init__(self, size, cubemap):
        self.skybox = createModelbox(cube(size))
        self.cubemap = cubemap
        

    def render(self, program):
        # set_mipmap(self.mipmap)
        gl = program.gl
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, self.cubemap.texture)
        # Send texture to sampler
        gl.uniform1i(program.loc("skybox"), 0)
        self.skybox.render(program)

    def isloaded(self):
        return self.cubemap.isloaded
