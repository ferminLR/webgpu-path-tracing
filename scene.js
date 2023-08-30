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
const materialArray = new Float32Array(8*6);
var meshArrayIndex = 0;
var materialArrayIndex = 0;
let vi, fi;

// Floor, back wall and ceiling
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(-1.000000, -1.000000, 1.000000)
addVertex(-1.000000, 1.000000, 1.000000)
addVertex(-1.000000, -1.000000, -1.000000)
addVertex(-1.000000, 1.000000, -1.000000)
addVertex(1.000000, -1.000000, 1.000000)
addVertex(1.000000, 1.000000, 1.000000)
addVertex(1.000000, -1.000000, -1.000000)
addVertex(1.000000, 1.000000, -1.000000)
addFace( 7, 4, 3);
addFace( 1, 7, 3);
addFace( 6, 4, 8);
addFace( 8, 4, 7);
addFace( 5, 7, 1);
addFace( 2, 4, 6);
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = 0.5;
materialArray[materialArrayIndex++] = 0.5;
materialArray[materialArrayIndex++] = 0.5;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

// Taller cuboid
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(-0.607057, -0.997528, 0.112962)
addVertex(-0.607057, 0.202472, 0.112962)
addVertex(-0.795351, -0.997528, -0.456727)
addVertex(-0.795351, 0.202472, -0.456727)
addVertex(-0.037369, -0.997528, -0.075332)
addVertex(-0.037369, 0.202472, -0.075332)
addVertex(-0.225662, -0.997528, -0.645021)
addVertex(-0.225662, 0.202472, -0.645021)
addFace(10, 11, 9)
addFace(12, 15, 11)
addFace(16, 13, 15)
addFace(14, 9, 13)
addFace(15, 9, 11)
addFace(12, 14, 16)
addFace(10, 12, 11)
addFace(12, 16, 15)
addFace(16, 14, 13)
addFace(14, 10, 9)
addFace(15, 13, 9)
addFace(12, 10, 14)
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = 0.5;
materialArray[materialArrayIndex++] = 0.5;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

// Cube
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(0.075360, -0.991467, 0.422903)
addVertex(0.075360, -0.391467, 0.422903)
addVertex(0.415052, -0.991467, -0.071677)
addVertex(0.415052, -0.391467, -0.071677)
addVertex(0.569940, -0.991467, 0.762595)
addVertex(0.569940, -0.391467, 0.762595)
addVertex(0.909632, -0.991467, 0.268016)
addVertex(0.909632, -0.391467, 0.268016)
addFace(18, 19, 17)
addFace(20, 23, 19)
addFace(24, 21, 23)
addFace(22, 17, 21)
addFace(23, 17, 19)
addFace(20, 22, 24)
addFace(18, 20, 19)
addFace(20, 24, 23)
addFace(24, 22, 21)
addFace(22, 18, 17)
addFace(23, 21, 17)
addFace(20, 18, 22)
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = 0.5;
materialArray[materialArrayIndex++] = 0.5;
materialArray[materialArrayIndex++] = 0.5;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

// Light
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(-0.320999, 0.972590, 0.320999)
addVertex(0.320999, 0.972590, 0.320999)
addVertex(-0.320999, 0.972590, -0.320999)
addVertex(0.320999, 0.972590, -0.320999)
addFace(27, 26, 25)
addFace(28, 26, 27)
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 1.0;

// Red wall
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(-1.000000, -1.000000, 1.000000)
addVertex(-1.000000, 1.000000, 1.000000)
addVertex(-1.000000, -1.000000, -1.000000)
addVertex(-1.000000, 1.000000, -1.000000)
addFace(31, 30, 29)
addFace(32, 30, 31)
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 0.0;

// Green wall
vi = totalVertices/4;
fi = totalIndices/4;
meshArray[meshArrayIndex++] = totalVertices/4;
meshArray[meshArrayIndex++] = totalIndices/4;
addVertex(1.000000, -1.000000, 1.000000)
addVertex(1.000000, 1.000000, 1.000000)
addVertex(1.000000, -1.000000, -1.000000)
addVertex(1.000000, 1.000000, -1.000000)
addFace(33, 36, 35)
addFace(34, 36, 33)
meshArray[meshArrayIndex++] = totalVertices/4 - vi;
meshArray[meshArrayIndex++] = totalIndices/4 - fi;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 1.0;
materialArray[materialArrayIndex++] = 0.0;
materialArray[materialArrayIndex++] = 1.0;
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
