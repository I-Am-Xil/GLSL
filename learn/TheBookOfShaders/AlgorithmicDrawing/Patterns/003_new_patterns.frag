#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

const float PI = 3.14159265359;


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

mat2 Rotate2D(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}

mat2 Scale(vec2 scale){
    return mat2(scale.x, 0.0,
                0.0, scale.y);
}

float Circle(vec2 uv, float scale, float blur){
    return smoothstep(scale + blur, scale - blur, length(uv));
}

float Circunference(vec2 uv, float scale, float thickness, float blur){
    float circunference = Circle(uv, scale, blur);
    circunference -= Circle(uv, scale - thickness, blur);
    return circunference;
}

void main(){
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
    vec2 uv0 = uv;
    vec3 color = vec3(1.0);
    uv = fract(uv*6);

    color -= vec3(RectanglePerimeter(uv-0.5, vec2(0.53), 0.05, vec4(0.01)));

    for(int i = 0; i <= 1; i++){
        for(int j = 0; j <= 1; j++){
            color -= vec3(RectanglePerimeter((uv - vec2(float(i), float(j))) * Rotate2D(PI/4), vec2(0.15), 0.025, vec4(0.01)));
            color += vec3(Rectangle((uv - vec2(float(i), float(j))) * Rotate2D(PI/4), vec2(0.125), vec4(0.01)));
        }
    }

    fragColor = vec4(color, 1.0);
}
