from main import render
from org.transcrypt import __pragma__, __new__ #__: skip
from JS import Image #__: skip

__pragma__('js', '{}', """/**
* Shortcut to set the texture. 
*/""")
def set_texture(index):
    global gl, prog, textureList
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureList[index])

    # Send texture to sampler
    gl.uniform1i(gl.getUniformLocation(prog, "texture"), 0)

def set_mipmap(mipmap):
    global gl, prog
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, mipmap.texture)
    # Send texture to sampler
    gl.uniform1i(gl.getUniformLocation(prog, "skybox"), 0)


class Mipmap:

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
            for j,img in enumerate(self.imgs):
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

class Skybox:
    
    def __init__(self, size, mipmap):
        self.skybox = createModelbox(cube(size))
        self.mipmap = mipmap

    def render(self):
        set_mipmap(self.mipmap)
        self.skybox.render()
        set_texture(0)

    def isloaded(self):
        return self.mipmap.isloaded
