#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main(){

    vec3 colorA = vec3(0.149, 0.141, 0.912);
    vec3 colorB = vec3(1.0, 0.833, 0.224);

    vec3 color = vec3(0.0);

    float pct = abs(sin(u_time));

    color = mix(colorA, colorB, pct);

    fragColor = vec4(color, 1.0);
}