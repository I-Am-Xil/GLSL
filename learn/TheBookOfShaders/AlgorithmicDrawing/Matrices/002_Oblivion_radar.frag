#version 460
#ifdef GL
precision mediump float;
#endif

out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

const float PI = 3.14159265359;


mat2 Scale(vec2 scale){
    return mat2(scale.x, 0.0,
                0.0, scale.y);
}


mat2 Rotate2D(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}


float Band(float scale, vec2 blur, float offset, float axis){
    axis += offset/2;
    float s1 = smoothstep((scale + blur.x)/2, (scale - blur.x)/2, axis);
    float s2 = smoothstep((scale + blur.y)/2, (scale - blur.y)/2, -axis);
    return s1*s2;
}


float Rectangle(vec2 uv, vec2 scale, vec4 blur, vec2 offset){
    float xBand = Band(scale.x, blur.xz, offset.x, uv.x);
    float yBand = Band(scale.y, blur.yw, offset.y, uv.y);
    return xBand * yBand;
}


float Circle(vec2 uv, float scale, float blur, vec2 offset){
    uv += offset;
    return smoothstep(scale + blur, scale - blur, length(uv));
}


float Circunference(vec2 uv, vec2 offset, float scale, float thickness, float blur){
    float cirtunference = Circle(uv, scale, blur, vec2(offset));
    cirtunference -= Circle(uv, scale + thickness, blur, vec2(offset));
    return cirtunference;
}


float Arc(vec2 uv, vec2 scale, vec2 offset, float thickness, vec4 blur, float rotation_angle){
    vec2 uv0 = uv;
    uv = uv0*Rotate2D(rotation_angle);

    float r = length(uv);
    float theta = atan(uv.y, uv.x);
    uv = vec2(r, theta);

    float arc = Rectangle(uv, scale + vec2(thickness, 0.), blur, offset);
    arc -= Rectangle(uv, scale, blur, offset);

    return arc;
}


float RedCircle(vec2 uv){
    uv += vec2(cos(u_time/20)*cos(u_time/30+cos(u_time/6)), sin(u_time/14 + sin(u_time/16)))*.5;

    float scale_circle = fract(u_time)+0.3;
    float red_circle = Circle(uv, 0.15*scale_circle, -0.05, vec2(0.0));
    red_circle -= Circle(uv, 0.2*scale_circle, -0.005, vec2(0.0));

    red_circle += Circle(uv, 0.037, 0.002, vec2(0.0));
    red_circle -= Circle(uv, 0.03, 0.002, vec2(0.0));
    red_circle += Circle(uv, 0.025, 0.002, vec2(0.0))*round((sin(u_time*2.)+1.)/2.);

    return red_circle;
}


float ThinCircle(vec2 uv, float scale, float thick){
    float thincirc = Circle(uv, 0.4+scale, 0.004, vec2(0.0));
    thincirc -= Circle(uv, 0.395/thick+scale, 0.004, vec2(0.0));
    return thincirc;
}


float Circles2N3(vec2 uv){
    float circ = ThinCircle(uv, 0.15, 1.);
    circ += ThinCircle(uv, -0.08, 1.);
    return circ;
}


float Circles1(vec2 uv){
    float circ = ThinCircle(uv, -0.36, 0.996);
    return circ;
}


float Circles4(vec2 uv){
    float circ = ThinCircle(uv, 0.40, 1.01);
    return circ;
}


float Arcs1(vec2 uv){
    vec2 uv0 = uv;

    float circ = ThinCircle(uv, 0.47, 0.992);

    //dark blue carvings
    float r = length(uv);
    float theta = atan(uv.y, uv.x);
    uv = vec2(r, theta);

    float scale = sin(u_time)/2-0.4;

    circ -= Rectangle(uv, vec2(1.005, 1.4 + scale), vec4(0.005), vec2(-0.74, 0.));
    circ += Rectangle(uv, vec2(0.995, 1.4 + scale), vec4(0.005), vec2(-0.74, 0.));

    uv = uv0*Rotate2D(radians(180));
    r = length(uv);
    theta = atan(uv.y, uv.x);
    uv = vec2(r, theta);

    circ -= Rectangle(uv, vec2(1.005, 1.4 + scale), vec4(0.005), vec2(-0.74, 0.));
    circ += Rectangle(uv, vec2(0.995, 1.4 + scale), vec4(0.005), vec2(-0.74, 0.));

    return circ;
}


