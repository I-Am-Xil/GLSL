#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

const float PI = 3.14159265359;

vec3 hsb2rgb(vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(){
    vec2 coord = 2.0 * (gl_FragCoord.xy/u_resolution - 0.5);
    vec3 color = vec3(0.0);


    vec2 polarcoord = vec2(length(coord), atan(coord.y, coord.x));

    color = hsb2rgb(vec3((polarcoord.y + sin(u_time))/(PI * sin(u_time)), polarcoord.x, 1.0));

    fragColor = vec4(color, 1.0);
}