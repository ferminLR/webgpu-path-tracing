@group(0) @binding(0) var outputTex : texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(1) var inputTex : texture_2d<f32>;
@group(0) @binding(2) var<storage> vertex: array<vec3f>;
@group(0) @binding(3) var<storage> index: array<vec3u>;
@group(0) @binding(4) var<storage> meshes: array<Mesh>;
@group(0) @binding(5) var<storage> materials: array<Material>;
@group(0) @binding(6) var<uniform> uniforms: Uniforms;

struct Mesh {
  vi : u32, // first vertex
  fi : u32, // first face
  nv : u32, // total vertices
  nf : u32, // total faces
}

struct Material {
  diffuse : vec4f,
  emission : vec4f
}

struct Ray {
  origin : vec3<f32>,
  direction : vec3<f32>,
}

struct HitRecord {
  hit : bool,
  point : vec3<f32>,
  normal : vec3<f32>,
  material : Material,
  t: f32,
}

struct Uniforms {
  seed: f32,
  weight: f32,
};

var<private> seed : f32;
var<private> pixel : vec2f;

fn random() -> f32 {
  let result = fract(sin(seed / 100.0 * dot(pixel, vec2(12.9898, 78.233))) * 43758.5453);
  seed += 1.0;
  return result;
}

fn v2random() -> vec2f {
  let r1 = random();
  let r2 = random();
  return vec2f(r1, r2);
}

fn random_in_unit_disk() -> vec2f {
  let r1 = random()*2.0-1.0;
  let r2 = random()*2.0-1.0;
  return vec2f(r1, r2);
}

fn random_in_unit_sphere() -> vec3f {
  let r1 = random()*2.0-1.0;
  let r2 = random()*2.0-1.0;
  let r3 = random()*2.0-1.0;
  return vec3f(r1, r2, r3);
}

fn mesh_random_point(mesh : Mesh, pdf : ptr<function, f32>) -> vec3f{
  // get a random triangle, should be weighted with the triangles areas!
  let trg = min(u32(f32(mesh.nf) * random()), mesh.nf-1) + mesh.fi;
  
  let vi = index[trg];
  let v0 = vertex[vi[0]];
  let v1 = vertex[vi[1]];
  let v2 = vertex[vi[2]];

  let u = random();
  let v = random();
  let w = 1.0 - u - v;

  // here we are again assuming all the triangles have the same area
  let trg_area = length(cross(v1 - v0, v2 - v0)) * 0.5;
  *pdf = 1.0/(f32(mesh.nf)*trg_area);

  return v0*u + v1*v + v2*w;
}

fn ray_at(r: Ray, t : f32) -> vec3<f32> {
  return r.origin + r.direction * t;
}

// Möller–Trumbore ray-triangle intersection algorithm
// from http://www.graphics.cornell.edu/pubs/1997/MT97.pdf
const EPSILON : f32 = 0.000001;
fn triangle_hit(r : Ray, v0 : vec3<f32>, v1: vec3<f32>, v2 : vec3<f32>, t : ptr<function, f32>) -> bool {
  
  let e1 = v1 - v0;
  let e2 = v2 - v0;
  let p = cross(r.direction, e2);
  let det = dot(e1, p); 

  // check if ray is parallel to triangle
  if (abs(det) < EPSILON) { return false; }

  // calculate barycentric coordinate u
  let inv_det = 1.0 / det;
  let s = r.origin - v0; // called T in paper, not used here to avoid confusion with *t
  let u = inv_det * dot(s, p);

  if (u < 0.0 || u > 1.0) { return false; }

  // calculate barycentric coordinate v
  let q = cross(s, e1);
  let v = inv_det * dot(r.direction, q);

  if (v < 0.0 || u + v > 1.0) { return false; }

  // distance from the ray origin to the hit point
  *t = inv_det * dot(e2, q);
  if (*t < EPSILON) { return false; }

  return true;
}

