//
//  Code developped by Daniel Audet allowing to read OBJ files (Wavefront format) generated
//  by several modeling tools such as Blender (https://www.blender.org)
//

var materiallist =[];

// The "Element" function creates and object containing 5 member variables
function Element(coords, normals, texcoords, indices, material){
	
	this.vertexPositions = new Float32Array(coords);
	this.vertexTextureCoords = new Float32Array(texcoords);
	this.vertexNormals = new Float32Array(normals);
	this.indices = new Uint16Array(indices);

	this.material = new GetElementMaterial(material);
	}

function CreateNewMaterial(newmtl, Ns, Ka, Kd, Ks, Ni, d, illum, map){
	this.newmtl = newmtl;
	this.Ns = Ns;
	this.Ka = Ka;
	this.Kd = Kd;
	this.Ks = Ks;
	this.Ni = Ni;
	this.d  =  d;
	this.illum = illum;
	this.map = map;
}

function GetElementMaterial(material){
	for(i=0; i < materiallist.length; i++){
		if(materiallist[i].newmtl == material){
			return(materiallist[i]);
		}
	}
}

function GetMaterialList(parameterstring){
	
	var lines;
	var newmtl, Ns, Ka, Kd, Ks, Ni, d, illum, map;
	var firstgroupofparametersread = false; // indicates if we have read all parameters associated to a material name (newmtl)


	if(parameterstring == null){ // if no material file (.mtl) is found
		newmtl = "None";  // store default material name
		Ns = 100.0;
		Ka = vec3(0.000000, 0.000000, 0.000000);
		Kd = vec3(0.533333, 0.533333, 0.533333);
		Ks = vec3(0.100000, 0.100000, 0.100000);
		Ni = 1.00000;
		d = 1.00000;
		illum = 2;
		map = "";  // clear the texture filename
		materiallist.push(new CreateNewMaterial(newmtl, Ns, Ka, Kd, Ks, Ni, d, illum, map));
		
	}
	else{
		lines = parameterstring.split("\n");
		for ( var i = 0 ; i < lines.length ; i++ ) {
			var parts = lines[i].trimRight().trimLeft().split(' ');
			// Check if there is an empty item in the "parts" array
			var checkemptyitemdone = false;
			var index;
			while(!checkemptyitemdone){
				index = parts.indexOf("");			
				if (index > -1) { // if "" has been found, remove it
				  parts.splice(index, 1); // remove one item (second argument of splice)
				}
				else{
					checkemptyitemdone = true;
				}
			}
		
			switch(parts[0]) {
			case 'newmtl': 
				if(firstgroupofparametersread){
					materiallist.push(new CreateNewMaterial(newmtl, Ns, Ka, Kd, Ks, Ni, d, illum, map));
				}
				firstgroupofparametersread = true;
				map = "";  // clear the texture filename (may not be used)
				newmtl = parts[1];  // store new material name
				break;
			case 'Ns':  
				Ns = parts[1];
				break;
			case 'Ka':  
				Ka = vec3(parts[1], parts[2], parts[3]);
				break;
			case 'Kd':  
				Kd = vec3(parts[1], parts[2], parts[3]);
				break;
			case 'Ks':  
				Ks = vec3(parts[1], parts[2], parts[3]);
				break;
			case 'Ni':  
				Ni = parts[1];
				break;
			case 'd':  
				d = parts[1];
				break;
			case 'illum':  
				illum = parts[1];
				break;
			case 'map_Ka':
			case 'map_Kd':
			case 'map_Ks':
				map = parts[1];
				break;
			}

		}
		materiallist.push(new CreateNewMaterial(newmtl, Ns, Ka, Kd, Ks, Ni, d, illum, map));
	}
}

