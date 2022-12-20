const vert = `
  varying vec2 v_uv;

  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const frag = `
uniform sampler2D u_texture;
uniform sampler2D u_labelcolor;
uniform float u_opacity;

varying vec2 v_uv;

void main() {
  vec4 mask = texture2D(u_texture, v_uv);
  vec4 color = texture2D(u_labelcolor, vec2(mask.r, 1.0));
  gl_FragColor = vec4(color.r, color.g, color.b, u_opacity * color.a);
}
`;

export { vert, frag };
