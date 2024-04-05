#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main(){

    const float n_lights = 20.0;

    vec2 coord = (gl_FragCoord.xy / u_resolution);
    vec3 color = vec3(0.0);

    vec2 translate = vec2(-0.5, -0.5);
    coord += translate;

    for(int i = 0; i < int(n_lights); i++){
        float radius = 0.3;
        float rad = radians(360.0 / n_lights) * float(i);

        color += 0.003 / length(coord + vec2(radius * cos(rad), radius * sin(rad)) * rotate(u_time * 0.2));
    }


    gl_FragColor = vec4(color, 1.0);
}