fn world_hit(r : Ray) -> HitRecord {

  var hit_rec : HitRecord;
  hit_rec.hit = false;
  var t = 100000000.0;
  var closest_hit = t;

  // loop through all the meshes in the scene
  for(var m = 0; m < 6; m++){

    let mesh = meshes[m];
    // loop through all the triangles in each mesh
    for(var i = mesh.fi; i < mesh.fi+mesh.nf; i++){

      let vi = index[i];
      let v0 = vertex[vi[0]];
      let v1 = vertex[vi[1]];
      let v2 = vertex[vi[2]];
      let hit_bool = triangle_hit(r, v0, v1, v2, &t);

      // we have to return the closest hit to the ray origin
      if(hit_bool && t < closest_hit) {
        closest_hit = t;
        hit_rec.hit = true;
        hit_rec.t = t;
        hit_rec.normal = normalize(cross(v1 - v0, v2 - v0));
        hit_rec.point = ray_at(r, t) + hit_rec.normal*EPSILON;
        hit_rec.material = materials[m];
      }
    }
  }
  
  return hit_rec;
}

fn ray_color(r : Ray) -> vec3f {

  var depth = 0;
  var color = vec3(0.0, 0.0, 0.0); // background color
  var ray = r;
  var hit_result = world_hit(ray);

  // recursion is not allowed
  while(depth < 5 && (hit_result.hit)){

    // if the first hit is a emissive material, return it directly
    if(depth == 0 && hit_result.material.emission.a > 0.0){
      return hit_result.material.emission.rgb;
    }

    let hit_point = hit_result.point;

    //scatter
    if(hit_result.material.emission.a == 0.0){

      // bias towards lights
      var light_pdf = 1.0;
      let light_point = mesh_random_point(meshes[3], &light_pdf);
      let lh = light_point - hit_point;

      var shadow_ray : Ray;
      shadow_ray.origin = hit_point;
      shadow_ray.direction = normalize(lh);

      var shadow_hit = world_hit(shadow_ray);

      if(shadow_hit.material.emission.a > 0.0){
        color += light_pdf * hit_result.material.diffuse.rgb
              * shadow_hit.material.emission.rgb 
              * abs(dot(hit_result.normal, shadow_ray.direction));
      }
    }

    ray.origin = hit_point;
    ray.direction = normalize(hit_result.normal + random_in_unit_sphere());

    depth++;
    hit_result = world_hit(ray);
  }

  // protection against NaN
  if (depth==0) { return vec3(0.0, 0.0, 0.0); }
  
  return color/f32(depth);
}

@compute @workgroup_size(8, 8, 1)
fn compute_main(@builtin(global_invocation_id) GlobalInvocationID: vec3u) {

  // set the private vars
  let pos = GlobalInvocationID.xy;
  pixel = vec2f(pos)/512.0;
  seed = uniforms.seed; // initial seed

  // setup camera
  var ray : Ray;
  let camera_center = vec3(0.0, 0.0, 3.5);
  var color = vec4(0.0, 0.0, 0.0, 1.0);
  var passes = 5;
  let camera_disk = 0.00001*random_in_unit_disk(); // camera aperture
  ray.origin = camera_center + vec3(camera_disk, 0.0);

  // repeat each pixel "passes" times
  for(var i=0; i<passes; i++){
    let pos_norm = (vec2f(pos)+v2random())/256.0 - 1.0;
    let pos_in_camera_plane = vec3(ray.origin.xy + pos_norm*0.05, ray.origin.z - 0.1);
    ray.direction = normalize(pos_in_camera_plane - ray.origin);
    color += vec4(ray_color(ray), 1.0);
  }

  // weighted average between the new and the accumulated image
  let newImage = color/f32(passes);
  let accumulated = textureLoad(inputTex, pos, 0);
  let resultColor = uniforms.weight * newImage
                  + (1.0 - uniforms.weight) * accumulated;
  
  textureStore(outputTex, pos, resultColor);
}
