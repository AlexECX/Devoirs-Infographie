from org.transcrypt import __pragma__ #__: skip


__pragma__('js', '{}', """/**
* Recursively converts an iterable implementing __iter__, and all __iter__
* objects it contains, into bare array objects
*/""")

def js_list(iterable):
    if hasattr(iterable, "__iter__"):
        return [js_list(i) for i in iterable]  # __:opov
    else:
        return iterable

__pragma__('js', '{}', """/**
* typeof compatibility for Transcrypt 
*/""")
def js_typeof(value):
    __pragma__('js', '{}', """return typeof value""")

__pragma__('js', '{}', """
class PythonError extends Error {
    constructor(py_exception){
        super((py_exception.__name__ + ': ') + str (py_exception));
        this.name = py_exception.__name__;
        this.stack = py_exception.stack;
    }
}  """)
__pragma__('js', '{}', """/**
* Converts a Python Transcript exception to a descriptive JS Error. 
*/""")
def handle_PythonError(func):
    def wrapper():
        try:
            func()
        except Exception as e:
            __pragma__('js', '{}', """throw new PythonError(e)""")
    return wrapper

    
