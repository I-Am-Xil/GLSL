#version 460
#ifdef GL
precision mediump float;
#endif

const float PI = 3.14159265359;

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main(){
    vec2 coord = gl_FragCoord.xy/u_resolution;
    coord.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);
    float d = 0.;

    coord = coord*2.-1;

    int N = 3;

    float a = atan(coord.x, coord.y)+PI;
    float r = (PI*2)/float(N);

    d = cos(floor(.5+a/r)*r-a)*length(coord);

    color = vec3(1.-smoothstep(.4, .41, d));



    fragColor = vec4(color, 1.0);
}
