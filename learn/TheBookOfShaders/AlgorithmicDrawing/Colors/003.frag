#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;


vec3 rgb2hsb(vec3 color){
    return vec3(1.0);
}


vec3 hsb2rgb(vec3 color){
    return vec3(1.0);
}


void main(){
    vec2 coord = gl_FragCoord.xy;
    vec3 color = vec3(0.0);

    //We map x(0.0 - 1.0) to the hue (0.0 - 1.0)
    //And the y(0.0 - 1.0) to the brightness
    color = hsb2rgb(vec3(coord.x, 1.0, coord.y));

    fragColor = vec4(color, 1.0);
}