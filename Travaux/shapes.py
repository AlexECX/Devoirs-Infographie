from org.transcrypt import __pragma__  # __: skip
from MV import mat4, vec4, vec3, ortho, flatten, radians, rotate, scale, translate, mult  # __: skip
from daudet import createModel, extractNormalMatrix  # __: skip

__pragma__('js', """
/**
* Shortcut pour créer un objet ({{}} représente un dictionnaire en python).
*/""")
def js_obj():
    __pragma__('js', 'return {{}}')


__pragma__('js', """
/**
* Structure pour encapsuler des transformations matriciel.
* L'attribut "multi" est employé pour appliquer une matrice,
* composé ou non, après toutes les autres
*/""")
class Transform:
    __pragma__('kwargs')
    def __init__(self, **kwargs):
        self.translate = kwargs.get("translate", mat4())
        self.rotate = kwargs.get("rotate", mat4())
        self.scale = kwargs.get("scale", mat4())
        self.multi = kwargs.get("multi", mat4())
    __pragma__('nokwargs')


    def scale_factor(self):
        __pragma__('js', 'var obj = {{}}')
        obj.x = self.scale[0][0]
        obj.y = self.scale[1][1]
        obj.z = self.scale[2][2]
        return obj

    def combine(self):
        return self.__class__(
            multi=mult(self.multi, mult(self.translate, mult(self.rotate, self.scale)))
        )

    def __copy__(self):
        newone = self.__class__(
            translate=self.translate,
            rotate=self.rotate,
            scale=self.scale,
            multi=self.multi
        )
        return newone

__pragma__('js', """/**
* Element de liste chainée
*/""")
class Node:

    def __init__(self, transform=None, render=None, sibling=None, child=None):
        self.transform = transform
        self.render = render
        self.sibling = sibling
        self.child = child

__pragma__('js', """/**
* Classe représente un élément d'un modèle. Permet d'encapsuler
* un sous ensemble de noeuds
*/""")
class Figure:

    def __init__(self):
        self.figure = []
        self.shapeList = []
        self.stack = []
        self.transform = Transform()
        

    def generic_shape(self, shape_object):
        __pragma__('js', """//Fonction render de base pour à peu près tous les noeuds""")
    
        global modelview, normalMatrix

        initialModelView = modelview
        scaleSafeMatrix = mult(self.transform.translate, self.transform.rotate)
        normalMatrix = extractNormalMatrix(mult(modelview, scaleSafeMatrix))

        instanceMatrix = mult(self.transform.multi, scaleSafeMatrix)
        instanceMatrix = mult(instanceMatrix, self.transform.scale)
        modelview = mult(modelview, instanceMatrix)
        shape_object.render()
        modelview = initialModelView

    
    def traverse(self):
        __pragma__('js', """//Permet de traverser la liste chainée de l'objet""")

        def _traverse(id):
            self.stack.push(self.transform.__copy__())

            self.transform.translate = mult(
                self.transform.translate, self.figure[id].transform.translate)
            self.transform.rotate = mult(
                self.transform.rotate, self.figure[id].transform.rotate)
            self.transform.scale = mult(
                self.transform.scale, self.figure[id].transform.scale)
            self.transform.multi = mult(
                self.transform.multi, self.figure[id].transform.multi)

            self.figure[id].render()
            if self.figure[id].child != None:
                _traverse(self.figure[id].child)

            self.transform = self.stack.pop()
            if self.figure[id].sibling != None:
                _traverse(self.figure[id].sibling)
        
        _traverse(0)
   
