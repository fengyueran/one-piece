const vert = `
  varying vec2 v_uv;

  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const frag = `
  precision highp float;
  precision highp int;
  precision highp sampler2D;

  uniform sampler2D u_texture;
  uniform float u_windowbegin;
  uniform float u_windowwidth;
  uniform vec3 u_color;

  varying vec2 v_uv;

  void main() {
    vec4 color = texture2D(u_texture, v_uv);

    float intensity = float(color.r) * 65536.0 - 65536.0 / 2.0;

    float normalVal = clamp((intensity - u_windowbegin) / u_windowwidth, 0.0, 1.0);

    gl_FragColor = vec4(u_color * normalVal / 255.0, 1.0);
  }
`;

export { vert, frag };
