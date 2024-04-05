#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

mat2 rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

vec3 palette(float t){
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b*cos(6.28318 * (c * t + d));
}

void main(){
    vec2 coord = (gl_FragCoord.xy / u_resolution - 0.5) * rotate(u_time);
    vec3 color = vec3(0.0);

    coord = fract(coord * 2.0 - 0.5);
    coord *= rotate(-u_time * 1.0);

    color.rg = coord;

    fragColor = vec4(color, 1.0);
}