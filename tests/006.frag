#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


const float PI = 3.14159265359;


vec2 AspectRatio(vec2 screen){
    return (2.0 * screen - u_resolution) / (2.0 * u_resolution.y);
}


vec3 hsb2rgb(vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}


void main(){
    vec2 coord = 5.0 * AspectRatio(gl_FragCoord.xy);
    vec3 color = vec3(0.0);

    vec2 polar_coord = vec2(length(coord), atan(coord.y, coord.x));

    color = vec3(1.0 - smoothstep(1+cos(polar_coord.y), 1+cos(polar_coord.y) + 0.1, polar_coord.x));
    //color = vec3(1.0 - smoothstep(1+cos(polar_coord.y) * sin(u_time), 1+cos(polar_coord.y) * sin(u_time) + 0.05, polar_coord.x));
    //color = vec3(1.0 - smoothstep(1+cos(polar_coord.y) * sin(u_time), (1+cos(polar_coord.y) + 0.1) * tan(u_time), polar_coord.x));
    //color *= hsb2rgb(vec3(1.0 - smoothstep(1+cos(polar_coord.y) * sin(u_time), (1+cos(polar_coord.y) + 0.1) * tan(u_time), polar_coord.x), polar_coord.x, 1.0));

    fragColor = vec4(color, 1.0);
}