import outputWGSL from './output.wgsl?raw';
import computeWGSL from './compute.wgsl?raw';
import scene from './scene.js';

// Initialize WebGPU context
const canvas = document.querySelector("canvas");
if (!navigator.gpu) {
  throw new Error("WebGPU not supported on this browser.");
}

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  throw new Error("No appropriate GPUAdapter found.");
}

const device = await adapter.requestDevice();

const context = canvas.getContext("webgpu");
const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({
  device: device,
  format: canvasFormat,
});

// Setup the output render pipeline
const outputShaderModule = device.createShaderModule({
  label: "Output shader",
  code: outputWGSL
});

const renderOutputPipeline = device.createRenderPipeline({
  label: "Output render pipeline",
  layout: 'auto',
  vertex: {
    module: outputShaderModule,
    entryPoint: "vert_main",
  },
  fragment: {
    module: outputShaderModule,
    entryPoint: "frag_main",
    targets: [{
      format: canvasFormat
    }]
},
});

const sampler = device.createSampler({
  magFilter: 'linear',
  minFilter: 'linear',
});

// Two textures for ping pong swap to accumulate compute passes
const textureA = device.createTexture({
  size: {
    width: 512,
    height: 512,
  },
  format: 'rgba8unorm',
  usage:
    GPUTextureUsage.COPY_DST |
    GPUTextureUsage.STORAGE_BINDING |
    GPUTextureUsage.TEXTURE_BINDING,
});

const textureB = device.createTexture({
  size: {
    width: 512,
    height: 512,
  },
  format: 'rgba8unorm',
  usage:
    GPUTextureUsage.COPY_DST |
    GPUTextureUsage.STORAGE_BINDING |
    GPUTextureUsage.TEXTURE_BINDING,
});

// Two bind groups to render the last accumulated compute pass
const renderOutputBindGroup = [
  device.createBindGroup({
    layout: renderOutputPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: sampler,
      },
      {
        binding: 1,
        resource: textureA.createView(),
      },
    ],
  }),
  device.createBindGroup({
    layout: renderOutputPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: sampler,
      },
      {
        binding: 1,
        resource: textureB.createView(),
      },
    ],
  }),
];

// Setup the compute pipeline
const computeShaderModule = device.createShaderModule({
  label: "Compute shader",
  code: computeWGSL
});

const computePipeline = device.createComputePipeline({
  label: "Compute pipeline",
  layout: 'auto',
  compute: {
    module: computeShaderModule,
    entryPoint: "compute_main",
  }
});

// Populate the GPU buffers from imported scene data
const vertexBuffer = device.createBuffer({
  label: "vertex buffer",
  size: scene.vertexArray.byteLength,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, scene.vertexArray);

const indexBuffer = device.createBuffer({
  label: "index buffer",
  size: scene.indexArray.byteLength,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(indexBuffer, 0, scene.indexArray);

const meshBuffer = device.createBuffer({
  label: "mesh buffer",
  size: scene.meshArray.byteLength,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(meshBuffer, 0, scene.meshArray);

const materialBuffer = device.createBuffer({
  label: "material buffer",
  size: scene.materialArray.byteLength,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(materialBuffer, 0, scene.materialArray);

// Compute shader uniforms
const computeUniformsArray = new Float32Array([100.0, 1.0, 0.0, 0.0]);
const computeUniformsBuffer = device.createBuffer({
  label: "Compute uniforms",
  size: computeUniformsArray.byteLength,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(computeUniformsBuffer, 0, computeUniformsArray);

// Two bind groups to accumulate compute passes
const computeBindGroup = [
  device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: textureA.createView(),
      },
      {
        binding: 1,
        resource: textureB.createView(),
      },
      {
        binding: 2,
        resource: { buffer: vertexBuffer },
      },
      {
        binding: 3,
        resource: { buffer: indexBuffer }
      },
      {
        binding: 4,
        resource: { buffer: meshBuffer }
      },
      {
        binding: 5,
        resource: { buffer: materialBuffer }
      },
      {
        binding: 6,
        resource: { buffer: computeUniformsBuffer },
      },
    ],
  }),
  device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: textureB.createView(),
      },
      {
        binding: 1,
        resource: textureA.createView(),
      },
      {
        binding: 2,
        resource: { buffer: vertexBuffer },
      },
      {
        binding: 3,
        resource: { buffer: indexBuffer }
      },
      {
        binding: 4,
        resource: { buffer: meshBuffer }
      },
      {
        binding: 5,
        resource: { buffer: materialBuffer }
      },
      {
        binding: 6,
        resource: { buffer: computeUniformsBuffer },
      },
    ],
  }),
]

let initialSeed = 100.0;
let step = 1;
let cameraAzimuth = 0.0;
let cameraElevation = 0.0;
let requestId;

const renderLoop = () => {

  if (step > 100) return; // stop passes after 100 steps

  const encoder = device.createCommandEncoder();

  // Do the compute 
  const computePass = encoder.beginComputePass();
  computePass.setPipeline(computePipeline);
  computePass.setBindGroup(0, computeBindGroup[step%2]);
  computePass.dispatchWorkgroups(64, 64);
  computePass.end();

  // Output render
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      loadOp: "clear",
      clearValue: { r: 0, g: 0, b: 0, a: 1 },
      storeOp: "store",
    }]
  });
  pass.setPipeline(renderOutputPipeline);
  pass.setBindGroup(0, renderOutputBindGroup[step%2]);
  pass.draw(6, 1);
  pass.end();

  // Update uniforms buffer
  initialSeed += 0.01;
  computeUniformsArray[0] = initialSeed;
  computeUniformsArray[1] = 1.0/++step;
  computeUniformsArray[2] = cameraAzimuth;
  computeUniformsArray[3] = cameraElevation;
  device.queue.writeBuffer(computeUniformsBuffer, 0, computeUniformsArray);

  // Submit the command buffer
  device.queue.submit([encoder.finish()]);

  requestId = requestAnimationFrame(renderLoop);
}

requestId = requestAnimationFrame(renderLoop);

// Camera orbit controls
addEventListener( 'pointerdown', () => {

  const onPointerMove = (e) => {
    cameraAzimuth += e.movementX * Math.PI/180;
    cameraElevation += e.movementY * Math.PI/180;

    // reset renderloop
    step = 0.0;    
    if(requestId) cancelAnimationFrame(requestId);
    requestId = requestAnimationFrame(renderLoop);
  }

  addEventListener('pointermove', onPointerMove);

  addEventListener('pointerup', () => {
    removeEventListener( 'pointermove', onPointerMove );
  });

});