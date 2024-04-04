#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec3 palette(float t){
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b*cos(6.28318 * (c * t + d));
}

void main(){
    vec3 final_color = vec3(0.0);
    vec2 coord = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
    vec2 coord0 = coord;
    
    for(float i = 0.0; i < 4.0; i++){
        coord = fract(coord * 1.5) - 0.5;

        float len = length(coord) * exp(-length(coord0));
        vec3 color = palette(length(coord0) + i*0.5 + u_time);

        len = pow(0.01 / abs(sin(len * 8.0 + u_time) / 8.0), 1.2);

        final_color += color * len;

    }

    fragColor = vec4(final_color, 1.0);
}