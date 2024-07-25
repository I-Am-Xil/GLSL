#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983,
                    1.0, -0.39465, -0.5806,
                    1.0, 2.03211, 0.0);

mat3 rgb2yub = mat3(0.2126, 0.7152, 0.0722,
                    -0.09991, -0.33609, 0.43600,
                    0.615, -0.5586, -0.05639);

vec2 AspectRatio(vec2 screen){
    return (2.0 * screen - u_resolution) / u_resolution.y;
}

void main(){
    vec2 uv = gl_FragCoord.xy;
    uv = AspectRatio(uv);
    vec3 color = vec3(0.0);

    color = yuv2rgb * vec3(0.5, vec2(uv));

    fragColor = vec4(color, 1.0);
}
