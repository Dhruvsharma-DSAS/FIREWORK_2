import * as THREE from "/three.module.js";
import { RoomEnvironment } from "/RoomEnvironment.js";

function loadTex(url) {
  return new Promise((res) => new THREE.TextureLoader().load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }));
}

function llToVec(lat, lon, r) {
  const phi = (90 - lat) * Math.PI / 180;
  const th = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

function panelTexture() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 1024;
  const g = c.getContext("2d");
  g.fillStyle = "#0a1022"; g.fillRect(0, 0, 512, 1024);
  const cols = 8, rows = 16, pad = 3;
  const cw = 512 / cols, ch = 1024 / rows;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const x = i * cw + pad, y = j * ch + pad, w = cw - 2 * pad, h = ch - 2 * pad;
    const gr = g.createLinearGradient(x, y, x + w, y + h);
    const k = 0.85 + 0.3 * Math.random();
    gr.addColorStop(0, `rgb(${18 * k},${32 * k},${78 * k})`);
    gr.addColorStop(0.55, `rgb(${30 * k},${52 * k},${120 * k})`);
    gr.addColorStop(1, `rgb(${14 * k},${24 * k},${60 * k})`);
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    g.strokeStyle = "rgba(160,190,255,0.10)"; g.lineWidth = 1;
    for (let s = 1; s < 4; s++) { g.beginPath(); g.moveTo(x, y + s * h / 4); g.lineTo(x + w, y + s * h / 4); g.stroke(); }
  }
  g.strokeStyle = "#b9c3d6"; g.lineWidth = 3;
  for (let i = 0; i <= cols; i++) { g.beginPath(); g.moveTo(i * cw, 0); g.lineTo(i * cw, 1024); g.stroke(); }
  for (let j = 0; j <= rows; j += 4) { g.beginPath(); g.moveTo(0, j * ch); g.lineTo(512, j * ch); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function foilTexture() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#b8862a"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 6 + Math.random() * 40;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    const l = Math.random();
    gr.addColorStop(0, l > 0.5 ? "rgba(255,226,140,0.35)" : "rgba(90,55,10,0.35)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  g.strokeStyle = "rgba(60,35,5,0.5)"; g.lineWidth = 2;
  for (let i = 0; i < 30; i++) { g.beginPath(); g.moveTo(Math.random() * 512, 0); g.bezierCurveTo(Math.random() * 512, 170, Math.random() * 512, 340, Math.random() * 512, 512); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function buildSatellite(opts) {
  const sat = new THREE.Group();
  const foil = new THREE.MeshStandardMaterial({ map: foilTexture(), metalness: 0.9, roughness: 0.32 });
  const white = new THREE.MeshStandardMaterial({ color: 0xd9dde6, metalness: 0.3, roughness: 0.45 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a2f3a, metalness: 0.6, roughness: 0.4 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x9aa3b2, metalness: 0.95, roughness: 0.25 });
  const panelMat = new THREE.MeshStandardMaterial({ map: panelTexture(), metalness: 0.55, roughness: 0.28, side: THREE.DoubleSide });
  const backMat = new THREE.MeshStandardMaterial({ color: 0xc9ccd3, metalness: 0.4, roughness: 0.6 });

  const bus = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 2.2), foil); sat.add(bus);
  const bus2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 1.2), foil); bus2.position.set(0, 0.95, 0.3); sat.add(bus2);
  const star = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.35, 20), white); star.position.set(-0.4, 1.4, 0.6); star.rotation.z = 0.5; sat.add(star);
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.12, 2.25), dark); top.position.y = 0.6; sat.add(top);
  const inst = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.9), white); inst.position.set(0, -0.8, 0.4); sat.add(inst);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.25, 32), dark); lens.position.set(0, -1.15, 0.4); sat.add(lens);
  const rad = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.9, 1.6), white); rad.position.set(-0.75, 0, -0.1); sat.add(rad);
  for (let i = 0; i < 6; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.85, 0.04), dark); f.position.set(-0.79, 0, -0.8 + i * 0.28); sat.add(f); }
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.55, 40, 16, 0, Math.PI * 2, 0, Math.PI / 3.2), white);
  dish.material = white.clone(); dish.material.side = THREE.DoubleSide;
  dish.rotation.x = Math.PI; dish.position.set(0.2, 1.35, -0.6); sat.add(dish);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 12), steel); mast.position.set(0.2, 0.95, -0.6); sat.add(mast);
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6, 8), steel); ant.position.set(0.5, 0.2, 1.6); ant.rotation.x = Math.PI / 2.4; sat.add(ant);

  function wing(sign) {
    const w = new THREE.Group();
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 12), steel);
    boom.rotation.z = Math.PI / 2; boom.position.x = sign * 1.3; w.add(boom);
    for (let k = 0; k < 4; k++) {
      const pw = 1.9, ph = 3.8, gap = 0.08;
      const x = sign * (2.0 + pw / 2 + k * (pw + gap));
      const p = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), panelMat);
      p.rotation.x = -Math.PI / 2; p.position.set(x, 0, 0); w.add(p);
      const b = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), backMat);
      b.rotation.x = Math.PI / 2; b.position.set(x, -0.012, 0); w.add(b);
      const fr = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.05, 0.05, 0.05), steel); fr.position.set(x, 0, ph / 2); w.add(fr);
      const fr2 = fr.clone(); fr2.position.z = -ph / 2; w.add(fr2);
    }
    const spar = new THREE.Mesh(new THREE.BoxGeometry(4 * 1.98, 0.05, 0.06), steel);
    spar.position.set(sign * (2.0 + 2 * 1.98 - 0.04), 0.03, 0); w.add(spar);
    return w;
  }
  const wl = wing(-1), wr = wing(1);
  wl.rotation.x = opts && opts.tilt ? opts.tilt : 0.25; wr.rotation.x = wl.rotation.x;
  sat.add(wl); sat.add(wr);
  return sat;
}

