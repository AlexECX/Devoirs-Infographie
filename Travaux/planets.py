from shapes import Figure, Node, Transform
from textures import set_texture
from JS import setInterval #__: skip

class Rotation:
    def __init__(self, degree):
        
        self.planet_rotation = mat4()
        self.rotate_deg = degree if degree else 0.1
        setInterval(self.rotate, 50)

    def rotate(self):
        self.planet_rotation = mult(
            self.planet_rotation, rotate(self.rotate_deg, 0,1,0)
            )



class Mars(Figure):
    
    def __init__(self):
        super().__init__()
        self.shapeList.append(createModel(uvSphere(10, 25.0, 25.0)))
        self.moon = Rotation(0.8)
        self.moon_orbit = Rotation(-0.2)
        self.rotator = Rotation()

        def render_planet():
            
            set_texture(2)
            rot = self.planet_rotation
            self.transform.rotate = mult(rot, self.transform.rotate)
            self.generic_shape(self.shapeList[0])
            self.transform.rotate = mult(mat4invert(rot), self.transform.rotate)
            set_texture(0)

        m = Transform()
        self.figure.append(Node(m, render_planet, None, 1))

        def render_moon():
            set_texture(2)
            rot = self.moon.planet_rotation
            self.transform.rotate = mult(self.moon.planet_rotation, self.transform.rotate)
            self.transform.multi = mult(self.transform.multi, self.moon_orbit.planet_rotation)
            #self.transform.multi = mult(rot, )
            self.generic_shape(self.shapeList[0])
            #self.transform.rotate = mult(mat4invert(rot), self.transform.rotate)
            set_texture(0)

        m = Transform(translate=translate(0,0, -15), scale=scale(.1,.1,.1))
        self.figure.append(Node(m, render_moon, None, None))

    @property
    def planet_rotation(self):
        return self.rotator.planet_rotation