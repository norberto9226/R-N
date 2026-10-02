/* =========================================================
   SOBRE Y CARTA
   ========================================================= */
const $ = id => document.getElementById(id);
const envelope = $("envelope"), envWrap = $("envWrap"), carta = $("carta");
const texto = $("texto"), firma = $("firma"), pie = $("pie");
const cartaWrap = $("cartaWrap"), velo = $("velo"), mini = document.querySelector(".mini-carta");
let abierto = false, saltar = false, token = 0;

$("direccion").textContent = "Para " + CONFIG.ella;
$("titulo").textContent = "Para " + CONFIG.ella;
firma.textContent = "Con todo mi cariño, " + CONFIG.el;

const esperar = ms => new Promise(r => setTimeout(r, ms));

function textoDias(){
  const ini = new Date(CONFIG.fechaInicio + "T00:00:00");
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const d = Math.max(0, Math.round((hoy - ini) / 86400000));
  if(d === 0) return "<b>Hoy</b> empieza nuestra historia";
  if(d === 1) return "Llevamos <b>1</b> día juntos";
  return "Llevamos <b>" + d + "</b> días juntos";
}

function preparar(){
  texto.innerHTML = "";
  return CONFIG.mensaje.map(l => {
    const p = document.createElement("p");
    const hecho = document.createElement("span");
    const resto = document.createElement("span");
    resto.style.visibility = "hidden";   // reserva el espacio para que la hoja no "salte"
    resto.textContent = l;
    p.append(hecho, resto);
    texto.appendChild(p);
    return {p, hecho, resto, l};
  });
}

async function escribir(mi, lineas){
  for(const {p, hecho, resto, l} of lineas){
    if(mi !== token) return;
    if(reduce || saltar){ hecho.textContent = l; resto.textContent = ""; continue; }
    p.classList.add("escribiendo");
    for(let i = 1; i <= l.length; i++){
      if(mi !== token) return;
      if(saltar){ hecho.textContent = l; resto.textContent = ""; break; }
      hecho.textContent = l.slice(0, i);
      resto.textContent = l.slice(i);
      const ch = l[i - 1];
      await esperar(ch === "," || ch === "." ? 220 : 32);
    }
    p.classList.remove("escribiendo");
    p.classList.add("visible");
    await esperar(reduce || saltar ? 0 : 350);
  }
  if(mi !== token) return;
  firma.classList.add("visible");
  await esperar(500);
  if(mi !== token) return;
  pie.classList.add("visible");
  explosion(30);
}

/* La hoja pequeña que sale del sobre se convierte en la carta:
   misma posición y tamaño de partida, y se despliega hasta el centro. */
function transicion(){
  const de = mini.getBoundingClientRect();
  cartaWrap.classList.add("visible");
  carta.getAnimations().forEach(a => a.cancel());
  const a = carta.getBoundingClientRect();
  const s = de.width / a.width;
  const dx = (de.left + de.width / 2) - (a.left + a.width / 2);
  const dy = de.top - a.top;
  const corte = Math.max(0, a.height - de.height / s);
  mini.style.opacity = "0";
  if(reduce) return;
  carta.animate([
    { transform:`translate(${dx}px, ${dy}px) scale(${s})`, clipPath:`inset(0 0 ${corte}px 0 round 4px)` },
    { transform:"translate(0, 0) scale(1)", clipPath:"inset(0 0 0px 0 round 6px)" }
  ], { duration:1400, easing:"cubic-bezier(.22,1,.36,1)", fill:"backwards" });
}

async function abrir(){
  if(abierto) return;
  abierto = true; saltar = false;
  const mi = ++token;
  musica.iniciar();
  musica.activar();
  const lineas = preparar();
  $("dias").innerHTML = textoDias();
  envelope.classList.add("open");
  $("pista").style.animation = "none";
  $("pista").style.opacity = 0;
  explosion(26);
  await esperar(reduce ? 200 : 1800);     // la hoja termina de salir del sobre
  if(mi !== token) return;
  transicion();
  velo.classList.add("on");
  envWrap.classList.add("away");
  explosion(20);
  await esperar(reduce ? 100 : 1000);
  escribir(mi, lineas);
}

function reiniciar(){
  if(!abierto) return;
  token++;
  abierto = false;
  velo.classList.remove("on");
  firma.classList.remove("visible");
  pie.classList.remove("visible");
  const salida = carta.animate([
    { opacity:1, transform:"translateY(0) scale(1)" },
    { opacity:0, transform:"translateY(28px) scale(.96)" }
  ], { duration:reduce ? 10 : 600, easing:"cubic-bezier(.4,0,.2,1)", fill:"forwards" });
  salida.onfinish = () => {
    salida.cancel();
    cartaWrap.classList.remove("visible");
    texto.innerHTML = "";
    mini.style.opacity = "";
    envelope.classList.remove("open");
    envWrap.classList.remove("away");
    $("pista").style.opacity = "";
    $("pista").style.animation = "";
  };
}

envelope.addEventListener("click", abrir);
$("releer").addEventListener("click", reiniciar);
texto.addEventListener("click", () => { saltar = true; });

// La música intenta empezar en cuanto carga la página (ver music.js)
musica.iniciar();
