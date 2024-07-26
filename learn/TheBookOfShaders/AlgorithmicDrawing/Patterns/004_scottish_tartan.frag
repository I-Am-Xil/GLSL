#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

const float PI = 3.14159265359;

mat2 Rotate2D(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}

mat2 Scale(vec2 scale){
    return mat2(scale.x, 0.0,
                0.0, scale.y);
}

float Band(float scale, vec2 blur, float axis){
    axis += 0.5;
    scale += 0.5;
    float s1 = smoothstep(scale + blur.x, scale - blur.x, axis);
    float s2 = smoothstep(scale + blur.y, scale - blur.y, 1.-axis);
    return s1*s2;
}

float Rectangle(vec2 uv, vec2 scale, vec4 blur){
    float xBand = Band(scale.x, blur.xz, uv.x);
    float yBand = Band(scale.y, blur.yw, uv.y);
    return xBand * yBand;
}

float RectanglePerimeter(vec2 uv, vec2 scale, float thickness, vec4 blur){
    float rect = Rectangle(uv, scale, blur);
    rect -= Rectangle(uv, scale - vec2(thickness), blur);
    return rect;
}

void main(){
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
    vec3 color = vec3(0.5);
    vec2 uv0 = uv;

    uv = fract(uv);


    color -= vec3(Band(0.05, vec2(0.003), uv.x-0.3));
    color -= vec3(Band(0.05, vec2(0.003), uv.x-0.5));
    color -= vec3(Band(0.05, vec2(0.003), uv.x-0.7));

    color -= vec3(Band(0.05, vec2(0.003), uv.y-0.3));
    color -= vec3(Band(0.05, vec2(0.003), uv.y-0.5));
    color -= vec3(Band(0.05, vec2(0.003), uv.y-0.7));

    color += vec3(Band(0.05, vec2(0.003), uv.y-0.4));
    color += vec3(Band(0.05, vec2(0.003), uv.y-0.6));

    color += vec3(Band(0.05, vec2(0.003), uv.x-0.4));
    color += vec3(Band(0.05, vec2(0.003), uv.x-0.6));

    color.r = max(color.r, 2.*RectanglePerimeter(uv-0.5, vec2(0.5), 0.02, vec4(0.001)));










    fragColor = vec4(color, 1.0);
}
