export const vertexShader = `
    varying float vDot;
    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
        vec3 toCamera = normalize(cameraPosition - worldPosition.xyz);
        vDot = max(dot(worldNormal, toCamera), 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const fragmentShader = `
    uniform vec3 uColor;
    varying float vDot;
    void main() {
        vec3 color = mix(vec3(0.0, 0.0, 0.0), uColor, vDot);
        gl_FragColor = vec4(color, 1.0);
    }
`;
