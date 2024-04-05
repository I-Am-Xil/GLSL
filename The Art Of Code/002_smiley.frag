#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float Circle_shape(vec2 coord, vec2 position, float radius, float blur){
    float d = length(coord - position);
    float c = smoothstep(radius, radius - blur, d);
    
    return c;
}

void main(){
    vec3 color = vec3(0.0);

    vec2 coord = gl_FragCoord.xy / u_resolution - 0.5;
    coord.x *= u_resolution.x / u_resolution.y;

    float radius = 0.4;
    vec2 position = vec2(0.2, -0.1);

    float mask = Circle_shape(coord, position, radius, 0.05);

    radius = 0.065;
    position = vec2(0.05, 0.05);
    mask -= Circle_shape(coord, position, radius, 0.01);

    radius = 0.065;
    position = vec2(0.35, 0.05);
    mask -= Circle_shape(coord, position, radius, 0.01);

    radius = 0.192;
    position = vec2(0.2, -0.20);
    float mouth = Circle_shape(coord, position, radius, 0.01);

    radius = 0.192;
    position = vec2(0.2, -0.15);
    mouth -= Circle_shape(coord, position, radius, 0.01);

    mask -= mouth;

    color = vec3(1.0, 1.0, 0.0) * mask;

    fragColor = vec4(color, 1.0);
}