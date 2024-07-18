#version 460
#ifdef GL
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


vec4 Eye(vec2 coord, float side, vec2 mouse, float smile){
    coord -= 0.5;
    coord.x *= side;

    float d = length(coord);
    vec3 irisColor = vec3(0.3, 0.5, 1.0);
    vec4 color = vec4(mix(vec3(1.0), irisColor, smoothstep(0.1, 0.7, d) * 0.5), 1.0);
    color.a = smoothstep(0.5, 0.48, d);

    color.rgb *= 1.0 - smoothstep(0.45, 0.5, d) * 0.5 * clamp(-coord.y - coord.x * side, 0.0, 1.0);
    d = length(coord - mouse * 0.55);

    color.rgb = mix(color.rgb, vec3(0.0), smoothstep(0.3, 0.28, d));

    irisColor.rgb *= 1.0 + smoothstep(0.3, 0.05, d);
    float irisMask = smoothstep(0.28, 0.25, d);
    color.rgb = mix(color.rgb, irisColor.rgb, irisMask);

    d = length(coord - mouse * 0.6);

    float pupilSize = mix(0.3, 0.16,  smile);
    float pupilMask = smoothstep(pupilSize, pupilSize - 0.02, d);
    pupilMask *= irisMask;
    color.rgb = mix(color.rgb, vec3(0.0), pupilMask);

    vec2 offset = vec2(sin(u_time + coord.y * 25.0), sin(u_time + coord.x * 25.0));
    coord += offset * 0.01 * (1.0-smile); // at 0.1 kinda looks like water

    float highLight = smoothstep(0.1, 0.09, length(coord - vec2(-0.15, 0.15)));
    highLight += smoothstep(0.07, 0.05, length(coord + vec2(-0.08, 0.08)));
    color.rgb = mix(color.rgb, vec3(1.0), highLight);


    return color;
}


vec4 Mouth(vec2 coord, float smile){
    vec4 color = vec4(0.5, 0.18, 0.05, 1.0);
    coord -= 0.5;

    coord.y *= 1.5;
    coord.y -= coord.x * coord.x * 2.0 * smile;

    coord.x *= mix(2.5, 1.0, smile);

    float d = length(coord);
    color.a = smoothstep(0.5, 0.48, d);

    vec2 teethCoord = coord;
    teethCoord.y += (abs(teethCoord.x) * 0.5 + 0.1) * (1.0 - smile);

    float teeth = length(teethCoord - vec2(0.0, 0.6));

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
    highLight *= smoothstep(0.18, 0.19, length(coord - vec2(0.21, 0.082)));
    color.rgb = mix(color.rgb, vec3(1.0), highLight);

    d = length(coord - vec2(0.25, -0.2));
    float cheek = smoothstep(0.2, 0.01, d) * 0.4;
    cheek *= smoothstep(0.17, 0.16, d) ;
    color.rgb = mix(color.rgb, vec3(1.0, 0.1, 0.1), cheek);

    return color;
}


float Circle(vec2 coord, vec2 position, float radius, float blur){
    float d = length(coord - position);
    float c = smoothstep(radius, radius - blur, d);

    return c;
}


vec4 Brow(vec2 coord, float smile){
    float offset = mix(0.2, 0.0, smile);
    coord.y += offset;

    float y = coord.y;
    coord.y += coord.x * mix(0.5, 0.8, smile) - mix(0.1, 0.3, smile);
    coord.x -= mix(0.0, 0.1, smile);
    coord -= 0.5;

    vec4 color = vec4((0.0));

    float blur = 0.1;

    float s1 = Circle(coord, vec2(0.0), .45, blur);
    float s2 = Circle(coord, vec2(0.1, -0.2)*0.7, 0.5, blur);

    float browMask = clamp(s1 - s2, 0.0, 1.0);

    float colorMask = Remap01(0.7, 0.8, y) * 0.75;
    colorMask *= smoothstep(0.6, 0.9, browMask) * smile;
    vec4 browColor = mix(vec4(0.4, 0.2, 0.2, 1.0), vec4(1.0, 0.75, 0.5, 1.0), colorMask);

    coord.y += 0.15 - offset * 0.5;
    blur += mix(0.0, 0.1, smile);
    s1 = Circle(coord, vec2(0.0), 0.45, blur);
    s2 = Circle(coord, vec2(0.1, -0.2)*0.7, 0.5, blur);
    float shadowMask = clamp(s1 - s2, 0.0, 1.0);

    color = mix(color, vec4(0.0, 0.0, 0.0, 1.0), smoothstep(0.0, 1.0, shadowMask) * 0.5);


    color = mix(color, browColor, smoothstep(0.2, 0.4, browMask));

    return color;
}


vec4 Smiley(vec2 coord, vec2 mouse, float smile){
    vec4 color = vec4(0.0);

    float side = sign(coord.x);
    coord.x = abs(coord.x);

    vec4 head = Head(coord);
    vec4 eye = Eye(Within(coord, vec4(0.03, -0.1, 0.37, 0.25)), side, mouse, smile);
    vec4 mouth = Mouth(Within(coord, vec4(-0.3, -0.43, 0.3, -0.13)), smile);
    vec4 brow = Brow(Within(coord, vec4(0.03, 0.2, 0.4, 0.45)), smile);

    color = mix(color, head, head.a);
    color = mix(color, eye, eye.a);
    color = mix(color, mouth, mouth.a);
    color = mix(color, brow, brow.a);

    return color;
}


vec2 AspectRatio(){
    return (2.0 * gl_FragCoord.xy - u_resolution) / (2.0 * u_resolution.y);
}


void main(){
    vec2 coord = AspectRatio();
    vec3 color = vec3(0.0);
    vec2 mouse = (u_mouse / u_resolution) - vec2(0.5);

    coord -= mouse * (0.25 - length(dot(coord, coord)));

    float smile = (cos(u_time) + 1.0) * 0.5;

    fragColor = Smiley(coord, mouse, smile);
}