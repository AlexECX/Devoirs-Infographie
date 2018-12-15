
//globals dans un fichier à part pour ne pas
//qu'ils soient encapsulé dans un module

var gl = null;
var prog = null;
var prog_skybox = null;
var prog_reflet = null;
var invisibility_timeout = null;
var kBoard_displace = null;
var sky_rotate = mat4();
var globalRotator = null;
//Location of the coords attribute variable in the standard texture mappping shader program.
var CoordsLoc = null;
var NormalLoc = null;
var TexCoordLoc = null;
//Location of the uniform variables in the standard texture mappping shader program.
var ProjectionLoc = null;
var ModelviewLoc = null;
var NormalMatrixLoc = null;
var LigthPositionLoc = null;
//Location of the uniform variables in the Phong+texture fragment shader.
var alphaLoc = null;
var TextureLoc = null;

var SkyBoxLoc = null;
var alphaLoc = null;
//# --- projection matrix
var projection = null;
//# modelview matrix
var modelview = mult(mat4(), translate(0,0,-20));
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
var signature = null;
var spaceship = null;
var earth = null;
var mars = null;
var venus = null;
//Phong model elements
var lightPosition = vec4 (20.0, 20.0, 100.0, 1.0);
var lightAmbient = vec4 (1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4 (1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4 (1.0, 1.0, 1.0, 1.0);
var materialAmbient = vec4 (0.3, 0.3, 0.3, 1.0); //Ka
var materialDiffuse = vec4 (193/255, 192/255, 190/255, 1.0); //Kd
var materialSpecular = vec4 (0.55, 0.55, 0.55, 1.0); //Ks
var materialShininess = 100.0;
var ambientProduct = null;
var diffuseProduct = null;
var specularProduct = null;
var alpha = 1.0;
//color codes (rgb)
//var BaseColors = list ([vec4 (0.0, 0.0, 0.0, 1.0), vec4 (1.0, 0.0, 0.0, 1.0), vec4 (1.0, 1.0, 0.0, 1.0), vec4 (0.0, 1.0, 0.0, 1.0), vec4 (0.0, 0.0, 1.0, 1.0), vec4 (1.0, 0.0, 1.0, 1.0), vec4 (0.0, 1.0, 1.0, 1.0), vec4 (1.0, 1.0, 1.0, 1.0)]);
var textureList;
var skybox;
var envImgPaths = [
    "img/nebula_posx.png", "img/nebula_negx.png",
    "img/nebula_posy.png", "img/nebula_negy.png",
    "img/nebula_posz.png", "img/nebula_negz.png"
 ];
var envTexture;


var texIDmap0;  // environmental texture identifier
var texID1, texID2, texID3, texID4;  // standard texture identifiers
var ct = 0;
var img = new Array(6);