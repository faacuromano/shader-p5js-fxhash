#ifdef GL_ES
precision mediump float;
#endif

#define pi 3.14159265358979323846

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float det;
uniform float song;
uniform float maxdist;

///////////////////////////////////// VARIABLES DE ENTORNO /////////////////////////////////////

vec3 objcolor;

///////////////////////////////////// OBJETOS DE LA ESCENA /////////////////////////////////////

//Función de Esfera
float sphere(vec3 p, float r) {
    return length(p) - r;
}

//Función de Torus
float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

//Función de Prisma
float sdHexPrism(vec3 p, vec2 h) {
    const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
    p = abs(p);
    p.xy -= 2.0 * min(dot(k.xy, p.xy), 0.0) * k.xy;
    vec2 d = vec2(
        length(p.xy - vec2(clamp(p.x, -k.z * h.x, k.z * h.x), h.x)) * sign(p.y - h.x),
        p.z - h.y
    );
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

//Función de Rotación
mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, s, -s, c);
}

///////////////////////////////////// OBJETOS CON ROTACIONES /////////////////////////////////////

float obj1(vec3 p) {
    p.yz *= rot(time);
    p.xz *= rot(time);
    float sph = sphere(p, 2.0) - length(p * sin(p + time - sin(time) * song * 22.0) ) * 0.51;
    return sph;
}
float obj4(vec3 p) {
    p.yz *= rot(time);
    p.xz *= rot(time);
    float sph = sphere(p, 2.0);
    return sph;
}

float obj2(vec3 p, vec2 h) {
    p.yz *= rot(time);
    p.xz *= rot(time);

    float prisma2 = sdHexPrism(p, h);
    return prisma2;

}

float obj3(vec3 p, vec2 h) {
    p.xy *= rot(90.0);
    p.yz *= rot(time);
    p.xz *= rot(time);

    float prisma1 = sdHexPrism(p, h);
    return prisma1;
}


float opSmoothSubtraction(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
    return mix(d2, -d1, h) + k * h * (1.0 - h);
}

/////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// FUNCIONES RAYMARCHING /////////////////////////////////////

float de(vec3 p) {
    vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;

    float sphere1 = obj1(p);
    float boolean = obj3(p, vec2(5.0, 0.30 ));
    float boolean2 = obj2(p, vec2(4.0, 0.10 ));
    float e = opSmoothSubtraction(boolean, sphere1, .50);
    float a = opSmoothSubtraction(boolean2, e, .50);

    if (e == sphere1) objcolor = vec3(    
      cos(sin(uv.x * 30.0 * pi + uv.y * 30.0  * pi + time * 1.0) - sin(uv.x * 2.0 * pi) - sin(uv.y * uv.y ) + (uv.y * 22.0 * pi)),
      sin(uv.x * pi * 2.0 / uv.y * pi * 20.0),
      sin(uv.x * pi * 2.0 / uv.y * pi * 20.0 )
      );

    return a;
}

// Función de normales<
vec3 normal(vec3 p) {
    vec2 d = vec2(0.0, det);
    return normalize(vec3(de(p + d.yxx), de(p + d.xyx), de(p + d.xxy)) - de(p));
}

// Función para el shade del objeto
vec3 shade(vec3 p, vec3 dir) {
    vec3 lightdir = normalize(vec3(-4, 4, -5));
    vec3 n = normal(p);
    float amb = 0.35;
    float dif = max(0.0, dot(lightdir, n));
    vec3 col = objcolor;
    vec3 ref = reflect(lightdir, n);
    float spe = pow(max(0.0, dot(lightdir, n)), 0.1) + 0.6;
    return col * (amb + dif) * spe;
}

// Función del RayMarching
vec3 march(vec3 from, vec3 dir) {
        vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;

    vec3 p;
    vec3 col = vec3(0.2, step(0.9, sin(3.14 * 22.0 * uv.x + (song * 10.0)  + time )) * 0.8, sin(pi * 22.0 * uv.x - (song * 10.0) + time ) * 0.8);
    float d;
    float totdist = 0.0;
    for (int i = 0; i < 50; i++) {
        p = from + totdist * dir;
        d = de(p);
        totdist += d;
        if (totdist > maxdist || d < det) break;
    }
    if (d < det) {
        col = shade(p, dir);
    }
    return col;
}

///////////////////////////////////////////////////////////////////////////////////////////////

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;
    vec3 from = vec3(0.0 , 0.0, -7.5 ) ;
    uv.xy *= rot(mouse.y * 0.005);
    uv.yx *= rot(mouse.x * 0.005);
    vec3 dir = normalize(vec3(uv, 0.50));
    vec3 col = march(from, dir);
    gl_FragColor = vec4(col, 1.0);
}
