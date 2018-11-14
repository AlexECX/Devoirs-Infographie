from org.transcrypt import __pragma__  # __: skip
from MV import mat4, vec4, vec3, ortho, flatten, radians, rotate, scale, translate, mult  # __: skip
from daudet import createModel, extractNormalMatrix  # __: skip

def js_obj():
    __pragma__('js', 'var obj = {{}}')
    return obj

def vec3_obj(x, y, z):
    vec = js_obj()
    vec.x = x
    vec.y = y
    vec.z = z
    return vec

def tri_heigth(b, c):
    a = Math.sqrt(c*c - (b/2)*(b/2))
    return a


class Node:

    def __init__(self, transform=None, render=None, sibling=None, child=None):
        self.transform = transform
        self.render = render
        self.sibling = sibling
        self.child = child


class Figure:

    def __init__(self):
        self.figure = []
        self.shapeList = []
        self.scaleList = []
        self.ids = js_obj()
        self.stack = []
        self.modelViewMatrix = mat4()

        self.ids.list = []
        self.ids.id = -1
        def nextId():
            self.ids.id = self.ids.id + 1
            return self.ids.id
        self.ids.nextId = nextId

    def traverse(self):
        self.ids.id = -1

        def _traverse(id):
            self.stack.push(self.modelViewMatrix)
            self.modelViewMatrix = mult(
                self.modelViewMatrix, self.figure[id].transform)
            self.figure[id].render()
            if self.figure[id].child != None:
                _traverse(self.figure[id].child)

            self.modelViewMatrix = self.stack.pop()
            if self.figure[id].sibling != None:
                _traverse(self.figure[id].sibling)
        
        _traverse(0)

    def render(self):
        self.traverse()


class SpaceShip(Figure):
    
    def __init__(self):
        super().__init__()
        ID = 0
        m = mat4()

        def wing_render():
            surface = self.shapeList[0]
            surface.modelViewMatrix = self.modelViewMatrix
            surface.traverse()

        self.shapeList.append(Wing())

        m = mult(translate(10, 0,0), rotate(-20.0, 0,0,1))
        self.figure.append(Node(m, wing_render, ID + 1, None))
        ID += 1

        m = mult(translate(-10, 0,0), rotate(20.0, 0,0,1))
        m = mult(m, scale(-1,1,1))
        self.figure.append(Node(m, wing_render, ID + 1, None))
        ID += 1

        self.shapeList.append(CenterPiece())

        def center_render():
            surface = self.shapeList[1]
            surface.modelViewMatrix = self.modelViewMatrix
            surface.traverse()

        m = translate(0, 5, 5)
        self.figure.append(Node(m, center_render, None, None))
        ID += 1

