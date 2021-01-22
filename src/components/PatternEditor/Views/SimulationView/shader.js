export const vertex = /* glsl */ `
    precision highp float;
    precision highp int;
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec3 color;
    attribute vec3 alpha;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vAlpha;
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vColor = color;
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 3.0;
    }
`;

export const fragment = /* glsl */ `
    precision highp float;
    precision highp int;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vAlpha;
    void main() {
        vec3 normal = normalize(vNormal);
        float lighting = dot(normal, normalize(vec3(0.2, 0.8, 0.6)));
        gl_FragColor.rgb = 0.1 + vec3(vColor.r, vColor.g, vColor.b) * 0.9 + lighting * 0.3;
        gl_FragColor.a = vAlpha[0];
    }
`;


//  + lighting * 0.05