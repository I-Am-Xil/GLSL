#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


float Circle(vec2 uv, float scale, float blur, vec2 offset){
    uv = 2*uv + offset;
    return smoothstep(scale + blur, scale - blur, length(1.0 - uv));
}

void main(){
    vec2 coord = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(1.0);

    //Stretch
    //color = vec3(smoothstep(0.3, 0.2, length(.5 - coord) + length(.65 - coord)));

    //Scale
    //color = vec3(smoothstep(0.3, 0.2, length(.5 - coord) * length(.05 - coord)));

    //Union
    //color = vec3(smoothstep(0.3, 0.2, min(length(.8 - coord), length(.15 - coord))));

    //Interseccion
    //color = vec3(smoothstep(0.3, 0.2, max(length(.2 - coord), length(.4 - coord))));

    //Ni idea
    //color = vec3(smoothstep(0.3, 0.2, pow(length(.4 - coord), length(.6 - coord))));


    //color = vec3(Circle(coord, .5, 0.1, vec2(0.0)));

    fragColor = vec4(color, 1.0);
}