// The "ExtractDataFromOBJ" function extracts the vertices, normals, texture coordinates and indices
// of each "object" defined in a file.
function ExtractDataFromOBJ(filename) {

	var coords = [];
	var texcoords = [];
	var normals = [];
	var indices = [];
	
	var coordslist = [];
	var texcoordslist = [];
	var normalslist = [];
	var texturefilelist;
	var material;
	
	var p = [];
	var t = [];
	var n = [];
	var f = [];
	
	var string;
	var lines;
	var currentelementnumber = -1;
	var changeelement = false;
	var elementlist = [];
	// var buildingthefacelist;
	var firstmaterial = true;
	var materialfile;
	var facecounter;
	
	// the following "if" is required for "Internet Explorer" (Internet Explorer does not support "trimRight")
	if(typeof String.prototype.trimRight !== 'function') {
		String.prototype.trimRight = function() {
			return this.replace(/\s+$/,"");  // this is a "regular expression"
		}
	}
	// the following "if" is required for "Internet Explorer" (Internet Explorer does not support "trimLeft")
	if(typeof String.prototype.trimLeft !== 'function') {
    String.prototype.trimLeft = function() {
        return this.replace(/^\s+/,"");
    }
}
	
	// load file and put it in a string
	string = loadFileAJAX(filename);
	if(string == null){
		window.alert("The file " + filename + " cannot be found.")
	}
				
	lines = string.split("\n");

		
	// buildingthefacelist = false;
	for ( var i = 0 ; i < lines.length ; i++ ) {
		var parts = lines[i].trimRight().trimLeft().split(' ');
		// Check if there is an empty item in the "parts" array
		var checkemptyitemdone = false;
		var index;
		while(!checkemptyitemdone){
			index = parts.indexOf("");			
			if (index > -1) { // if "" has been found, remove it
			  parts.splice(index, 1); // remove one item (second argument of splice)
			}
			else{
				checkemptyitemdone = true;
			}
		}

		switch(parts[0]) {

			case 'mtllib':  // Store the parameter file (used when creating a new "element")
				materialfile = parts[1];
				parameterstring = loadFileAJAX(materialfile);
				if(parameterstring == null){
					window.alert("The file " + materialfile + "(defined in the OBJ file) cannot be found.")
				}
				GetMaterialList(parameterstring);					
				break;
			case 'usemtl':  // Select material for the current element
				if(firstmaterial == true){  // for the first material defined 
					material = parts[1];
					firstmaterial = false;
					facecounter = 0;
				}
				else{ // for the following materials defined in the group, create a new element
					currentelementnumber += 1;
					elementlist[currentelementnumber] = new Element(coords, normals, texcoords, indices, material);
					// Clear all arrays
					coords.length = 0;
					normals.length = 0;
					texcoords.length = 0;
					indices.length = 0;
					// Store new material
					material = parts[1];
					facecounter = 0;
				}
				break;
			case 'vt':  // texture coordinate
				texcoordslist.push( 
					vec2(
						parseFloat(parts[1]),
						parseFloat(parts[2])
						));
				break;
			case 'v':
				coordslist.push( 
					vec3(
						parseFloat(parts[1]),
						parseFloat(parts[2]),
						parseFloat(parts[3])
						));
				break;
			case 'vn': // normal
				normalslist.push(
					vec3(
						parseFloat(parts[1]),
						parseFloat(parts[2]),
						parseFloat(parts[3])));
				break;
			case 'f':  // polygon face
				// If we reach 15000 faces, generate a new element.
				// This prevents creating arrays too large to be handled by WebGL functions.
				// (if arrays are too large, some polygons are not drawn)
				if(facecounter == 15000){
					currentelementnumber += 1;
					elementlist[currentelementnumber] = new Element(coords, normals, texcoords, indices, material);
					// Clear all arrays
					coords.length = 0;
					normals.length = 0;
					texcoords.length = 0;
					indices.length = 0;
					
					facecounter = 0; 
				}
				facecounter++;
				
				for(var j = 1; j < parts.length; j++){
					f[j] = parts[j].split('/');
				}

				for(var k = 1; k < parts.length; k++){
				  p[k] = coordslist[parseInt(f[k][0]) - 1];  // vertex
				  t[k] = texcoordslist[parseInt(f[k][1]) - 1];	// texcoord
				  n[k] = normalslist[parseInt(f[k][2]) - 1];	// normal
				}

				start = coords.length/3;

				for(var m = 1; m < parts.length; m++){
				  Array.prototype.push.apply(coords, p[m]);   // add vertex to coords
				  Array.prototype.push.apply(texcoords, t[m]);   // add texcoord to texcoords
				  Array.prototype.push.apply(normals, n[m]);  // add normal to normals						  
				}

				for(var h = 1; h < (parts.length-2); h++){
				indices.push(start);
				indices.push(start+h,start+h+1);
				}					  
			  break;
			}
		}
		

	// create new element at the end of the file 
	currentelementnumber += 1;
	elementlist[currentelementnumber] = new Element(coords, normals, texcoords, indices, material);
	
    // empty the materiallist array (if one want to load another OBJ model)
	materiallist.length = 0;
	
   return{
	   list: elementlist,
	   numberofelements: currentelementnumber + 1
   }

}

function loadFileAJAX(filename) {
        var xhr = new XMLHttpRequest(),
            okStatus = document.location.protocol === "file:" ? 0 : 200;
        xhr.open('GET', filename, false);
        xhr.send(null);
        return xhr.status == okStatus ? xhr.responseText : null;
}
 

