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

mat2 rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main(){
    vec2 coord = 1.0 * (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;

    //Creates copies
    coord = 20.0 * (fract(coord * 1.5 - 0.5) - 0.5);

    vec3 color = vec3(0.0);

    float size = 20.0;
    float brightness = 0.1;
    float shrink_speed = 10.0;
    float rotation_speed = 2.0;

    coord *= rotate(u_time * rotation_speed);

    color += coord.x * (vec3(1.0 - size * sin(length(coord) + u_time * shrink_speed)) * brightness + palette(u_time));
    


    fragColor = vec4(color, 1.0);
}