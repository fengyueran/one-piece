export const vertexShader = `
  attribute float a_FFR;
  varying float v_FFR;
  varying vec3 v_Normal;
  void main()
  {
    v_FFR = a_FFR;
    v_Normal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  varying float v_FFR;
  varying vec3 v_Normal;
  uniform sampler2D u_Texture;
  uniform float u_Aval;
  vec3 applyLight(vec3 surfaceToLight, vec3 surfaceColor, vec3 surfaceNormal) {
    //ambient
    vec3 ambient = 0.2  * surfaceColor.rgb;

    //diffuse
    float diffuseCoef = max(0.0, dot(surfaceNormal, surfaceToLight));
    vec3 diffuse =  diffuseCoef * surfaceColor.rgb;

    //linear color (color before gamma correction)
    return ambient + diffuse;
  }
  void main()
  {
    // vec3 test = vec3(u_Aval);
    // test = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, .0), v_FFR);
    vec4 texColor = texture2D(u_Texture, vec2(v_FFR, 0.5));
    vec3 L = normalize(cameraPosition);
    vec3 color = applyLight(L, texColor.rgb, v_Normal);
    gl_FragColor = vec4(color.rgb, 1.0);
  }
`;
