#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float Plot(vec2 coord){
    return smoothstep(0.02, 0.0, abs(coord.y - coord.x));
}


void main(){
    vec2 coord = gl_FragCoord.xy / u_resolution;

    float y = coord.x;

    vec3 color = vec3(y);

    float plot = Plot(coord);

    color = (1.0 - plot) * color + plot * vec3(0.0, 1.0, 0.0);

    fragColor = vec4(color, 1.0);
}