float Arcs2(vec2 uv){
    vec2 uv0 = uv;

    //bright blue
    uv = uv0*Rotate2D(radians(90));
    float r = length(uv);
    float theta = atan(uv.y, uv.x);
    uv = vec2(r, theta);

    float circ = -Rectangle(uv, vec2(1.32, 3.06), vec4(0.005), vec2(-0.74, 0.));
    circ += Rectangle(uv, vec2(1.35, 3.06), vec4(0.005), vec2(-0.74, 0.));

    uv = uv0*Rotate2D(radians(-90));
    r = length(uv);
    theta = atan(uv.y, uv.x);
    uv = vec2(r, theta);

    circ -= Rectangle(uv, vec2(1.32, 3.06), vec4(0.005), vec2(-0.74, 0.));
    circ += Rectangle(uv, vec2(1.35, 3.06), vec4(0.005), vec2(-0.74, 0.));

    return circ;
}


float Cross(vec2 uv, vec2 scale, float blur, vec2 offset){
    float rect1 = Rectangle(uv, vec2(scale.x, scale.y), vec4(blur), offset);
    float rect2 = Rectangle(uv, vec2(scale.y, scale.x), vec4(blur), offset);
    return max(rect1, rect2);
}


float CrossMark(vec2 uv){
    return Cross(uv, vec2(0.0001, 1.6), 0.005, vec2(0.0));
}


float Polygon(vec2 uv, vec2 offset, float radius, float sides, float blur){
    uv += offset;
    float angle = atan(uv.y, uv.x);
    float slice = PI * 2.0 / sides;
    return smoothstep(radius,  radius - blur, cos(floor(0.5 + angle / slice) * slice - angle) * length(uv));
}


float Triangles(vec2 uv){
    float anim = sin(u_time)/12;

    float t1 = Polygon(uv*Rotate2D(radians(180)), vec2(-1.05+anim, 0.0), 0.02, 3., 0.005);
    float t2 = Polygon(uv*Rotate2D(radians(0)), vec2(-1.05+anim, 0.0), 0.02, 3., 0.005);
    return t1+t2;
}


float NeedleNTrace(vec2 uv, float speed){
    float needle = Rectangle(uv*Rotate2D(u_time*speed), vec2(0.795, 0.007), vec4(0.005), vec2(-0.795, 0.));

    vec2 uv0 = uv;
    uv = uv0*Rotate2D(radians(-7)+u_time*speed);
    float r = length(uv);
    float theta = atan(uv.y, uv.x);
    uv = vec2(r, theta);

    float trace = Rectangle(uv, vec2(0.795, PI/13), vec4(0.005, PI, 0.005, 0.005), vec2(-0.795, 0.));

    return needle + trace;
}


float Dots(vec2 uv){
    uv += vec2(sin(u_time/8), cos(u_time/4))/4;
    uv *= Rotate2D(u_time/4);

    float c1 = Circle(uv, 0.009, 0.005, vec2(sin(u_time)/16));
    float c2 = Circle(uv, 0.009, 0.005, vec2(0.2+sin(u_time/2+sin(u_time))/12));
    return c1 + c2;
}


void main(){
    vec2 uv = 1.17*(gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
    vec3 color = vec3(0.0);

    //Red
    color += vec3(RedCircle(uv))*vec3(1.0, 0.37, 0.2);

    //Dark blue tron
    color += vec3(Arcs1(uv))*vec3(0.5, 0.8, 0.8);

    //Mint
    color += vec3(Arcs2(uv))*vec3(0.7, 0.9, 0.96);
    color += vec3(Triangles(uv))*vec3(0.7, 0.9, 0.96);

    //Dark bright blue
    color += vec3(Circles1(uv))*vec3(0.4, 0.6, 0.6);

    //Pale blue
    color += vec3(Circles2N3(uv))*vec3(0.65, 0.75, 0.80);

    //White
    color += vec3(Circles4(uv));
    color += vec3(CrossMark(uv*Rotate2D(radians(45))));
    color += vec3(Dots(uv));

    //Blue Tron
    color += vec3(NeedleNTrace(uv, 1.5))*vec3(0.45, 0.9, 1.0);


    fragColor = vec4(color, 1.0);
}
