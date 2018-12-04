from shapes import Figure, Node, Transform
from textures import set_texture
from JS import setInterval #__: skip

class Mars(Figure):
    
    def __init__(self):
        super().__init__()

        sphere_r = 10.0
        self.shapeList.append(createModel(uvSphere(sphere_r, 25.0, 25.0)))

        def render_planet():
            set_texture(2)
            self.generic_shape(self.shapeList[0])
            set_texture(0)

        m = Transform()
        self.figure.append(Node(m, render_planet, None, None))

        self.planet_rotate = mat4()

        setInterval(self.rotate, 50)

    def rotate(self):
        self.planet_rotate = mult(self.planet_rotate, rotate(0.5, 0,1,0))
