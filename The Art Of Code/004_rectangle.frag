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
    float band1 = band(coord.x, position.x - width, position.x + width, blur);
    float band2 = band(coord.y, position.y - height, position.y + height, blur);

    return band1 * band2;
}

void main(){
    vec3 color = vec3(0.0);

    vec2 coord = ((gl_FragCoord.xy / u_resolution) - 0.5);
    coord.x *= u_resolution.x / u_resolution.y;

    float mask = 0.0;

    mask = rect(coord, vec2(0.0), 0.3, 0.1, 0.01);

    color = vec3(1.0) * mask;

    fragColor = vec4(color, 1.0);
}