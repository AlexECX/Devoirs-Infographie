
var canvas;
var gl;
var display;

var NumVertices  = 36;

var points = [];
var solidcolors = [];
var shadedcolors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;
var vColorLoc;

var prevx, prevy;
var dragging = false;
var anglex = 0;
var angley = 0;

function doMouseDown(evt) {
    if (dragging)
        return;
    dragging = true;
    document.addEventListener("mousemove", doMouseDrag, false);
    document.addEventListener("mouseup", doMouseUp, false);
    var box = canvas.getBoundingClientRect();
    prevx = evt.clientX - box.left;
    prevy = canvas.height + (evt.clientY - box.top);
}
function doMouseDrag(evt) {
    if (!dragging)
        return;
    var box = canvas.getBoundingClientRect();
    var x = evt.clientX - box.left;
    var y = canvas.height + (evt.clientY - box.top);

    anglex += y - prevy;
    angley += x - prevx;

    display.innerHTML = "<div> anglex = " + anglex + " ***** angley = " + angley +" </div>";

    prevx = x;
    prevy = y;
    
    render();
    
}
function doMouseUp(evt) {
    if (dragging) {
        document.removeEventListener("mousemove", doMouseDrag, false);
        document.removeEventListener("mouseup", doMouseUp, false);
        dragging = false;
    }
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    display = document.getElementById("display");

    canvas.addEventListener("mousedown", doMouseDown, false);


    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var solidcolorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW);

    vColorLoc = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorLoc );


    var shadedcolorsBuffer = gl.createBuffer();


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    //event listeners for buttons
    
    document.getElementById("ShadedButton").onclick = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, shadedcolorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(shadedcolors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColorLoc);
        render();
    };
    document.getElementById("SolidButton").onclick = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColorLoc);
        render();
    };

    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) 
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.8, 0.8, 0.8, 1.0 ],  // gray
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
            // for solid colored faces use 
            solidcolors.push(vertexColors[a]);

            // for shaded colored faces use 
            shadedcolors.push(vertexColors[indices[i]]);
    }

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[0] = anglex/10.0;
    theta[1] = angley/10.0;

    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

//    requestAnimFrame( render );
}

