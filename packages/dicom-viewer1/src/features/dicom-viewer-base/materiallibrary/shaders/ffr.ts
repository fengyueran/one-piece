import { CustomShader } from './custom';

export const customVert: CustomShader = (content) => `
attribute float a_FFR;
varying vec3 v_normal;
varying vec4 v_color;
uniform sampler2D u_texture;
uniform float u_alpha;
void main()
{
  v_normal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  v_color = texture2D(u_texture, vec2(a_FFR, 0.5));
  v_color.a = u_alpha;
  ${content.post}
}
`;

export const customFrag: CustomShader = (content) => `
#if NUM_DIR_LIGHTS > 0
struct DirectionalLight {
   vec3 direction;
   vec3 color;
   };
   uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif
  varying vec4 v_color;
  varying vec3 v_normal;

  vec3 applyLight(vec3 surfaceToLight, vec3 surfaceColor, vec3 surfaceNormal) {
    float diffuseCoef = max(0.0, dot(surfaceNormal, surfaceToLight));
    vec3 diffuse =  diffuseCoef * surfaceColor.rgb;
    return diffuse;
  }
  void main()
  {
    vec3 L = normalize(directionalLights[0].direction);
    vec3 color = applyLight(L, v_color.rgb, v_normal);
    gl_FragColor = vec4(color, v_color.a);
    ${content.post}
  }
`;

export const vert = customVert({ post: '' });

export const frag = customFrag({ post: '' });