__pragma__('js', """/**
* Classe mère du vaisseau.
*/""")
class SpaceShip(Figure):
    
    def __init__(self):
        super().__init__()
        ID = 0
        self.shapeList.append(Wing())
        self.shapeList.append(CenterPiece())


        def wing_render():
            surface = self.shapeList[0]
            surface.transform = self.transform.combine()
            surface.traverse()

        m = Transform(
            translate=translate(10, 0,0),
            rotate=rotate(-20.0, 0,0,1), 
            scale=scale(1,.75,1)
        )
        self.figure.append(Node(m, wing_render, ID + 1, None))
        ID += 1

        m = Transform(
            translate=translate(-10, 0,0),
            rotate=rotate(20.0, 0,0,1), 
            scale=scale(-1,.75,1)
        )
        self.figure.append(Node(m, wing_render, ID + 1, None))
        ID += 1

        def center_render():
            surface = self.shapeList[1]
            surface.transform = self.transform
            surface.traverse()

        m = Transform(multi=translate(0, 5, 5))
        self.figure.append(Node(m, center_render, None, None))
        ID += 1


    def render(self):
        self.transform = Transform()
        self.traverse()


__pragma__('js', """/**
* Une aile du vaisseau
*/""")
class Wing(Figure):

    def __init__(self):
        global gl

        super().__init__()

        size = 10.0
        cy_heigth = 20.0
        ID = 0
        self.shapeList.append(createModel(cube(size)))
        self.shapeList.append(createModel(uvCylinder(10.0, cy_heigth, 25.0, False, False)))
        self.shapeList.append(createModel(tetrahedre(10.0)))
        #self.shapeList.append(Reactor())

        def rectangle():
            self.generic_shape(self.shapeList[0])

        def cylinder():
            self.generic_shape(self.shapeList[1])

        def tetra():
            self.generic_shape(self.shapeList[2])

        __pragma__('js', '//#start wing construct')
        
        m = Transform(scale=scale(2,.5,2))
        self.figure.append(Node(m, rectangle, None, ID +1))
        ID += 1

        
        m = Transform(translate=translate(0,0,size), scale=scale(1,1,1))
        self.figure.append(Node(m, tetra, ID +1, None))
        ID += 1

        
        m = Transform(scale=scale(.5, 1, 1.5))
        m.translate = translate(size*2/2-size/2, 0, -(size*2/2+size*3/2))
        self.figure.append(Node(m, rectangle, None, ID + 1))
        ID += 1
        
        #sibling branching
        
        __pragma__('js', '//#reactor')
        __pragma__('js', '{}', """/*
        
        def reactor():
            surface = self.shapeList[2]
            surface.transform = self.transform
            surface.traverse()

        m = Transform(
            translate=translate(0,5,-15),
            scale=scale(.5,.5,.10)
        )
        
        self.figure.append(Node(m, reactor, ID + 1, None))
        ID += 1
        */""")
        
        m = Transform(
            translate=translate(0,0,-15),
            scale=scale(.4,.4,.03)
        )
        self.figure.append(Node(m, cylinder, ID + 1, None))
        ID += 1

        __pragma__('js', '//#cannon 1/3')
        
        m = Transform(scale=scale(.75, .80, 2/3))
        m.translate = translate(5+5*.75, 0, -3)
        self.figure.append(Node(m, rectangle, None, ID + 1))
        ID += 1

        __pragma__('js', '//#cannon 2/3')
        
        m = Transform(scale=scale(.80,.60,.50))
        m.translate = translate(0, 0, size*2/3 + size*.50)
        self.figure.append(Node(m, rectangle, None, ID + 1))
        ID += 1

        __pragma__('js', '//#cannon 3/3')
        
        m = Transform(scale=scale(.15, 3/4*.50, .30))
        m.translate = translate(0, 0, size*.80/2 + cy_heigth*.30/2)
        self.figure.append(Node(m, cylinder, None, None))

