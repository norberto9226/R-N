/* =========================================================
   MÚSICA: melodía romántica original (Web Audio) o tu mp3
   ========================================================= */
const musica = (() => {
  const btn = document.getElementById("btnMusica");
  let ctxA, master, timer, sig = 0, compas = 0, silencio = false, iniciada = false, audioEl = null;

  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const BPM = 66, CORCHEA = 60 / BPM / 2;

  // Cada compás: arpegio (4 notas) + melodía [nota, corchea de inicio, duración en corcheas]
  const COMPASES = [
    { a:[48,55,60,64], m:[[76,0,4],[74,4,2],[72,6,2]] },            // Do
    { a:[45,52,57,60], m:[[69,0,2],[72,2,2],[76,4,4]] },            // La menor
    { a:[41,48,53,57], m:[[77,0,3],[76,3,1],[72,4,4]] },            // Fa
    { a:[43,50,55,59], m:[[74,0,2],[71,2,2],[67,4,4]] },            // Sol
    { a:[45,52,57,60], m:[[72,0,2],[71,2,1],[69,3,1],[72,4,4]] },   // La menor
    { a:[41,48,53,57], m:[[69,0,2],[72,2,2],[77,4,4]] },            // Fa
    { a:[48,55,60,64], m:[[76,0,3],[79,3,1],[76,4,4]] },            // Do
    { a:[43,50,55,59], m:[[74,0,4],[71,4,2],[74,6,2]] }             // Sol
  ];
  const PATRON = [0,1,2,3,2,1,2,1];

  function nota(midi, t, dur, vol){
    const o = ctxA.createOscillator(), o2 = ctxA.createOscillator(), g = ctxA.createGain();
    o.type = "triangle"; o2.type = "sine";
    o.frequency.value = hz(midi); o2.frequency.value = hz(midi) * 2;
    const g2 = ctxA.createGain(); g2.gain.value = .25;
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o2.start(t); o.stop(t + dur + .05); o2.stop(t + dur + .05);
  }

  function programar(){
    while(sig < ctxA.currentTime + 1.2){
      const c = COMPASES[compas % COMPASES.length];
      PATRON.forEach((idx, i) => {
        const t = sig + i * CORCHEA;
        nota(c.a[idx], t, i === 0 ? 2.6 : 1.1, i === 0 ? .16 : .09);
      });
      c.m.forEach(([n, ini, len]) => nota(n, sig + ini * CORCHEA, len * CORCHEA * 1.5, .13));
      sig += 8 * CORCHEA;
      compas++;
    }
  }

  function iniciarSintetica(){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return false;
    ctxA = new AC();
    master = ctxA.createGain();
    master.gain.setValueAtTime(0.0001, ctxA.currentTime);
    master.gain.exponentialRampToValueAtTime(.7, ctxA.currentTime + 3);   // entrada suave

    // eco suave para dar sensación de sala
    const delay = ctxA.createDelay(); delay.delayTime.value = .32;
    const fb = ctxA.createGain(); fb.gain.value = .38;
    const lp = ctxA.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2400;
    master.connect(ctxA.destination);
    master.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(ctxA.destination);

    sig = ctxA.currentTime + .2;
    programar();
    timer = setInterval(programar, 250);
    return true;
  }

  function iniciarArchivo(){
    if(audioEl) return true;
    audioEl = new Audio(CONFIG.cancion);
    audioEl.loop = true; audioEl.volume = .6; audioEl.preload = "auto";
    return true;
  }

  function aplicarSilencio(){
    btn.classList.toggle("off", silencio);
    btn.setAttribute("aria-pressed", String(silencio));
    btn.setAttribute("aria-label", silencio ? "Activar la música" : "Silenciar la música");
    if(audioEl) audioEl.muted = silencio;
    if(master){
      master.gain.cancelScheduledValues(ctxA.currentTime);
      master.gain.setTargetAtTime(silencio ? 0.0001 : .7, ctxA.currentTime, .15);
    }
  }

  async function activar(){
    if(!iniciada) iniciar();
    try{
      if(ctxA) await ctxA.resume();
      if(audioEl && !silencio) await audioEl.play();
    }catch(e){
      // El navegador puede rechazar el primer intento; otro gesto podrá reintentarlo.
    }
  }

  btn.addEventListener("click", async () => { silencio = !silencio; aplicarSilencio(); if(!silencio) await activar(); });

  document.addEventListener("visibilitychange", () => {
    if(ctxA){ document.hidden ? ctxA.suspend() : ctxA.resume(); }
    if(audioEl){ document.hidden ? audioEl.pause() : (!silencio && audioEl.play().catch(() => {})); }
  });

  return {
    iniciar(){
      if(iniciada) return;
      iniciada = true;
      const ok = CONFIG.cancion ? iniciarArchivo() : iniciarSintetica();
      if(!ok) return;
      btn.classList.add("activa");
    },
    activar
  };
})();
