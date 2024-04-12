#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float Circle(vec2 coord, vec2 position, float radius, float blur){
    float d = length(coord - position);
    float c = smoothstep(radius, radius - blur, d);

    return c;
}


vec2 AspectRatio(){
    return (2.0 * gl_FragCoord.xy - u_resolution) / (2.0 * u_resolution.y);
}


vec3 hsb2rgb(vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

mat2 Rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}


void main(){
    vec2 coord = 1.2*AspectRatio();
    vec3 color = vec3(0.0);

    float c1 = Circle(coord, vec2(0.0), 0.5, 0.01);
    float c2 = Circle(coord, vec2(0.0), 0.4, 0.01);

    color = vec3(c1 - c2);
    color *= hsb2rgb(vec3(0.55, 1.0, 1.0));

    coord *= Rotate(u_time);
    coord.x += 0.45;
    float r = length(coord);

    color -= r;



    fragColor = vec4(color, 1.0);
}