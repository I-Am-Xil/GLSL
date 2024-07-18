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
    return smoothstep(plot - 0.01, plot, coord.y) - smoothstep(plot, plot + 0.01, coord.y);
}


void main(){
    vec3 colorA = vec3(0.149, 0.141, 0.912);
    vec3 colorB = vec3(1.0, 0.833, 0.224);


    vec2 coord = (gl_FragCoord.xy / u_resolution);
    vec3 color = vec3(0.0);

    vec3 pct = vec3(coord.x);

    //pct.r = smoothstep(0.0, 1.0, coord.x);
    //pct.g = sin(coord.x * PI);
    //pct.b = pow(coord.x, 0.5);

    color = mix(colorA, colorB, pct);

    color = mix(color, vec3(1.0, vec2(0.0)), Plot(coord, pct.r));
    color = mix(color, vec3(0.0, 1.0, 0.0), Plot(coord, pct.g));
    color = mix(color, vec3(vec2(0.0), 1.0), Plot(coord, pct.b));

    fragColor = vec4(color, 1.0);
}