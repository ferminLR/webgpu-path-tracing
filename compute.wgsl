@group(0) @binding(0) var outputTex : texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(8, 8, 1)
fn compute_main(@builtin(global_invocation_id) GlobalInvocationID: vec3u) {
    let pos = GlobalInvocationID.xy;
    textureStore(outputTex, pos, vec4(vec2f(pos)/512.0, 0.5, 1.0));
}