const earthVS = `
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){ vUv=uv; vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`;
const earthFS = `
uniform sampler2D day; uniform sampler2D night; uniform sampler2D clouds; uniform sampler2D water; uniform vec3 sun; uniform float nightBoost; uniform float dayGain; uniform vec3 camPos;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){
  vec3 n=normalize(vN); float d=dot(n,normalize(sun));
  float k=smoothstep(-0.18,0.22,d);
  vec3 dc=texture2D(day,vUv).rgb*dayGain;
  vec3 nc=texture2D(night,vUv).rgb; float lt=texture2D(night,vUv).r; nc=vec3(1.0,0.62,0.28)*lt*nightBoost*0.5+vec3(1.0,0.88,0.65)*pow(lt,2.)*nightBoost*0.8;
  float cl=texture2D(clouds,vUv).r;
  vec3 v=normalize(camPos-vW);
  float wm=texture2D(water,vUv).r;
  vec3 h=normalize(normalize(sun)+v); float spec=pow(max(dot(n,h),0.),60.)*wm*0.9*k;
  vec3 dayc=mix(dc,vec3(1.),cl*0.85)*(0.25+0.75*max(d,0.))+vec3(1.0,0.92,0.8)*spec;
  vec3 nightc=nc*(1.-cl*0.5)+dc*0.006+cl*vec3(0.006,0.009,0.02);
  vec3 col=mix(nightc,dayc,k);
  float twi=exp(-pow(d*6.,2.)); col+=vec3(0.9,0.38,0.12)*twi*0.04*k;
  float fr=pow(1.-max(dot(n,v),0.),5.0);
  col+=vec3(0.30,0.55,1.0)*fr*(0.04+0.96*smoothstep(-0.25,0.4,d))*0.8;
  gl_FragColor=vec4(col,1.);
  #include <colorspace_fragment>
}`;
const atmoFS = `
uniform vec3 sun; uniform vec3 camPos; uniform float uPow; varying vec3 vN; varying vec3 vW; varying vec2 vUv;
void main(){ vec3 n=normalize(vN); vec3 v=normalize(camPos-vW); float r=1.-abs(dot(n,v)); float a=pow(r,uPow); float s=smoothstep(-0.45,0.5,dot(n,normalize(sun)));
 vec3 c=mix(vec3(0.12,0.25,0.65),vec3(0.45,0.72,1.0),s); gl_FragColor=vec4(c*a*(0.25+1.3*s),a*(0.35+0.9*s)); }`;

