#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


vec3 NormalizeRGB(vec3 color){
    return color / 255.0;
}


float Circle(vec2 coord, vec2 position, float radius, float blur){
    float d = length(coord - position);
    float c = smoothstep(radius, radius - blur, d);

    return c;
}


vec2 AspectRatio(){
    return (2.0 * gl_FragCoord.xy - u_resolution) / (2.0 * u_resolution.y);
}


void main(){
    vec2 coord = 3.0 * (AspectRatio() + 0.5);
    vec3 color = vec3(0.0);

    float white_stripe = smoothstep(0.8, 0.85, sin(coord.y));
    float blue_stripe = smoothstep(0.85, 0.845, sin(coord.y));

    color = mix(color, vec3(1.0), white_stripe);
    color = mix(color, NormalizeRGB(vec3(108.0, 172.0, 228.0)), blue_stripe);
    color = mix(color, NormalizeRGB(vec3(255.0, 184.0, 28.0)), Circle(coord, vec2(1.5, 1.57), 0.5, 0.01));

    fragColor = vec4(color, 1.0);
}