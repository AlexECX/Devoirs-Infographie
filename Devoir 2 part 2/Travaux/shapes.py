from org.transcrypt import __pragma__ #__: skip
from py_vector import Vector2D, Vector3D
import py_vector

__pragma__('js',"""
//make_square is usually prefered.""")
def make_square2D(size=.5):
    square = [
        Vector2D(-size, -size),
        Vector2D(size, -size),
        Vector2D(size, size),
        Vector2D(-size, size),
    ]
    return square

def make_square(size=.5):
    square = [
        Vector3D(-size, -size, 0),
        Vector3D(size, -size, 0),
        Vector3D(size, size, 0),
        Vector3D(-size, size, 0),
    ]
    return square


def make_cube(size=.5, z=0):
    base = [
        Vector3D(-size, -size, size),
        Vector3D(-size, size, size),
        Vector3D(size, size, size),
        Vector3D(size, -size, size),
        
        Vector3D(-size, -size, -size),
        Vector3D(-size, size, -size),
        Vector3D(size, size, -size),
        Vector3D(size, -size, -size),

    ]

    cube = [
        [base[1], base[0], base[3], base[2], ],
        [base[2], base[3], base[7], base[6], ],
        [base[3], base[0], base[4], base[7], ],
        [base[6], base[5], base[1], base[2], ],
        [base[4], base[5], base[6], base[7], ],
        [base[5], base[4], base[0], base[1], ],
    ]

    return cube


def make_triangle(size=.5):
    triangle = [
        # Vector2D(0, size),
        # Vector2D(-size, -size),
        # Vector2D(size,  -size),
        Vector2D(-size, size),
        Vector2D(-size, -size),
        Vector2D(size, size),
    ]

    return triangle

__pragma__('js', '{}', """
//Recursively divides a triangle in 3 parts, by count times""")
def divide_triangle(tri, count):
    points = []
    if (count is 0):
        points = points + tri #__: opov
        return points
        
    else:

        ab = py_vector.mix(tri[0], tri[1], 1/3)
        ac = py_vector.mix(tri[0], tri[2], 1/3)
        bc = py_vector.mix(tri[1], tri[2], 1/3)

        count -= 1
        p_list = []

        p_list.append(divide_triangle((tri[2], ac, bc,), count))
        p_list.append(divide_triangle((tri[0], ab, ac,), count))
        p_list.append(divide_triangle((tri[1], bc, ab,), count))

        for i in p_list:
            points = points + i #__: opov

        return points

__pragma__('js', '{}', """
//Recursively divides a square in 8 parts, by count times""")
def divide_square(sq, count):
    points = []
    if (count is 0):
        points = points + sq[0:3]  # __: opov
        points = points + sq[1:4]  # __: opov
        points = points + [sq[2], sq[3], sq[0], ]  # __: opov
        return points
       
    else:
        ab = py_vector.mix(sq[0], sq[1], 1/3)
        ac = py_vector.mix(sq[0], sq[2], 1/3)
        ad = py_vector.mix(sq[0], sq[3], 1/3)
        ba = py_vector.mix(sq[1], sq[0], 1/3)
        bc = py_vector.mix(sq[1], sq[2], 1/3)
        bd = py_vector.mix(sq[1], sq[3], 1/3)
        ca = py_vector.mix(sq[2], sq[0], 1/3)
        cb = py_vector.mix(sq[2], sq[1], 1/3)
        cd = py_vector.mix(sq[2], sq[3], 1/3)
        da = py_vector.mix(sq[3], sq[0], 1/3)
        db = py_vector.mix(sq[3], sq[1], 1/3)
        dc = py_vector.mix(sq[3], sq[2], 1/3)

        count -= 1
        p_list = []

        # __pragma__('opov')
        # average = (sq[0] + sq[1] + sq[2] + sq[3])/[4,4]
        # __pragma__('noopov')

        # a1 = py_vector.mix(average, sq[0], 1/3)
        # b1 = py_vector.mix(average, sq[1], 1/3)
        # c1 = py_vector.mix(average, sq[2], 1/3)
        # d1 = py_vector.mix(average, sq[3], 1/3)

        p_list.append(divide_square((sq[0], ab, ac, ad,), count))
        p_list.append(divide_square((ba, sq[1], bc, bd), count))
        p_list.append(divide_square((ca, cb, sq[2], cd), count))
        p_list.append(divide_square((da, db, dc, sq[3],), count))

        p_list.append(divide_square((ab, ba, bd, ac,), count))
        p_list.append(divide_square((bd, bc, cb, ca,), count))
        p_list.append(divide_square((db, ca, cd, dc), count))
        p_list.append(divide_square((ad, ac, db, da), count))

        for i in p_list:
            points = points + i #__: opov

        return points

__pragma__('js', '{}', """
//Recursively divides the six faces of a cube in 8 parts, by count times.
//This function is depreciated in favor of a multithreaded method 
//using JS workers.""")
def divide_cube(cube, count):
    points = []
    p_list = []
    
    p_list.append(divide_square(cube[:4], count))
    p_list.append(divide_square(cube[4:], count))
    p_list.append(divide_square([cube[0], cube[1], cube[5], cube[4], ], count))
    p_list.append(divide_square([cube[2], cube[3], cube[7], cube[6], ], count))
    p_list.append(divide_square([cube[0], cube[3], cube[7], cube[4], ], count))
    p_list.append(divide_square([cube[1], cube[2], cube[6], cube[5], ], count))

    for i in p_list:
            points = points + i #__: opov

    return points

__pragma__('js', """
//Experimental functions
""")

def shift(shape, coord):

    for vec in shape:
        __pragma__('opov')
        vec += coord
        __pragma__('noopov')

    return shape


def rotate_left(shape):
    __pragma__('opov')
    new_shape = [
        shape[0] + [-1/8, 0, -1/8],
        shape[1] + [-1/8, 0, -1/8],
        shape[2] + [-1/8, 0, 1/8],
        shape[3] + [-1/8, 0, 1/8],

        shape[4] + [1/8, 0, 1/8],
        shape[5] + [1/8, 0, 1/8],
        shape[6] + [1/8, 0, -1/8],
        shape[7] + [1/8, 0, -1/8]
    ]
    __pragma__('noopov')
    return new_shape

def rotate_up(shape):
    __pragma__('opov')
    new_shape = [
        shape[0] + [0, 1/8, -1/8],
        shape[1] + [0, 1/8, 1/8],
        shape[2] + [0, 1/8, 1/8],
        shape[3] + [0, 1/8, -1/8],

        shape[4] + [0, -1/8, 1/8],
        shape[5] + [0, -1/8, -1/8],
        shape[6] + [0, -1/8, -1/8],
        shape[7] + [0, -1/8, 1/8]
    ]
    __pragma__('noopov')
    return new_shape
