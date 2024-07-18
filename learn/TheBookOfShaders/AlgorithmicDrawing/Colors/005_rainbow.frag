#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


vec2 AspectRatio(){
    return (2.0 * gl_FragCoord.xy - u_resolution) / (2.0 * u_resolution.y);
}


float Band(float axis, float start, float end, float blur){
    float step1 = smoothstep(start - blur, start + blur, axis);
    float step2 = smoothstep(end + blur, end - blur, axis);

    return step1 * step2;
}


float Circle(vec2 coord, vec2 position, float radius, float blur){
    float d = length(coord - position);
    float c = smoothstep(radius, radius - blur, d);

    return c;
}


void main(){
    vec2 coord = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    //coord.x = fract(u_time/2.0);
    //coord.x = (sin(u_time) + 1.0) / 2.0;

    color = vec3(Band(coord.x, 0.0, 0.2, 0.2), 0.0, 0.0);
    color += vec3(Band(coord.x, 0.2, 0.2 * 2.0, 0.1), Band(coord.x, 0.2, 0.2 * 2.0, 0.2), 0.0);
    color += vec3(0.0, Band(coord.x, 0.2 * 2.0, 0.2 * 3.0, 0.2), 0.0);
    color += vec3(0.0, 0.0, Band(coord.x, 0.2 * 3.0, 0.2 * 4.0, 0.2));
    color += vec3(Band(coord.x, 0.2 * 4.0, 0.2 * 5.0, 0.2), 0.0, Band(coord.x, 0.2 * 4.0, 0.2 * 5.0, 0.2));

    fragColor = vec4(color, coord.y);
}