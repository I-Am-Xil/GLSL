#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

mat2 rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main(){
    vec2 coord = (gl_FragCoord.xy * 2.0 - u_resolution) * rotate(u_time * 0.1);
    vec3 color = vec3(0.0);

    color += abs(cos(coord.x / 20.0) + sin(coord.y / 20.0) - cos(u_time));

    gl_FragColor = vec4(color, 1.0);
}