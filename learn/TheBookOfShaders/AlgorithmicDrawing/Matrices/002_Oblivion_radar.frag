#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main(){
    vec2 uv = gl_FragCoord.xy;
    vec3 color = vec3(0.0);

    fragColor = vec4(color, 1.0);
}
