#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


const float PI = 3.14159265359;


float Plot(vec2 coord, float plot){
    return smoothstep(plot - 0.02, plot, coord.y) - smoothstep(plot, plot + 0.02, coord.y);
}


void main(){
    vec2 coord = 5.0 * (gl_FragCoord.xy / u_resolution - 0.5);

    float y = mod(coord.x, 0.5);

    vec3 color = vec3(y);

    float plot = Plot(coord, y);
    color = (1.0 - plot) * color + plot * vec3(0.0, 1.0, 0.0);

    fragColor = vec4(color, 1.0);
}