export const vert = `
  varying vec3 v_normal;

  attribute vec4 color;
  varying vec4 v_color;
  uniform float u_alpha;

  void main()
  {
    v_color = color / 255.0;
    v_color.a = u_alpha;
    v_normal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const frag = `
#if NUM_DIR_LIGHTS > 0
struct DirectionalLight {
   vec3 direction;
   vec3 color;
   };
   uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif
  varying vec3 v_normal;
  uniform sampler2D u_texture;
  varying vec4 v_color;
  vec3 applyLight(vec3 surfaceToLight, vec3 surfaceColor, vec3 surfaceNormal) {

    //diffuse
    float diffuseCoef = max(0.0, dot(surfaceNormal, surfaceToLight));
    vec3 diffuse =  diffuseCoef * surfaceColor.rgb;

    return diffuse;
  }
  void main()
  {
    vec4 texColor = v_color;
    vec3 L = normalize(directionalLights[0].direction);
    vec3 color = applyLight(L, texColor.rgb, v_normal);
    gl_FragColor = vec4(color, texColor.a);
  }
`;