export async function scene(canvas, o) {
  const W = o.w, H = o.h;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(o.dpr || 2); renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposure || 1.1;
  const sc = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer); const envTex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(o.fov || 30, W / H, 0.1, 2000);
  const [day, night, clouds, water] = await Promise.all(["/tex/earth-blue-marble.jpg", "/tex/lights.png", "/tex/clouds_a.jpg", "/tex/earth-water.png"].map(loadTex));
  const sun = new THREE.Vector3(...(o.sun || [-1, 0.3, 0.4])).normalize();
  const earth = new THREE.Mesh(new THREE.SphereGeometry(10, 192, 128), new THREE.ShaderMaterial({
    uniforms: { day: { value: day }, night: { value: night }, clouds: { value: clouds }, water: { value: water }, sun: { value: sun }, nightBoost: { value: o.nightBoost || 2.4 }, dayGain: { value: o.dayGain || 1.0 }, camPos: { value: new THREE.Vector3() } },
    vertexShader: earthVS, fragmentShader: earthFS }));
  sc.add(earth);
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(10.35, 128, 96), new THREE.ShaderMaterial({
    uniforms: { sun: { value: sun }, camPos: { value: new THREE.Vector3() }, uPow: { value: 2.2 } }, vertexShader: earthVS, fragmentShader: atmoFS,
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false }));
  sc.add(atmo);
  const atmo2 = new THREE.Mesh(new THREE.SphereGeometry(10.06, 128, 96), new THREE.ShaderMaterial({
    uniforms: { sun: { value: sun }, camPos: { value: new THREE.Vector3() }, uPow: { value: 7.0 } }, vertexShader: earthVS, fragmentShader: atmoFS,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  sc.add(atmo2);

  const stars = new THREE.BufferGeometry(); const sp = [];
  for (let i = 0; i < 4000; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(600 + Math.random() * 300); sp.push(v.x, v.y, v.z); }
  stars.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
  sc.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xaab8d8, size: 0.9, sizeAttenuation: false, transparent: true, opacity: 0.7 })));

  if (o.fires) {
    const g = new THREE.BufferGeometry(); const p = []; const c = [];
    const col = new THREE.Color();
    for (const f of o.fires) { const v = llToVec(f[0], f[1], 10.03); p.push(v.x, v.y, v.z); col.set(f[2] || "#ff6a3d"); c.push(col.r, col.g, col.b); }
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));
    const spr = document.createElement("canvas"); spr.width = spr.height = 64; const sg = spr.getContext("2d");
    const rg = sg.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, "rgba(255,255,255,1)"); rg.addColorStop(0.25, "rgba(255,255,255,0.8)"); rg.addColorStop(1, "rgba(255,255,255,0)");
    sg.fillStyle = rg; sg.fillRect(0, 0, 64, 64);
    sc.add(new THREE.Points(g, new THREE.PointsMaterial({ size: o.fireSize || 0.16, map: new THREE.CanvasTexture(spr), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
  }
  if (o.orbits) {
    for (const ob of o.orbits) {
      const pts = []; const inc = ob.inc * Math.PI / 180; const r = 10 + ob.alt;
      for (let i = 0; i <= 360; i++) { const a = i * Math.PI / 180; pts.push(new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a)).applyAxisAngle(new THREE.Vector3(1, 0, 0), inc).applyAxisAngle(new THREE.Vector3(0, 1, 0), (ob.raan || 0) * Math.PI / 180)); }
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: ob.color, dashSize: 0.3, gapSize: 0.18, transparent: true, opacity: ob.opacity || 0.6 }));
      l.computeLineDistances(); sc.add(l);
    }
  }
  sc.add(new THREE.AmbientLight(0x223355, 0.35));
  const dl = new THREE.DirectionalLight(0xfff4e0, 3.2); dl.position.copy(sun).multiplyScalar(100); sc.add(dl);
  const fill = new THREE.DirectionalLight(0xffe2b0, o.fill || 1.6); fill.position.copy(cam.position).add(new THREE.Vector3(0, 10, 0)); sc.add(fill); fill.userData.cam = true;
  const rim = new THREE.DirectionalLight(0x4a7dff, 0.8); rim.position.set(0, -50, -30); sc.add(rim);
  if (o.sat) {
    const sat = buildSatellite(o.sat); sat.scale.setScalar(o.sat.scale || 0.18);
    sat.position.set(...o.sat.pos); sat.rotation.set(...o.sat.rot); sc.add(sat);
    if (o.sat.swath) {
      const s = o.sat.swath; const m = new THREE.Mesh(new THREE.ConeGeometry(s.r, s.h, 48, 1, true), new THREE.MeshBasicMaterial({ color: 0xffb547, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
      m.position.set(...s.pos); m.lookAt(new THREE.Vector3(...o.sat.pos)); m.rotateX(-Math.PI / 2); sc.add(m);
    }
  }
  const look = new THREE.Vector3(...(o.look || [0, 0, 0]));
  const eye = o.camLL ? llToVec(o.camLL[0], o.camLL[1], o.camDist || 34) : new THREE.Vector3(...o.cam);
  cam.position.copy(eye); cam.lookAt(look);
  if (o.roll) cam.rotateZ(o.roll);
  if (o.shift) cam.setViewOffset(W, H, o.shift[0], o.shift[1], W, H);
  cam.updateMatrixWorld(true);
  if (o.sunCam) { sun.copy(new THREE.Vector3(...o.sunCam).applyQuaternion(cam.quaternion).normalize()); dl.position.copy(sun).multiplyScalar(100); }
  const sp2 = sun.clone().multiplyScalar(500).project(cam); window.SUN_SCREEN = [(sp2.x + 1) / 2 * W, (1 - sp2.y) / 2 * H];
  const ec = new THREE.Vector3(0,0,0).project(cam); window.EARTH_SCREEN = [(ec.x + 1) / 2 * W, (1 - ec.y) / 2 * H];
  sc.traverse((n) => { if (n.userData && n.userData.cam) { n.position.copy(eye).multiplyScalar(3).add(new THREE.Vector3(0, 20, 0)); } });
  const sats = [];
  if (o.satCam) {
    for (const sd of o.satCam) {
      const sat = buildSatellite(sd); sat.scale.setScalar(sd.scale || 1);
      sat.position.copy(cam.localToWorld(new THREE.Vector3(...sd.at)));
      sat.traverse((m) => { if (m.material) { m.material.envMap = envTex; m.material.envMapIntensity = sd.env || 0.6; m.material.needsUpdate = true; } });
      sat.quaternion.copy(cam.quaternion).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(...sd.rot)));
      sc.add(sat); sats.push({ sat, sd });
    }
  }
  earth.material.uniforms.camPos.value.copy(eye); atmo.material.uniforms.camPos.value.copy(eye); atmo2.material.uniforms.camPos.value.copy(eye);
  earth.rotation.y = o.spin || 0;
  renderer.render(sc, cam);
  function place(i, at, rot) {
    const S = sats[i]; S.sat.position.copy(cam.localToWorld(new THREE.Vector3(...at)));
    S.sat.quaternion.copy(cam.quaternion).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)));
  }
  return { llToVec, renderer, sc, cam, sats, place, render: () => renderer.render(sc, cam) };
}
export { llToVec };
