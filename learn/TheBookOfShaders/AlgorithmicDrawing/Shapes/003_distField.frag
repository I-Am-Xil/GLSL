#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);
    float d = 0.0;

    // Remap the space to -1. to 1.
    st = st *2.-1.;



    // Make the distance field
    d = length( abs(st)-.3 );
    // d = length( min(abs(st)-.3,0.) );
    // d = length( max(abs(st)-.3,0.) );

    // Visualize the distance field
    fragColor = vec4(vec3(fract(d*10.0)),1.0);

    // Drawing with the distance field
    // fragColor = vec4(vec3( step(.3,d) ),1.0);
    // fragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
    //fragColor = vec4(vec3( smoothstep(.3,.4,d) * smoothstep(.6,.5,d)) ,1.0);
}

