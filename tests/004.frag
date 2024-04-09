#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


const float PI = 3.14159265359;


vec2 AspectRatio(){
    return (2.0 * gl_FragCoord.xy - u_resolution) / (2.0 * u_resolution.y);
}


float Polygon(vec2 position, float radius, float sides){
    float angle = atan(position.x, position.y);
    float slice = PI * 2.0 / sides;
    return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * length(position));
}

float Circle(vec2 coord, vec2 position, float radius, float blur){
    float d = length(coord - position);
    float c = smoothstep(radius, radius - blur, d);

    return c;
}

float PolygonShape(vec2 coord, vec2 position, float radius, float sides, float blur){
    coord += position;
    float angle = atan(coord.x, coord.y);
    float slice = PI * 2.0 / sides;
    return smoothstep(radius,  radius - blur, cos(floor(0.5 + angle / slice) * slice - angle) * length(coord));
}

mat2 Rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}


vec3 Palette(float t){
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b*cos(6.28318 * (c * t + d));
}

void main(){
    vec2 coord = 5.0 * AspectRatio();
    vec3 color = vec3(0.0);

    color = vec3(PolygonShape(coord * Rotate(u_time), vec2(0.0, 0.0) * Rotate(u_time), 0.5, 5.0, 0.2));


    fragColor = vec4(color, 1.0);
}