__pragma__('js', """/**
* La partie central du vaisseau, ainsi que le cockpit
*/""")
class CenterPiece(Figure):
    
    def __init__(self):
        super().__init__()

        m = mat4()
        size = 10.0
        cy_heigth = 5.0
        cy_r = 10.0
        ID = 0
        self.shapeList.append(createModel(cube(size)))
        self.shapeList.append(createModel(uvCylinder(cy_r, cy_heigth, 22.0, False, False)))
        self.shapeList.append(createModel(uvCylinder(cy_r, cy_heigth, 6.0, False, False)))
        self.shapeList.append(createModel(quad(size, size, size/2)))
        self.shapeList.append(FrontCannon())

        def rectangle():
            self.generic_shape(self.shapeList[0])

        def cylinder():
            self.generic_shape(self.shapeList[1])

        def cylinder6slice():
            self.generic_shape(self.shapeList[2])

        def tri_rect():
            self.generic_shape(self.shapeList[3])

        
        m = Transform(scale=scale(.5,1,3))
        self.figure.append(Node(m, rectangle, None, ID +1))
        ID += 1

        __pragma__('js', """
//#mainframe cockpit start""")
        m = Transform(
            translate=translate(0,0,size*3/2),
            rotate=rotate(90.0, 0,1,0), 
            scale=mult(scale(1, .5, 1), mat4invert(m.scale))
        )
        self.figure.append(Node(m, cylinder, None, ID + 1))
        ID += 1

        m = Transform(
            rotate=rotate(50.0, 0,0,1),
            scale=scale(.8,1,1),
            translate=translate(0,-cy_r*1/2*.45,cy_r*1/2*1.15)
        )
        self.figure.append(Node(m, cylinder, None, ID + 1))
        ID += 1

        m = Transform(
            rotate=rotate(20.0, 0,0,1),
            translate=translate(0,-cy_r*1/4,cy_r*1/4)
        )
        self.figure.append(Node(m, cylinder, None, ID + 1))
        ID += 1

        __pragma__('js', """//#mainframe cockpit end
        """)

        __pragma__('js', '{}', """//#reactor""")
        m = Transform(
            rotate=rotate(-80.0, 0,0,1),
            scale=scale(.5, .5, 1),
            translate=translate(0, -cy_heigth*1.1, cy_heigth*.80)
        )
        self.figure.append(Node(m, cylinder, ID + 1, None))
        ID += 1

        __pragma__('js', """//#canon""")
        def canon_right():
            surface = self.shapeList[4]
            surface.transform = self.transform.combine()
            surface.traverse()
            
        m = Transform(
            translate=translate(cy_heigth/2+cy_heigth/4,-cy_heigth,0),
            scale=mult(scale(.5,.5, .5), mat4invert(scale(.8,.5,1))),
            rotate=mat4invert(mult(rotate(90.0, 0,1,0), rotate(70, 0,0,1)))
        )
        self.figure.append(Node(m, canon_right, ID + 1, None))
        ID += 1

        __pragma__('js', """//#canon""")
        def canon_left():
            surface = self.shapeList[4]
            surface.transform = self.transform.combine()
            surface.transform.translate = scale(-1,1,1)
            surface.traverse()
            
        m = m.__copy__()
        m.translate = translate(-(cy_heigth/2+cy_heigth/4),-cy_heigth,0)
        self.figure.append(Node(m, canon_left, None, None))
      
__pragma__('js', """/**
* Un canon avant du vaisseau
*/""")
class FrontCannon(Figure):
    
    def __init__(self):
        super().__init__()

        m = mat4()
        size = 5.0
        cy_heigth = 2.5
        cy_r = 5.0
        ID = 0
        self.shapeList.append(createModel(uvCylinder(cy_r, cy_heigth, 6.0, False, False)))
        self.shapeList.append(createModel(uvCylinder(cy_r, cy_heigth, 25.0, False, False)))
        self.shapeList.append(createModel(quad(size, size, size/2)))

        def cylinder6slice():
            self.generic_shape(self.shapeList[0])

        def cylinder():
            self.generic_shape(self.shapeList[1])

        def tri_rect():
            self.generic_shape(self.shapeList[2])

        m = Transform(
            rotate=rotate(30.0, 0,0,1),
            scale=scale(1,1,5)
        )
        self.figure.append(Node(m, cylinder6slice, None, ID + 1))
        p_ID = ID
        ID += 1

        m = Transform(
            scale=scale(1/3, 1/3, 1+6/5),
            translate=translate(0,0, cy_heigth*6)
            )   
        self.figure.append(Node(m, cylinder, None, ID + 1))
        
        ID += 1

        m = Transform(
            scale=scale(1.2, 1.2, 1/6),
            translate=translate(0,0, -cy_heigth*3)
            )
        self.figure.append(Node(m, cylinder, None, None))
        ID += 1

        self.figure[p_ID].sibling = ID
        ID += 1

        m = Transform(
            rotate=mult(rotate(180.0 , 0,0,1), rotate(-90.0, 0,1,0)),
            scale=scale(3/4*size,1,.5),
            translate=translate(-cy_r/2, cy_r/4, -cy_heigth*5)
        )    
        self.figure.append(Node(m, tri_rect, None, None))
        ID += 1

