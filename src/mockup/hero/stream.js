// The Stream — Three.js hero.
// A tunnel of glowing content cards rushes toward the viewer (the feed).
// As `order` goes 0 → 1 the flow slows, the colors drain to paper and ink,
// most cards scatter off, and six settle into a neat, finite stack: an edition.
import { WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, InstancedBufferGeometry, InstancedBufferAttribute, ShaderMaterial, Mesh, Color, Vector3, SRGBColorSpace, NormalBlending, DoubleSide } from 'three'

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uOrder;
  uniform float uFlow;
  uniform vec3 uStackOrigin;   // where the stack forms
  uniform float uXScale;       // squeeze the tunnel on narrow screens
  uniform float uStackScale;   // size of the settled cards
  attribute float aSeed;
  attribute float aSpeed;
  attribute float aColor;
  attribute float aSize;
  attribute vec2 aLane;        // angle, radius
  attribute vec4 aStack;       // x, y, z offset in stack, delay (w < 0 → no slot)
  attribute float aKind;       // 0 video card, 1 text post, 2 vertical short
  varying vec2 vUv;
  varying float vColor;
  varying float vFade;
  varying float vSettle;       // 0 stream → 1 settled in stack
  varying float vGone;         // 1 when a slotless card has scattered away
  varying float vSeed;
  varying float vKind;
  varying vec2 vKS;

  mat3 rotZ(float a){ float c=cos(a), s=sin(a); return mat3(c,s,0.,-s,c,0.,0.,0.,1.); }
  mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s,0.,1.,0.,s,0.,c); }
  mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0.,0.,c,s,0.,-s,c); }

  void main() {
    vUv = uv; vColor = aColor; vSeed = aSeed; vKind = aKind;
    vec2 ks = aKind > 1.5 ? vec2(0.58, 1.55) : (aKind > 0.5 ? vec2(1.0, 0.72) : vec2(1.0));
    vKS = ks;
    float len = 72.0;
    // stream position: cards ride from far (-66) to just past the camera (+6)
    float travel = aSeed * len + uTime * aSpeed * (0.35 + uFlow * 5.0);
    float z = mod(travel, len) - (len - 6.0);
    float swirl = uTime * 0.12 * uFlow + z * 0.045;
    float ang = aLane.x + swirl;
    float r = aLane.y * (1.0 + 0.12 * sin(uTime * 0.7 + aSeed * 12.0));
    vec3 sp = vec3(cos(ang) * r * uXScale, sin(ang) * r, z);
    float tiltY = sin(uTime * 0.6 + aSeed * 7.0) * 0.35 * uFlow;
    float tiltZ = (aSeed - 0.5) * 0.6 * uFlow;
    mat3 srot = rotY(tiltY) * rotZ(tiltZ);
    float sscale = aSize;

    bool hasSlot = aStack.w >= 0.0;
    float settle = 0.0;
    vec3 pos; mat3 rot; float scale;
    if (hasSlot) {
      // each stack card settles on its own schedule so the stack "arrives" one page at a time
      settle = smoothstep(aStack.w, aStack.w + 0.55, uOrder);
      float e = settle * settle * (3.0 - 2.0 * settle);
      // flight path: leave the stream, arc through the front, land in the stack
      vec3 stackPos = uStackOrigin + aStack.xyz;
      stackPos.y += sin(uTime * 0.9 + aSeed * 6.283) * 0.025 * e;   // paper breathes
      vec3 mid = mix(sp, stackPos, 0.5) + vec3(0.0, 0.9, 2.0);
      vec3 p1 = mix(sp, mid, e);
      vec3 p2 = mix(mid, stackPos, e);
      pos = mix(p1, p2, e);
      rot = rotY(tiltY * (1.0 - e)) * rotZ(mix(tiltZ, -0.035 + aStack.x * 0.1, e));
      scale = mix(sscale, uStackScale, e);
    } else {
      // slotless cards drift out of the tunnel and dissolve
      float k = smoothstep(0.05 + aSeed * 0.35, 0.65 + aSeed * 0.35, uOrder);
      pos = sp + normalize(vec3(sp.xy, 0.001)) * k * 9.0 + vec3(0.0, 0.0, -k * 20.0);
      rot = srot;
      scale = sscale * (1.0 - k * 0.6);
      vGone = k;
    }
    vSettle = settle;
    if (hasSlot) vGone = 0.0;
    // depth fade + entrance fade near the camera plane
    vFade = smoothstep(-66.0, -34.0, pos.z) * (1.0 - smoothstep(3.0, 6.0, pos.z));
    if (hasSlot) vFade = mix(vFade, 1.0, settle);

    vec3 local = rot * (position * vec3(ks * scale, 1.0));
    vec4 mv = modelViewMatrix * vec4(pos + local, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uOrder;
  uniform vec3 uPalette[5];
  uniform vec3 uPaper;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying vec2 vUv;
  varying float vColor;
  varying float vFade;
  varying float vSettle;
  varying float vGone;
  varying float vSeed;
  varying float vKind;
  varying vec2 vKS;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // the plane is 1.0 x 0.64; card occupies the middle 70% so the halo has room
    vec2 p = (vUv - 0.5) * vec2(1.0, 0.64) * vKS;
    vec2 hs = vec2(0.34, 0.215) * vKS;
    float d = sdRoundBox(p, hs, 0.035);
    float aa = fwidth(d) * 1.2;
    float card = 1.0 - smoothstep(0.0, aa, d);

    int ci = int(mod(vColor, 5.0));
    vec3 hot = uPalette[0];
    if (ci == 1) hot = uPalette[1]; else if (ci == 2) hot = uPalette[2]; else if (ci == 3) hot = uPalette[3]; else if (ci == 4) hot = uPalette[4];

    // interior layout: a "thumbnail" block on top, two text bars below
    vec2 q = (p + hs) / (hs * 2.0);              // 0..1 inside the card
    float thumb, bar1, bar2, avatar = 0.0;
    if (vKind > 1.5) {
      // vertical short: full-bleed thumbnail, caption bar at the bottom
      thumb = step(0.16, q.y) * step(0.05, q.x) * step(q.x, 0.95) * step(q.y, 0.96);
      bar1 = step(0.06, q.y) * step(q.y, 0.11) * step(0.08, q.x) * step(q.x, 0.7);
      bar2 = 0.0;
    } else if (vKind > 0.5) {
      // text post: avatar dot + three bars, no thumbnail
      thumb = 0.0;
      vec2 av = (q - vec2(0.12, 0.78)) * vec2(1.0, 0.72);
      avatar = 1.0 - smoothstep(0.055, 0.075, length(av));
      bar1 = step(0.50, q.y) * step(q.y, 0.58) * step(0.06, q.x) * step(q.x, 0.92)
           + step(0.34, q.y) * step(q.y, 0.42) * step(0.06, q.x) * step(q.x, 0.84);
      bar2 = step(0.18, q.y) * step(q.y, 0.26) * step(0.06, q.x) * step(q.x, 0.55);
    } else {
      thumb = step(0.42, q.y) * step(0.06, q.x) * step(q.x, 0.94) * step(q.y, 0.92);
      bar1 = step(0.24, q.y) * step(q.y, 0.31) * step(0.06, q.x) * step(q.x, 0.78);
      bar2 = step(0.10, q.y) * step(q.y, 0.17) * step(0.06, q.x) * step(q.x, 0.52);
    }

    // stream look: dark card, neon thumbnail, dim bars
    vec3 streamBase = vec3(0.10, 0.09, 0.085);
    vec3 streamThumb = hot * (0.75 + 0.35 * vSeed);
    vec3 streamCol = streamBase;
    streamCol = mix(streamCol, streamThumb, thumb);
    streamCol = mix(streamCol, vec3(0.42), clamp(bar1 + bar2, 0.0, 1.0));
    streamCol = mix(streamCol, hot * 0.9, avatar);

    // settled look: paper card, muted thumbnail, ink bars; the last page is accent-tinted
    vec3 paperThumb = mix(vec3(0.80, 0.78, 0.74), uAccent * 0.9 + 0.15, step(0.95, vColor / 5.0) * 0.0);
    vec3 paperCol = uPaper;
    paperCol = mix(paperCol, paperThumb, thumb);
    paperCol = mix(paperCol, uInk, clamp(bar1 + bar2, 0.0, 1.0) * 0.85);
    paperCol = mix(paperCol, uAccent, avatar);

    float settled = vSettle;
    vec3 col = mix(streamCol, paperCol, settled);

    // border for the paper card
    float edge = smoothstep(-0.012, -0.004, d) * settled * 0.35;
    col = mix(col, uInk, edge * card);

    // halo (only while streaming)
    float halo = exp(-max(d, 0.0) * 9.0) * (1.0 - smoothstep(0.0, aa, -d));
    float haloAmt = halo * 0.55 * (1.0 - settled) * (0.6 + 0.4 * vSeed);
    vec3 haloCol = hot * haloAmt;

    float alpha = card * vFade * (1.0 - vGone);
    alpha = mix(alpha * 0.92, alpha, settled);
    float haloAlpha = haloAmt * vFade * (1.0 - vGone);

    vec3 outCol = col * alpha + haloCol;
    float outA = clamp(alpha + haloAlpha, 0.0, 1.0);
    if (outA < 0.004) discard;
    gl_FragColor = vec4(outCol, outA);
  }
`

const HOT = ['#F0443A', '#F58A2A', '#3B84F0', '#A85AF0', '#25C6DE'].map((h) => new Color(h))

export function mountStream(canvas, opts = {}) {
  const mobile = !!opts.mobile
  const reduced = !!opts.reducedMotion
  const COUNT = mobile ? 520 : 1400
  const STACK = 6

  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
  } catch (e) {
    return null
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.6 : 2))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace

  const scene = new Scene()
  const camera = new PerspectiveCamera(mobile ? 58 : 48, 1, 0.1, 120)
  camera.position.set(0, 0, 7)

  const base = new PlaneGeometry(1.0, 0.64)
  const geo = new InstancedBufferGeometry()
  geo.index = base.index
  geo.attributes.position = base.attributes.position
  geo.attributes.uv = base.attributes.uv
  geo.instanceCount = COUNT

  const seed = new Float32Array(COUNT)
  const speed = new Float32Array(COUNT)
  const color = new Float32Array(COUNT)
  const size = new Float32Array(COUNT)
  const lane = new Float32Array(COUNT * 2)
  const stack = new Float32Array(COUNT * 4)
  const kind = new Float32Array(COUNT)

  // deterministic pseudo-random so the scene is stable between loads
  let s = 1337
  const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }

  for (let i = 0; i < COUNT; i++) {
    seed[i] = rnd()
    speed[i] = 0.6 + rnd() * 1.1
    color[i] = Math.floor(rnd() * 5)
    size[i] = 0.55 + rnd() * 0.9
    lane[i * 2] = rnd() * Math.PI * 2
    lane[i * 2 + 1] = 2.1 + Math.pow(rnd(), 0.7) * (mobile ? 5.0 : 7.5)   // keep the middle clear for the words
    stack[i * 4 + 3] = -1
    const kr = rnd()
    kind[i] = kr < 0.55 ? 0 : kr < 0.82 ? 1 : 2
  }
  // the six cards that become the edition
  // a fanned pile of six pages; k = 0 is the top page and is drawn last
  for (let k = 0; k < STACK; k++) {
    const i = COUNT - 1 - k * 5
    stack[i * 4 + 0] = k * 0.045
    stack[i * 4 + 1] = 0.98 - k * 0.4
    stack[i * 4 + 2] = 0.3 - k * 0.05
    stack[i * 4 + 3] = 0.06 + (STACK - 1 - k) * 0.085
    size[i] = 1.0
    color[i] = k % 2
    kind[i] = 0
  }

  geo.setAttribute('aSeed', new InstancedBufferAttribute(seed, 1))
  geo.setAttribute('aSpeed', new InstancedBufferAttribute(speed, 1))
  geo.setAttribute('aColor', new InstancedBufferAttribute(color, 1))
  geo.setAttribute('aSize', new InstancedBufferAttribute(size, 1))
  geo.setAttribute('aLane', new InstancedBufferAttribute(lane, 2))
  geo.setAttribute('aStack', new InstancedBufferAttribute(stack, 4))
  geo.setAttribute('aKind', new InstancedBufferAttribute(kind, 1))

  const uniforms = {
    uTime: { value: 0 },
    uOrder: { value: 0 },
    uFlow: { value: 1 },
    uXScale: { value: mobile ? 0.62 : 1.0 },
    uStackScale: { value: mobile ? 1.35 : 1.7 },
    uStackOrigin: { value: new Vector3(mobile ? 0 : 2.6, mobile ? -2.15 : 0.0, 0) },
    uPalette: { value: HOT },
    uPaper: { value: new Color('#F5F2EB') },
    uInk: { value: new Color('#1C1917') },
    uAccent: { value: new Color('#6B9E6F') },
  }
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, uniforms,
    transparent: true, depthWrite: false, depthTest: false, side: DoubleSide,
    blending: NormalBlending,
  })
  const mesh = new Mesh(geo, mat)
  mesh.frustumCulled = false
  scene.add(mesh)

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  let order = 0, orderTarget = 0
  let running = false, raf = 0, last = performance.now(), t = 0
  let w = 1, h = 1

  function resize() {
    const rect = canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(rect.width)); h = Math.max(1, Math.round(rect.height))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    uniforms.uXScale.value = camera.aspect < 0.8 ? 0.62 : camera.aspect < 1.2 ? 0.8 : 1.0
    const narrow = camera.aspect < 0.9
    uniforms.uStackOrigin.value.set(narrow ? 0 : 2.6, narrow ? -2.15 : 0.0, 0)
    uniforms.uStackScale.value = narrow ? 1.35 : 1.7
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    t += dt
    order += (orderTarget - order) * Math.min(1, dt * 6)
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4)
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4)
    uniforms.uTime.value = t
    uniforms.uOrder.value = order
    uniforms.uFlow.value = 1 - order * 0.985
    camera.position.x = pointer.x * 0.45
    camera.position.y = pointer.y * 0.3
    camera.lookAt(0, 0, -12)
    renderer.render(scene, camera)
    if (running) raf = requestAnimationFrame(frame)
  }

  const api = {
    setOrder(v) { orderTarget = Math.max(0, Math.min(1, v)); if (reduced) { order = orderTarget; renderOnce() } },
    setPointer(nx, ny) { pointer.tx = nx; pointer.ty = ny },
    start() { if (running || reduced) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame) },
    stop() { running = false; cancelAnimationFrame(raf) },
    resize,
    dispose() { api.stop(); geo.dispose(); mat.dispose(); renderer.dispose() },
  }
  function renderOnce() { uniforms.uTime.value = 3.2; uniforms.uOrder.value = order; uniforms.uFlow.value = 1 - order * 0.985; renderer.render(scene, camera) }

  resize()
  if (reduced) { order = orderTarget = 1; renderOnce() }
  return api
}
