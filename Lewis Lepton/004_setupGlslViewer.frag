#ifdef GL_ES
precision mediump float;
#endif

void main(){
    vec3 color = vec3(0.6, 0.4, 0.7);

    gl_FragColor = vec4(color, 1.0);
}