from shapes import Figure, Node, Transform
from textures import set_texture_old
from JS import setInterval  # __: skip

__pragma__('js', '{}', """/**
* Encapsulation d'une matrice de rotation auto incrémenté tout les 50 ms
*/""")
class Rotation:
    def __init__(self, r_matrix):

        self.rotation = mat4()
        self.rotate_matrix = r_matrix if r_matrix else rotate(0.1, 0,1,0)
        setInterval(self.rotate, 50)

    def rotate(self):
        self.rotation = mult(
            self.rotation, self.rotate_matrix
        )


class Earth(Figure):

    def __init__(self):
        super().__init__()
        self.shapeList.append(createModel(uvSphere(10, 25.0, 25.0)))
        self.moon = Rotation(rotate(0.8,0,1,0))
        self.moon_orbit = Rotation(rotate(-0.2, 0,1,0))
        self.rotator = Rotation()

        def render_planet():

            set_texture_old(8)
            save = self.transform.rotate
            self.transform.rotate = mult(
                self.rotation, self.transform.rotate)
            self.generic_shape(self.shapeList[0])
            self.transform.rotate = save
            set_texture_old(0)

        m = Transform(rotate=rotate(-90.0, 1,0,0))
        self.figure.append(Node(m, render_planet, None, 1))

        def render_moon():
            set_texture_old(9)
            save = self.transform.rotate
            self.transform.rotate = mult(
                self.moon.rotation, self.transform.rotate)
            self.transform.multi = mult(
                self.transform.multi, self.moon_orbit.rotation)
            #self.transform.multi = mult(rot, )
            self.generic_shape(self.shapeList[0])
            self.transform.rotate = save
            set_texture_old(0)

        m = Transform(translate=translate(0, 0, -22), scale=scale(.27, .27, .27))
        self.figure.append(Node(m, render_moon, None, None))

    @property
    def rotation(self):
        return self.rotator.rotation


class Mars(Figure):

    def __init__(self):
        super().__init__()
        self.shapeList.append(createModel(uvSphere(10, 25.0, 25.0)))
        self.rotator = Rotation()

        def render_planet():

            set_texture_old(10)
            save = self.transform.rotate
            self.transform.rotate = mult(
                self.rotation, self.transform.rotate)
            self.generic_shape(self.shapeList[0])
            self.transform.rotate = save
            set_texture_old(0)

        m = Transform(rotate=rotate(-90.0, 1,0,0))
        self.figure.append(Node(m, render_planet, None, None))

    @property
    def rotation(self):
        return self.rotator.rotation


class Venus(Figure):

    def __init__(self):
        super().__init__()
        self.shapeList.append(createModel(uvSphere(10, 25.0, 25.0)))
        self.rotator = Rotation()

        def render_planet():

            set_texture_old(11)
            save = self.transform.rotate
            self.transform.rotate = mult(
                self.rotation, self.transform.rotate)
            self.generic_shape(self.shapeList[0])
            self.transform.rotate = save
            set_texture_old(0)

        m = Transform(rotate=rotate(-90.0, 1,0,0))
        self.figure.append(Node(m, render_planet, None, None))

    @property
    def rotation(self):
        return self.rotator.rotation
