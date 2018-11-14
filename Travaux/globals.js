


var gl = null;
var prog = null;
//Dimension of render
var render_D = 3;
var CoordsLoc = null;
var NormalLoc = null;
var TexCoordLoc = null;
var ProjectionLoc = null;
var ModelviewLoc = null;
var NormalMatrixLoc = null;
var projection = null;
var modelview = null;
var flattenedmodelview = null;
var normalMatrix = mat3 ();
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
