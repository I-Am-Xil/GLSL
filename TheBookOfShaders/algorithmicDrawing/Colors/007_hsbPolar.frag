#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

const float PI = 3.14159265359;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


vec3 hsb2rgb(vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}


void main(){
    vec2 coord = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    vec2 toCenter = vec2(0.5)-coord;
    float angle = atan(toCenter.y, toCenter.x);
    float radius = length(toCenter) * 2.0;

    color = hsb2rgb(vec3(angle/(PI*2.0)+0.5, radius, 1.0));

    fragColor = vec4(color, 1.0);
}