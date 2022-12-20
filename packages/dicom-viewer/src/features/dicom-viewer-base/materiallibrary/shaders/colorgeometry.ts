export const vert = `
  varying vec3 v_normal;
  void main()
  {
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
  uniform vec3 u_color;
  varying vec3 v_normal;
  vec3 applyLight(vec3 surfaceToLight, vec3 surfaceColor, vec3 surfaceNormal) {

    //diffuse
    float diffuseCoef = max(0.0, dot(surfaceNormal, surfaceToLight));
    vec3 diffuse =  diffuseCoef * surfaceColor.rgb;

    return diffuse;
  }
  void main()
  {
    vec3 L = normalize(directionalLights[0].direction);
    vec3 color = applyLight(L, u_color.rgb, v_normal);
    gl_FragColor = vec4(color, 1.0);
  }
`;