__pragma__('js', """/**
* L'extrémité d'un réacteur. Je n'ai pas réussi à terminer l'implémentation
*/""")
class Reactor(Figure):
    
    def __init__(self):
        global gl

        super().__init__()

        size = 10.0
        ID = 0
        m = Transform()
        generic_shape = self.generic_shape
        self.shapeList.append(createModel(cube(size)))

        def render(transform):
            global modelview, normalMatrix

            initialModelView = modelview
            scaleSafeMatrix = mult(self.transform.translate, transform.translate)
            scaleSafeMatrix = mult(scaleSafeMatrix, mult(self.transform.rotate, transform.rotate))
            normalMatrix = extractNormalMatrix(mult(modelview, scaleSafeMatrix))

            instaceMatrix = mult(self.transform.multi, transform.multi)
            instanceMatrix = mult(instaceMatrix, scaleSafeMatrix)
            instanceMatrix = mult(instanceMatrix, transform.scale)
            modelview = mult(modelview, instanceMatrix)
            self.shapeList[0].render()
            modelview = initialModelView

        def sides():
            transform = self.preTransformList[self.ids.nextId()]
            sc = self.transform.scale_factor()
            transform.translate[0][3] = transform.translate[0][3]*sc.x
            transform.scale = mult(transfo.scale, scale(1,sc.y,1))
            self.transform.scale[0][0] = 1
            self.transform.scale[1][1] = 1
            render(transform)
            self.transform.scale = scale(sc.x, sc.y, sc.z)

        def topbot():
            transform = self.preTransformList[self.ids.nextId()]
            sc = self.transform.scale_factor()
            transform.translate[1][3] = transform.translate[1][3]*sc.y
            transform.scale = mult(transfo.scale, scale(sc.x,1,1))
            self.transform.scale[0][0] = 1
            self.transform.scale[1][1] = 1
            render(transform)
            self.transform.scale = scale(sc.x, sc.y, sc.z)
            

        transfo = Transform(
            translate=translate(size/2*.90, 0, 0),
            scale=scale(.10,1,1)
        )
        self.figure.append(Node(m, sides, ID + 1, None))
        ID += 1

        transfo = Transform(
            translate=translate(-(size/2*.90), 0, 0),
            scale=scale(.10,1,1)
        )
        self.preTransformList.append(transfo)
        self.figure.append(Node(m, sides, ID + 1, None))
        ID += 1

        transfo = Transform(
            translate=translate(0, size/2*.90, 0),
            scale=scale(1,.10,1)
        )
        self.preTransformList.append(transfo)
        self.figure.append(Node(m, topbot, ID + 1, None))
        ID += 1

        transfo = Transform(
            translate=translate(0, -(size/2*.90), 0),
            scale=scale(1,.10,1)
        )
        self.preTransformList.append(transfo)
        self.figure.append(Node(m, topbot, None, None))
        ID += 1

        # m = translate(0, 0, -(size*p_sc.z/2))
        
        # self.figure.append(Node(m, reactor, ID + 1, None))
        # ID += 1




