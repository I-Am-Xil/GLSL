#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main(){
    vec2 coord = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    vec2 bottom_left = step(0.1, coord);
    vec2 top_right = step(0.1, 1.0-coord);

    color = vec3(bottom_left.x * bottom_left.y * top_right.x * top_right.y);

    fragColor = vec4(color, 1.0);
}