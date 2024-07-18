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

float Smiley(vec2 coord, vec2 position, float size){

    coord -= position;
    coord /= size;

    float mask = Circle_shape(coord, vec2(0.0), 0.4, 0.01);

    mask -= Circle_shape(coord, vec2(-0.15, 0.15), 0.065, 0.01);
    mask -= Circle_shape(coord, vec2(0.15, 0.15), 0.065, 0.01);

    float mouth = Circle_shape(coord, vec2(0.0, -0.1), 0.192, 0.01);
    mouth -= Circle_shape(coord, vec2(0.0, -0.05), 0.192, 0.01);

    mask -= mouth;

    return mask;
}

mat2 rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main(){
    vec3 color = vec3(0.0);

    vec2 coord = ((gl_FragCoord.xy / u_resolution) - 0.5);
    coord.x *= u_resolution.x / u_resolution.y;

    color = vec3(1.0, 1.0, 0.0) * Smiley(coord, vec2(0.0), 1.0);

    fragColor = vec4(color, 1.0);
}