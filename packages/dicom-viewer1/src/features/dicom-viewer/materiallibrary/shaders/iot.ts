import { CustomShader } from './custom';

const vertQuad = `
  varying vec2 v_uv;

  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const createFragAccumulation = (customShader: CustomShader): string =>
  customShader({
    post: `
    float ai = gl_FragColor.a;
    float z = (gl_FragCoord.z - 0.5) / 0.5;
    float wzi = pow(ai + 0.01, 4.0) + max(1e-2, min(3.0 * 1e3, 0.003 / (1e-5 + pow(abs(z) / 200.0, 4.0))));
    vec3 Ci = gl_FragColor.xyz * ai;
    gl_FragColor = vec4( Ci, ai ) * wzi;
  `,
  });

const fragmentRevealage = `
  varying vec4 v_color;

  void main()
  {
    gl_FragColor = vec4( v_color.a );
  }
`;

const fragmentCompositing = `
  varying vec2 v_uv;

  uniform sampler2D u_accumulation;
  uniform sampler2D u_revealage;

  void main()
  {
    vec4 accum = texture2D( u_accumulation, v_uv );
    float r = texture2D( u_revealage, v_uv ).r;

    vec4 transparent = vec4(accum.rgb / clamp(accum.a, 1e-4, 5e4), r);

    gl_FragColor = (1.0 - transparent.a) * transparent + vec4(transparent.a);
  }
`;

export { vertQuad, createFragAccumulation, fragmentRevealage, fragmentCompositing };
