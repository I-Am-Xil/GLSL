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

vec2 Tile(vec2 uv, float subdiv){
    uv *= subdiv;
    return fract(uv);
}

vec2 TileRotatePattern(vec2 uv){
    float rot = step(1., mod(uv.y, 2.));
    rot += step(1., mod(uv.x, 2.));
    rot += 2. * step(1., mod(-uv.y, 2.)) * step(1., mod(uv.x, 2.));

    return uv = fract(uv * Rotate2D(PI/2 * rot));
}


void main(){
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution) / u_resolution.y;
    vec3 color = vec3(0.0);

    uv *= 3.;

    uv = TileRotatePattern(uv);

    //uv = Tile(uv, 2.);
    //uv = (uv - 0.5) * Rotate2D(u_time);
    //uv = TileRotatePattern(uv*2.);
    //uv = (uv - 0.5) * Rotate2D(-u_time);

    color = vec3(step(uv.x, uv.y));


    fragColor = vec4(color, 1.0);
}
