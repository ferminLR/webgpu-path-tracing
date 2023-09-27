// cornell box scene, saved as a bunch of javascript typed arrays

const vertexArray = new Float32Array(4*36);
const indexArray = new Uint32Array(4*36);

var totalVertices = 0;
const addVertex = (x,y,z) => {
  vertexArray[totalVertices++] = x;
  vertexArray[totalVertices++] = y;
  vertexArray[totalVertices++] = z;
  vertexArray[totalVertices++] = 0.0;
}

var totalIndices = 0;
const addFace = (v0, v1, v2) => {
  indexArray[totalIndices++] = v0-1;
  indexArray[totalIndices++] = v1-1;
  indexArray[totalIndices++] = v2-1;
  indexArray[totalIndices++] = 0;
}

const meshArray = new Uint32Array(4*6);
const materialArray = new Float32Array(12*6); // needed padding
var meshArrayIndex = 0;
var materialArrayIndex = 0;
let vi, fi;

// Material colors
let white = [0.73, 0.73, 0.73];
let red = [0.65, 0.05, 0.05];
let green = [0.12, 0.45, 0.15];
let light = [15.0, 15.0, 15.0];

// Floor, back wall and ceiling
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(-0.274799, -0.273000, 0.279600);
addVertex(0.278000, -0.273000, 0.279600);
addVertex(0.278000, -0.273000, -0.279600);
addVertex(-0.271599, -0.273000, -0.279600);
addVertex(-0.277999, 0.275800, 0.279600);
addVertex(-0.277999, 0.275800, -0.279600);
addVertex(0.278000, 0.275800, -0.279600);
addVertex(0.278000, 0.275800, 0.279600);
addFace(1, 2, 3);
addFace(1, 3, 4);
addFace(5, 6, 7);
addFace(5, 7, 8);
addFace(7, 4, 3);
addFace(7, 6, 4);
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = white[0];
materialArray[materialArrayIndex++] = white[1];
materialArray[materialArrayIndex++] = white[2];
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

// Tall block
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(0.013239, -0.272900, -0.017047);
addVertex(0.013239, 0.057100, -0.017047);
addVertex(-0.144353, -0.272900, 0.031839);
addVertex(-0.144353, 0.057100, 0.031839);
addVertex(-0.035647, -0.272900, -0.174639);
addVertex(-0.035647, 0.057100, -0.174639);
addVertex(-0.193239, -0.272900, -0.125753);
addVertex(-0.193239, 0.057100, -0.125753);
addFace(10, 11, 9);
addFace(12, 15, 11);
addFace(16, 13, 15);
addFace(14, 9, 13);
addFace(15, 9, 11);
addFace(12, 14, 16);
addFace(10, 12, 11);
addFace(12, 16, 15);
addFace(16, 14, 13);
addFace(14, 10, 9);
addFace(15, 13, 9);
addFace(12, 10, 14);
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = white[0];
materialArray[materialArrayIndex++] = white[1];
materialArray[materialArrayIndex++] = white[2];
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 1.0; // metallic
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

// Short block
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(0.195646, -0.272900, 0.055136);
addVertex(0.195646, -0.107900, 0.055136);
addVertex(0.148464, -0.272900, 0.213246);
addVertex(0.148464, -0.107900, 0.213246);
addVertex(0.037536, -0.272900, 0.007954);
addVertex(0.037536, -0.107900, 0.007954);
addVertex(-0.009646, -0.272900, 0.166064);
addVertex(-0.009646, -0.107900, 0.166064);
addFace(18, 19, 17);
addFace(20, 23, 19);
addFace(24, 21, 23);
addFace(22, 17, 21);
addFace(23, 17, 19);
addFace(20, 22, 24);
addFace(18, 20, 19);
addFace(20, 24, 23);
addFace(24, 22, 21);
addFace(22, 18, 17);
addFace(23, 21, 17);
addFace(20, 18, 22);
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = white[0];
materialArray[materialArrayIndex++] = white[1];
materialArray[materialArrayIndex++] = white[2];
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

// Light
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(-0.065000, 0.275700, 0.052600);
addVertex(0.065000, 0.275700, 0.052600);
addVertex(-0.065000, 0.275700, -0.052400);
addVertex(0.065000, 0.275700, -0.052400);
addFace(27, 26, 25);
addFace(27, 28, 26);
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = white[0];
materialArray[materialArrayIndex++] = white[1];
materialArray[materialArrayIndex++] = white[2];
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = light[0];
materialArray[materialArrayIndex++] = light[1];
materialArray[materialArrayIndex++] = light[2];
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

// Left wall
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(-0.274799, -0.273000, 0.279600);
addVertex(-0.271599, -0.273000, -0.279600);
addVertex(-0.277999, 0.275800, 0.279600);
addVertex(-0.277999, 0.275800, -0.279600);
addFace(32, 29, 30);
addFace(32, 31, 29);
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = red[0];
materialArray[materialArrayIndex++] = red[1];
materialArray[materialArrayIndex++] = red[2];
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

// Right wall
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(0.278000, -0.273000, 0.279600);
addVertex(0.278000, -0.273000, -0.279600);
addVertex(0.278000, 0.275800, -0.279600);
addVertex(0.278000, 0.275800, 0.279600);
addFace(36, 34, 33);
addFace(36, 35, 34);
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = green[0];
materialArray[materialArrayIndex++] = green[1];
materialArray[materialArrayIndex++] = green[2];
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

let scene = {
  vertexArray: vertexArray,
  indexArray: indexArray,
  meshArray: meshArray,
  materialArray: materialArray,
}

export default scene