class Wing(Figure):

    size = 10.0
    cy_heigth = 20.0

    def __init__(self):
        global gl

        super().__init__()

        m = mat4()
        size = self.size
        cy_heigth = self.cy_heigth
        ID = 0
        self.shapeList.append(createModel(cube(size)))
        self.shapeList.append(createModel(uvCylinder(10.0, cy_heigth, 25.0, False, False)))

        rectangle = self.rectangle
        cylinder = self.cylinder
        reactor = self.reactor

        #start wing construct
        sc = vec3_obj(2,.5,2)
        self.scaleList.append(sc)
        self.figure.append(Node(m, rectangle, None, ID + 1))
        ID += 1

        sc = vec3_obj(sc.x/2, sc.y, sc.z * 1.5)
        self.scaleList.append(sc)
        m = translate(sc.x * size/2, 0, -(size*sc.z - size*sc.z/1.5/4))
        self.figure.append(Node(m, rectangle, None, ID + 1))
        ID += 1


        #sibling branching
        p_sc = self.scaleList[1]

        #reactor
        sc = vec3_obj(p_sc.x*.75, p_sc.y * .75, p_sc.z*.10)
        self.scaleList.append(sc)
        m = translate(0, 0, -(size*p_sc.z/2))
        
        self.figure.append(Node(m, reactor, ID + 1, None))
        ID += 1

        #cannon 1/3
        sc = vec3_obj(p_sc.x*.75, p_sc.y * .80, p_sc.z * 2/3)
        self.scaleList.append(sc)
        m = translate(p_sc.x*size/2 + sc.x*size/2, 0, -size*p_sc.z*.15)
        self.figure.append(Node(m, rectangle, None, ID + 1))
        ID += 1

        #cannon 2/3
        sc = vec3_obj(sc.x*.80, sc.y * .60, sc.z * .50)
        p_sc = self.scaleList[2]
        self.scaleList.append(sc)
        m = translate(0, 0, size*p_sc.x + size*sc.x)
        self.figure.append(Node(m, rectangle, None, ID + 1))
        ID += 1

        #cannon 3/3
        sc = vec3_obj(sc.y*.80/2, sc.y* .80/2, sc.z/4)
        p_sc = self.scaleList[2]
        self.scaleList.append(sc)
        m = translate(0, 0, size*p_sc.x/2 + cy_heigth*sc.z/2)
        self.figure.append(Node(m, cylinder, None, None))

    def cylinder(self):
            global modelview, normalMatrix
            sc = self.scaleList[self.ids.nextId()]

            initialModelView = modelview
            normalMatrix = extractNormalMatrix(mult(modelview, self.modelViewMatrix))
            instanceMatrix = mult(self.modelViewMatrix, scale(sc.x, sc.y, sc.z))
            modelview = mult(modelview, instanceMatrix)
            self.shapeList[1].render()
            modelview = initialModelView

    def rectangle(self):
            global modelview, normalMatrix
            sc = self.scaleList[self.ids.nextId()]

            initialModelView = modelview
            normalMatrix = extractNormalMatrix(mult(modelview, self.modelViewMatrix))
            instanceMatrix = mult(self.modelViewMatrix, scale(sc.x, sc.y, sc.z))
            modelview = mult(modelview, instanceMatrix)
            self.shapeList[0].render()
            modelview = initialModelView

    def reactor(self):
            global modelview, normalMatrix
            sc = self.scaleList[self.ids.nextId()]
            size = self.size

            initialModelView = modelview
            instanceMatrix = mult(self.modelViewMatrix, translate(0, (size*sc.y-size*sc.y*.10)/2 ,0))
            normalMatrix = extractNormalMatrix(mult(modelview, self.modelViewMatrix))
            instanceMatrix = mult(instanceMatrix, scale(sc.x, sc.y*.10, sc.z))
            modelview = mult(modelview, instanceMatrix)
            self.shapeList[0].render()
            modelview = initialModelView

            instanceMatrix = mult(self.modelViewMatrix, translate(0, -(size*sc.y-size*sc.y*.10)/2 ,0))
            normalMatrix = extractNormalMatrix(mult(modelview, self.modelViewMatrix))
            instanceMatrix = mult(instanceMatrix, scale(sc.x, sc.y*.10, sc.z))
            modelview = mult(modelview, instanceMatrix)
            self.shapeList[0].render()
            modelview = initialModelView

            instanceMatrix = mult(self.modelViewMatrix, translate((size*sc.x-size*sc.x*.10)/2, 0 ,0))
            normalMatrix = extractNormalMatrix(mult(modelview, self.modelViewMatrix))
            instanceMatrix = mult(instanceMatrix, scale(sc.x*.10, sc.y, sc.z))
            modelview = mult(modelview, instanceMatrix)
            self.shapeList[0].render()
            modelview = initialModelView

            instanceMatrix = mult(self.modelViewMatrix, translate(-(size*sc.x-size*sc.x*.10)/2, 0 ,0))
            normalMatrix = extractNormalMatrix(mult(modelview, self.modelViewMatrix))
            instanceMatrix = mult(instanceMatrix, scale(sc.x*.10, sc.y, sc.z))
            modelview = mult(modelview, instanceMatrix)
            self.shapeList[0].render()
            modelview = initialModelView


class CenterPiece(Figure):
    
    def __init__(self):
        super().__init__()

        m = mat4()
        size = 10.0
        cy_heigth = 20.0
        ID = 0
        self.shapeList.append(createModel(cube(size)))
        self.shapeList.append(createModel(uvCylinder(10.0, cy_heigth, 25.0, False, False)))

        #start wing construct
        def rectangle():
            global modelview, normalMatrix
            sc = self.scaleList[self.ids.nextId()]
            initialModelView = modelview
            normalMatrix = extractNormalMatrix(mult(modelview, self.modelViewMatrix))
            instanceMatrix = mult(self.modelViewMatrix, scale(sc.x, sc.y, sc.z))
            modelview = mult(modelview, instanceMatrix)
            self.shapeList[0].render()
            modelview = initialModelView

        sc = vec3_obj(.5,1,3)
        self.scaleList.append(sc)
        self.figure.append(Node(m, rectangle, None, None))
        ID += 1


