#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

const float PI = 3.14159265359;


float Band(float scale, vec2 blur, float offset, float axis){
    scale += 1.0;
    axis += offset/2;
    float s1 = smoothstep((scale + blur.x)/2, (scale - blur.x)/2, axis);
    float s2 = smoothstep((scale + blur.y)/2, (scale - blur.y)/2, 1.-axis);
    return s1*s2;
}

float Rectangle(vec2 uv, vec2 scale, vec4 blur, vec2 offset){
    float xBand = Band(scale.x, blur.xz, offset.x, uv.x);
    float yBand = Band(scale.y, blur.yw, offset.y, uv.y);
    return xBand * yBand;
}

float Cross(vec2 uv, vec2 scale, float blur, vec2 offset){
    float rect1 = Rectangle(uv, vec2(scale.x, scale.y), vec4(blur), offset);
    float rect2 = Rectangle(uv, vec2(scale.y, scale.x), vec4(blur), offset);
    return max(rect1, rect2);
}

float Circle(vec2 uv, float scale, float blur, vec2 offset){
    uv += offset;
    return smoothstep(scale + blur, scale - blur, length(uv));
}

float Circunference(vec2 uv, vec2 offset, float scale, float thickness, float blur){
    float circunference = Circle(uv, scale, blur, vec2(offset));
    circunference -= Circle(uv, scale - thickness, blur, vec2(offset));
    return circunference;
}

mat2 Rotate2D(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}

vec2 Tile(vec2 uv, float subdiv){
    uv *= subdiv;
    return fract(uv);
}



void main(){
    vec2 uv = (3.*gl_FragCoord.xy - u_resolution) / u_resolution.y;
    vec3 color = vec3(0.0);

    //color.rg += fract(uv);
    //color += vec3(Rectangle(uv, vec2(3./3.), vec4(0.1), vec2(0.0)));

    color += vec3(Circunference(uv, vec2(0.5), 0.4, 0.07, 0.01))*step(0.1, (tan(u_time/2.)+1.)/2.);
    color += vec3(Circunference(uv, vec2(-1.5, -1.5), 0.4, 0.07, 0.01))*step(0.3, (tan(u_time/2.)+1.)/2.);
    color += vec3(Circunference(uv, vec2(0.5, -1.5), 0.4, 0.07, 0.01))*step(0.5, (tan(u_time/2.)+1.)/2.);
    color += vec3(Circunference(uv, vec2(0.5, -0.5), 0.4, 0.07, 0.01))*step(0.7, (tan(u_time/2.)+1.)/2.);

    vec2 cross_uv = uv*Rotate2D(1.*PI/4.);

    color += vec3(Cross(cross_uv, vec2(0.9, 0.07), 0.01, vec2(1.0, -0.4)))*step(0.4, (tan(u_time/2.)+1.)/2.);
    color += vec3(Cross(cross_uv, vec2(0.9, 0.07), 0.01, vec2(-1.9, -0.4)))*step(0.2, (tan(u_time/2.)+1.)/2.);
    color += vec3(Cross(cross_uv, vec2(0.9, 0.07), 0.01, vec2(2.42, -1.8)))*step(0.6, (tan(u_time/2.)+1.)/2.);

    color += vec3(Rectangle(uv, vec2(0.1, 2.9), vec4(0.01, 0.05, 0.01, 0.05), vec2(2.0, 0.)))*step(0.8, (tan(u_time/2.)+1.)/2.);


    int j = 1;
    float board_thickness = 0.04;
    for(int i = 1; i < 3; i++){
        color += vec3(Band(board_thickness, vec2(0.01), float(i)*2.0 - 3., uv.x));
        color += vec3(Band(board_thickness, vec2(0.01), float(j)*2.0 - 3., uv.y));
        j += 1;
    }


    fragColor = vec4(color, 1.0);
}
