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

float Polygon(vec2 coord, vec2 position, float radius, float sides, float blur){
    coord += position;
    float angle = atan(coord.x, coord.y);
    float slice = PI * 2.0 / sides;
    return smoothstep(radius,  radius - blur, cos(floor(0.5 + angle / slice) * slice - angle) * length(coord));
}

vec3 Palette(float t){
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(1.0, 1.0, 1.0);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.333, 0.667);

    return a + b*cos(6.28318 * (c * t + d));
}

mat2 Rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main(){
    vec2 coord = 2.0 * AspectRatio();
    vec3 color = vec3(0.0);

    coord *= Rotate(u_time);

    color = Palette(fract(-length(Polygon(coord, vec2(0.0), 0.5, 5.0, 1.0)) + u_time));
    color *= vec3(Polygon(coord, vec2(0.0), 0.5, 5.0, 0.05));
    color += Palette(fract(-length(Polygon(coord, vec2(0.0), 0.5, 5.0, -1.0)) + u_time)) * vec3(Polygon(coord, vec2(0.0), 0.5, 5.0, -.5));



    fragColor = vec4(color, 1.0);
}