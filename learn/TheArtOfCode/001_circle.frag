#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main(){
    vec3 color = vec3(0.0);

    vec2 coord = gl_FragCoord.xy / u_resolution - 0.5;
    coord.x *= u_resolution.x / u_resolution.y;

    float d = length(coord);
    float radius = 0.3;
    color = vec3(smoothstep(radius, radius - 0.02, d));

    fragColor = vec4(color, 1.0);
}