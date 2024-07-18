#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float band(float axis, float start, float end, float blur){
    float step1 = smoothstep(start - blur, start + blur, axis);
    float step2 = smoothstep(end + blur, end - blur, axis);

    return step1 * step2;
}

float rect(vec2 coord, vec2 position, float width, float height, float blur){
    float band1 = band(coord.x, position.x - width / 2.0, position.x + width / 2.0, blur);
    float band2 = band(coord.y, position.y - height / 2.0, position.y + height / 2.0, blur);

    return band1 * band2;
}

vec3 palette(float t){
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b*cos(6.28318 * (c * t + d));
}

float remap01(float a, float b, float t){
    return (t - a) / (b - a);
}

float remap(float a, float b, float c, float d, float t){
    return remap01 (a, b, t) * (d - c) + c;
}

void main(){
    vec3 color = vec3(0.0);

    vec2 coord = ((gl_FragCoord.xy / u_resolution) - 0.5);
    coord.x *= u_resolution.x / u_resolution.y;

    float mask = 0.0;

    float m = sin(coord.x * 8.0 + u_time)/8.;

    coord.y -= m;

    float blur = remap(-.5, .5, 0.01, 0.25, coord.x);
    blur = pow(blur, 0.7);

    mask = rect(coord, vec2(0.0), 1.0, 0.2, blur);
    color = vec3(0.5 + palette(coord.x * 0.5 + u_time * 0.1)) * mask;

    fragColor = vec4(color, 1.0);
}