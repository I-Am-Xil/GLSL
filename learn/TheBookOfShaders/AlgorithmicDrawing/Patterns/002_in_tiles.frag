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

float Band(float scale, vec2 blur, float offset, float axis){
    axis +=  offset + 0.5;
    scale += 0.5;
    float s1 = smoothstep(scale + blur.x, scale - blur.x, axis);
    float s2 = smoothstep(scale + blur.y, scale - blur.y, 1.-axis);
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

vec2 AspectRatio(vec2 screen){
    return (2.0 * screen - u_resolution) / u_resolution.y;
}

float Arc(vec2 uv, vec2 scale, vec2 offset, float thickness, vec4 blur, float rotation_angle){
    uv *= Rotate2D(rotation_angle);

    float r = length(uv);
    float theta = atan(uv.y, uv.x);
    uv = vec2(r, theta);

    float arc = Rectangle(uv, scale + vec2(thickness, 0.), blur, offset);
    arc -= Rectangle(uv, scale, blur, offset);

    return arc;
}

float Cross(vec2 uv, vec2 scale, float blur, vec2 offset){
    float rect1 = Rectangle(uv, vec2(scale.x, scale.y), vec4(blur), offset);
    float rect2 = Rectangle(uv, vec2(scale.y, scale.x), vec4(blur), offset);
    return max(rect1, rect2);
}

float Polygon(vec2 uv, vec2 offset, float radius, float sides, float blur){
    uv += offset;
    float angle = atan(uv.x, uv.y);
    float slice = PI * 2.0 / sides;
    return smoothstep(radius,  radius - blur, cos(floor(0.5 + angle / slice) * slice - angle) * length(uv));
}

void main(){
    //vec2 uv = gl_FragCoord.xy/u_resolution;
    vec2 uv = AspectRatio(gl_FragCoord.xy);
    vec3 color = vec3(0.0);

    uv = Tile(uv, 2) - 0.5;

    color += vec3(Rectangle(uv*Rotate2D(PI/4), vec2(0.37), vec4(abs(tan(u_time/2))+0.01), vec2(0.0)));







    fragColor = vec4(color, 1.0);
}
