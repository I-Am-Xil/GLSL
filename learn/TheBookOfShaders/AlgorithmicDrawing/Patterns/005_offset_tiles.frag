#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

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

vec2 TilesOffset(vec2 uv){
    //assigning operator determines movement orientation
    //uv axis inside mod() determines if row/col is even or odd
    uv.x += step(1., mod(uv.y, 2.)) * 0.5 * u_time;
    return fract(uv);
}

float Circle(vec2 uv, float scale, float blur){
    return smoothstep(scale + blur, scale - blur, length(uv));
}

void main(){
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
    vec3 color = vec3(1.0);


    uv *= 5.;

    uv.x += step(1., mod(uv.y, 2.)) * 1.0 * smoothstep(0.0, 1.0, 2.*mod(u_time/2., 2.));
    uv.x -= step(1., mod(-uv.y, 2.)) * 1.0 * smoothstep(0.0, 1.0, 2.*mod(u_time/2., 2.));

    uv.y += step(1., mod(uv.x, 2.)) * 1.0 * smoothstep(1.0, 2.0, 2.*mod(u_time/2., 2.));
    uv.y -= step(1., mod(-uv.x, 2.)) * 1.0 * smoothstep(1.0, 2.0, 2.*mod(u_time/2., 2.));

    uv.x -= step(1., mod(uv.y, 2.)) * 1.0 * smoothstep(2.0, 3.0, 2.*mod(u_time/2., 2.));
    uv.x += step(1., mod(-uv.y, 2.)) * 1.0 * smoothstep(2.0, 3.0, 2.*mod(u_time/2., 2.));

    uv.y -= step(1., mod(uv.x, 2.)) * 1.0 * smoothstep(3.0, 4.0, 2.*mod(u_time/2., 2.));
    uv.y += step(1., mod(-uv.x, 2.)) * 1.0 * smoothstep(3.0, 4.0, 2.*mod(u_time/2., 2.));


    uv = fract(uv);

    color -= vec3(Circle(uv-0.5, 0.3, 0.01));

    fragColor = vec4(color, 1.0);
}
