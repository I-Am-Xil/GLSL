#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

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

vec2 Rotate2D(vec2 uv, float angle){
    mat2 rotation_matrix = mat2(cos(angle), -sin(angle),
                                sin(angle), cos(angle));
    uv -= vec2(0.5);
    uv *= rotation_matrix;
    uv += vec2(0.5);
    return uv;
}

vec2 Scale(vec2 uv, vec2 scale){
    mat2 scaling_matrix = mat2(scale.x, 0.0,
                               0.0, scale.y);
    uv -= vec2(0.5);
    uv *= scaling_matrix;
    uv += vec2(0.5);
    return uv;
}

void main(){
    vec2 coord = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    float angle = u_time;
    vec2 translate = vec2(cos(angle), sin(angle));

    coord = Scale(coord, vec2(sin(u_time)));

    coord = Rotate2D(coord, angle);
    coord += translate*0.2*sin(u_time*2);

    color = vec3(Cross(coord, vec2(0.1, 0.4), 0.001, vec2(.0)));


    fragColor = vec4(color, 1.0);
}
