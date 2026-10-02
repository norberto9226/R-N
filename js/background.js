/* =========================================================
   FONDO: estrellas y corazones flotando
   ========================================================= */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let W, H, DPR;
const colores = ["217,119,54","233,176,76","178,74,40","196,100,47","253,243,227","140,52,38"];
let corazones = [], estrellas = [], rafagas = [];

function ajustar(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.clientWidth; H = canvas.clientHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  estrellas = Array.from({length: reduce ? 40 : 90}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    r: Math.random()*1.3+.3, f: Math.random()*6.28, v: Math.random()*.02+.005
  }));
}

function dibujarCorazon(x,y,s){
  ctx.beginPath();
  ctx.moveTo(x, y + s/4);
  ctx.bezierCurveTo(x, y, x - s/2, y, x - s/2, y + s/4);
  ctx.bezierCurveTo(x - s/2, y + s/2, x, y + s*.75, x, y + s);
  ctx.bezierCurveTo(x, y + s*.75, x + s/2, y + s/2, x + s/2, y + s/4);
  ctx.bezierCurveTo(x + s/2, y, x, y, x, y + s/4);
  ctx.closePath();
}

function nuevoCorazon(inicial){
  return {
    x: Math.random()*W,
    y: inicial ? Math.random()*H : H + 30,
    s: Math.random()*22 + 8,
    vy: Math.random()*.5 + .25,
    fase: Math.random()*6.28,
    amp: Math.random()*22 + 8,
    a: Math.random()*.4 + .12,
    c: colores[(Math.random()*colores.length)|0],
    rot: (Math.random()-.5)*.6
  };
}

function explosion(n = 46){
  const cx = W/2, cy = H/2;
  for(let i=0;i<n;i++){
    const ang = Math.random()*Math.PI*2, vel = Math.random()*5 + 2;
    rafagas.push({
      x: cx, y: cy, vx: Math.cos(ang)*vel, vy: Math.sin(ang)*vel - 2,
      s: Math.random()*18 + 10, vida: 1, c: colores[(Math.random()*4)|0]
    });
  }
}

function bucle(t){
  ctx.clearRect(0,0,W,H);

  for(const e of estrellas){
    e.f += e.v;
    ctx.fillStyle = `rgba(253,243,227,${.25 + Math.sin(e.f)*.25})`;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.28); ctx.fill();
  }

  for(const h of corazones){
    h.y -= h.vy;
    const x = h.x + Math.sin(h.fase + t/1600) * h.amp;
    ctx.save();
    ctx.translate(x, h.y); ctx.rotate(h.rot * Math.sin(h.fase + t/2200));
    ctx.fillStyle = `rgba(${h.c},${h.a})`;
    dibujarCorazon(0,0,h.s); ctx.fill();
    ctx.restore();
    if(h.y < -40) Object.assign(h, nuevoCorazon(false));
  }

  for(let i=rafagas.length-1;i>=0;i--){
    const r = rafagas[i];
    r.x += r.vx; r.y += r.vy; r.vy += .09; r.vx *= .985; r.vida -= .008;
    if(r.vida <= 0){ rafagas.splice(i,1); continue; }
    ctx.fillStyle = `rgba(${r.c},${r.vida})`;
    dibujarCorazon(r.x, r.y, r.s*(.5 + r.vida/2)); ctx.fill();
  }
  requestAnimationFrame(bucle);
}

ajustar();
corazones = Array.from({length: reduce ? 8 : 26}, () => nuevoCorazon(true));
addEventListener("resize", ajustar);
requestAnimationFrame(bucle);
