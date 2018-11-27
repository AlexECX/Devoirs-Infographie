
//globals dans un fichier à part pour ne pas
//qu'ils soient encapsulé dans un module

var gl = null;
var prog = null;
//Location of the coords attribute variable in the standard texture mappping shader program.
var CoordsLoc = null;
var NormalLoc = null;
var TexCoordLoc = null;
//Location of the uniform variables in the standard texture mappping shader program.
var ProjectionLoc = null;
var ModelviewLoc = null;
var NormalMatrixLoc = null;
//# --- projection matrix
var projection = null;
//# modelview matrix
var modelview = null;
//# --- flattened modelview matrix
var flattenedmodelview = null;
//# --- create a 3X3 matrix that will affect normals
var normalMatrix = mat3 ();
//# A SimpleRotator object to enable rotation by mouse dragging.
var rotator = null;
var trirec = null;
var sphere = null;
var cylinder = null;
var box = null;
var teapot = null;
var disk = null;
var torus = null;
var cone = null;
var hemisphereinside = null;
var hemisphereoutside = null;
var thindisk = null;
var quartersphereinside = null;
var quartersphereoutside = null;
var wing = null;
var spaceship = null;
//Phong model elements
var lightPosition = vec4 (20.0, 20.0, 100.0, 1.0);
var lightAmbient = vec4 (1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4 (1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4 (1.0, 1.0, 1.0, 1.0);
var materialAmbient = vec4 (0.0, 0.1, 0.3, 1.0);
var materialDiffuse = vec4 (0.48, 0.55, 0.69, 1.0);
var materialSpecular = vec4 (0.48, 0.55, 0.69, 1.0);
var materialShininess = 100.0;
var ambientProduct = null;
var diffuseProduct = null;
var specularProduct = null;
//color codes (rgb)
//var BaseColors = list ([vec4 (0.0, 0.0, 0.0, 1.0), vec4 (1.0, 0.0, 0.0, 1.0), vec4 (1.0, 1.0, 0.0, 1.0), vec4 (0.0, 1.0, 0.0, 1.0), vec4 (0.0, 0.0, 1.0, 1.0), vec4 (1.0, 0.0, 1.0, 1.0), vec4 (0.0, 1.0, 1.0, 1.0), vec4 (1.0, 1.0, 1.0, 1.0)]);
