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

vec3 Tableau(vec2 coord){

    vec3 color = vec3(1., 0.99, 0.99);

    color -= vec3(Band(0.05, vec2(0.001), -0.9, coord.x));
    color -= vec3(Band(0.05, vec2(0.001), -0.4, coord.x));
    color -= vec3(Band(0.05, vec2(0.001), 0.55, coord.x));
    color -= vec3(Band(0.05, vec2(0.001), 0.75, coord.y));
    color -= vec3(Band(0.05, vec2(0.001), -0.65, coord.y));
    color -= vec3(Band(0.05, vec2(0.001), -0.25, coord.y));


    vec2 r1pos = vec2(0.8, -0.9);
    color.gb -= Rectangle(coord, vec2(0.22, 0.61), vec4(0.01), r1pos);

    r1pos = vec2(-0.7, 0.9);
    color.rg -= Rectangle(coord, vec2(0.3, 0.11), vec4(0.01), r1pos);

    r1pos = vec2(-1.0, -0.9);
    color.b -= Rectangle(coord, vec2(0.05, 0.6), vec4(0.01), r1pos);

    r1pos = vec2(0.8, -0.9);
    color -= Rectangle(coord, vec2(0.05, 0.6), vec4(0.001), r1pos);

    return color;

}

void main(){
    vec2 coord = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(1.);

    color = vec3(Band(0.4, vec2(0.1), 0., coord.x));

    fragColor = vec4(color, 1.0);
}
