#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


float Remap01(float a, float b, float t){
    return clamp((t-a)/(b-a), 0.0, 1.0);
}


float Remap(float a, float b, float c, float d, float t){
    return clamp((t-a)/(b-a), 0.0, 1.0) * (d-c) + c;
}


vec2 Within(vec2 coord, vec4 rect){
    return (coord-rect.xy) / (rect.zw-rect.xy);
}


vec4 Eye(vec2 coord){
    coord -= 0.5;

    float d = length(coord);

    vec3 irisColor = vec3(0.3, 0.5, 1.0);
    vec4 color = vec4(mix(vec3(1.0), irisColor, smoothstep(0.1, 0.7, d) * 0.5), 1.0);


    color.rgb *= 1.0 - smoothstep(0.45, 0.5, d) * 0.5 * clamp(-coord.y - coord.x, 0.0, 1.0);
    color.rgb = mix(color.rgb, vec3(0.0), smoothstep(0.3, 0.28, d));

    irisColor.rgb *= 1.0 + smoothstep(0.3, 0.05, d);
    color.rgb = mix(color.rgb, irisColor.rgb, smoothstep(0.28, 0.25, d));

    color.rgb = mix(color.rgb, vec3(0.0), smoothstep(0.16, 0.14, d));


    float highLight = smoothstep(0.1, 0.09, length(coord - vec2(-0.15, 0.15)));
    highLight += smoothstep(0.07, 0.05, length(coord + vec2(-0.08, 0.08)));
    color.rgb = mix(color.rgb, vec3(1.0), highLight);

    color.a = smoothstep(0.5, 0.48, d);

    return color;
}


vec4 Mouth(vec2 coord){
    vec4 color = vec4(0.5, 0.18, 0.05, 1.0);
    coord -= 0.5;

    coord.y *= 1.5;
    coord.y -= coord.x * coord.x * 2.0;

    float d = length(coord);
    color.a = smoothstep(0.5, 0.48, d);

    float teeth = length(coord-vec2(0.0, 0.6));

    vec3 toothColor = vec3(1.0) * smoothstep(0.6, 0.35, d);
    color.rgb = mix(color.rgb, toothColor, smoothstep(0.4, 0.37, teeth));

    float tongueDistance = length(coord + vec2(0.0, 0.5));
    color.rgb = mix(color.rgb, vec3(1.0, 0.5, 0.5), smoothstep(0.5, 0.2, tongueDistance));


    return color;
}


vec4 Head(vec2 coord){
    vec4 color = vec4(0.9, 0.65, 0.1, 1.0);

    float d = length(coord);

    color.a = smoothstep(0.5, 0.49, d);

    float edgeShade = Remap01(0.35, 0.5, d);
    edgeShade *= edgeShade;
    color.rgb *= 1.0 - edgeShade * 0.5;

    color.rgb = mix(color.rgb, vec3(0.6, 0.3, 0.1), smoothstep(0.47, 0.48, d));

    float highLight = smoothstep(0.41, 0.405, d);
    highLight *= Remap(0.41, -0.1, 0.75, 0.0, coord.y);
    color.rgb = mix(color.rgb, vec3(1.0), highLight);

    d = length(coord - vec2(0.25, -0.2));
    float cheek = smoothstep(0.2, 0.01, d) * 0.4;
    cheek *= smoothstep(0.17, 0.16, d) ;
    color.rgb = mix(color.rgb, vec3(1.0, 0.1, 0.1), cheek);

    return color;
}


vec4 Smiley(vec2 coord){
    vec4 color = vec4(0.0);

    coord.x = abs(coord.x);

    vec4 head = Head(coord);
    vec4 eye = Eye(Within(coord, vec4(0.03, -0.1, 0.37, 0.25)));
    vec4 mouth = Mouth(Within(coord, vec4(-0.3, -0.4, 0.3, -0.1)));

    color = mix(color, head, head.a);
    color = mix(color, eye, eye.a);
    color = mix(color, mouth, mouth.a);

    return color;
}


vec2 AspectRatio(){
    return (2.0 * gl_FragCoord.xy - u_resolution) / (2.0 * u_resolution.y);
}


void main(){
    vec2 coord =  AspectRatio();
    vec3 color = vec3(0.0);

    fragColor = Smiley(coord);
}