/* Explore Tours Transfer — comportamento do site */
/* ============================================================
   PREÇOS — fonte única. Tabela, mapa, frota e formulário leem
   daqui. Para mudar um valor, mude só aqui.
   Privativo: [Sedã, T-Cross, Spin]  (null = a combinar)
   ============================================================ */
const NIGHT_FEE = 150;
const PRICES_PRIVATIVO = {
  'São Luís|Barreirinhas':     [850,  850,  950],
  'São Luís|Santo Amaro':      [950,  950,  1050],
  'São Luís|Tutóia':           [null, 1350, 1450],
  'São Luís|Jericoacoara':     [2850, 2850, 3050],
  'Santo Amaro|Barreirinhas':  [null, 750,  750],
  'Barreirinhas|Atins':        [null, 500,  530],
  'Barreirinhas|Tutóia':       [null, 850,  850],
  'Barreirinhas|Luís Correia': [null, 1250, 1350],
  'Barreirinhas|Jericoacoara': [null, 2050, 2050],
  'Santo Amaro|Parnaíba':      [null, 1350, 1450],
};
PRICES_PRIVATIVO['Barreirinhas|São Luís']    = PRICES_PRIVATIVO['São Luís|Barreirinhas'];
PRICES_PRIVATIVO['Santo Amaro|São Luís']     = PRICES_PRIVATIVO['São Luís|Santo Amaro'];
PRICES_PRIVATIVO['Barreirinhas|Santo Amaro'] = PRICES_PRIVATIVO['Santo Amaro|Barreirinhas'];

const PRICES_COMPARTILHADO = {   // por pessoa
  'São Luís|Barreirinhas': 320, 'Barreirinhas|São Luís': 320,
  'São Luís|Santo Amaro':  340, 'Santo Amaro|São Luís':  340,
};
const VEH_INDEX = { 'Sedã':0, 'T-Cross':1, 'Spin':2 };
const VEH_NAME  = { 'Sedã':'Sedã', 'T-Cross':'Volkswagen T-Cross', 'Spin':'Chevrolet Spin' };
const brl = v => 'R$ ' + v.toLocaleString('pt-BR');
const fromPrice = key => Math.min(...PRICES_PRIVATIVO[key].filter(v => v != null));

/* ===== TABELA ===== */
const TABLE_ROWS = [
  ['São Luís|Barreirinhas','São Luís / Aeroporto e Barreirinhas','ida ou volta'],
  ['São Luís|Santo Amaro','São Luís / Aeroporto e Santo Amaro','ida ou volta'],
  ['São Luís|Tutóia','São Luís e Tutóia'],
  ['São Luís|Jericoacoara','São Luís e Jericoacoara'],
  ['Santo Amaro|Barreirinhas','Santo Amaro e Barreirinhas','ida ou volta'],
  ['Barreirinhas|Atins','Barreirinhas e Atins'],
  ['Barreirinhas|Tutóia','Barreirinhas e Tutóia'],
  ['Barreirinhas|Luís Correia','Barreirinhas e Luís Correia / Parnaíba'],
  ['Barreirinhas|Jericoacoara','Barreirinhas e Jericoacoara'],
  ['Santo Amaro|Parnaíba','Santo Amaro e Parnaíba'],
];
document.getElementById('ptableBody').innerHTML = TABLE_ROWS.map(([k,l,s]) => {
  const p = PRICES_PRIVATIVO[k], names = ['Sedã','T-Cross','Spin'];
  return `<tr><td class="r">${l}${s?`<small>${s}</small>`:''}</td>` + p.map((v,i) =>
    `<td class="v${i===2?' pop':''}${v==null?' na':''}" data-veh="${names[i]}">${v==null?'a combinar':brl(v)}</td>`).join('') + '</tr>';
}).join('');
document.querySelectorAll('[data-shared-price]').forEach(el => el.textContent = brl(PRICES_COMPARTILHADO[el.dataset.sharedPrice]));
document.querySelectorAll('[data-carro]').forEach(el => {
  const i = +el.dataset.carro;
  el.textContent = brl(PRICES_PRIVATIVO['São Luís|Barreirinhas'][i]);
});

/* ===== MAPA DA ROTA ===== */
const STOPS = [
  { id:'sl', nome:'São Luís', uf:'MA', x:70, y:190, foto:'img/sao-luis.jpg', alt:'Centro histórico de São Luís',
    desc:'A capital e o aeroporto (SLZ). Buscamos no desembarque ou no seu hotel e seguimos para qualquer ponto da rota.',
    trechos:[['São Luís|Barreirinhas','Aeroporto São Luís até Barreirinhas','4 horas, 280 km'],['São Luís|Santo Amaro','Aeroporto São Luís até Santo Amaro','3h30, 260 km'],['São Luís|Tutóia','Aeroporto São Luís até Tutóia',''],['São Luís|Jericoacoara','Aeroporto São Luís até Jericoacoara','']],
    ver:[['Centro Histórico','Patrimônio Mundial da UNESCO, com casarões cobertos de azulejos portugueses.'],['Teatro Arthur Azevedo','Um dos teatros mais antigos do Brasil, no coração do centro.'],['Palácio dos Leões','Sede do governo, com vista para a Baía de São Marcos.'],['Praia do Calhau','Orla urbana para o fim de tarde antes ou depois da viagem.']],
    pos:'cima-esq' },
  { id:'sa', nome:'Santo Amaro', uf:'MA', x:300, y:280, foto:'img/santo-amaro.jpg', alt:'Lagoas de Santo Amaro', baixo:true,
    desc:'A entrada pela face oeste dos Lençóis. Paisagens mais brutas, trilhas exclusivas e lagoas com muito menos gente.',
    trechos:[['São Luís|Santo Amaro','Aeroporto São Luís até Santo Amaro','3h30, 260 km'],['Barreirinhas|Santo Amaro','Barreirinhas até Santo Amaro','2 horas, 120 km'],['Santo Amaro|Parnaíba','Santo Amaro até Parnaíba','']],
    ver:[['Lagoa da Gaivota','Uma das maiores e mais bonitas lagoas dos Lençóis.'],['Lagoa das Andorinhas','Água cristalina no meio das dunas, longe do movimento.'],['Povoado de Betânia','Comunidade à beira do rio, caminho para as lagoas.'],['Ponta Verde e América','Lagoas do lado oeste com muito menos gente.']],
    pos:'dir' },
  { id:'ba', nome:'Barreirinhas', uf:'MA', x:520, y:175, foto:'img/circuito.jpg', alt:'Lagoas e dunas dos Lençóis vistas de cima',
    desc:'A porta de entrada mais conhecida dos Lençóis Maranhenses, de onde saem os passeios para a Lagoa Azul e a Lagoa Bonita.',
    trechos:[['São Luís|Barreirinhas','Aeroporto São Luís até Barreirinhas','4 horas, 280 km'],['Santo Amaro|Barreirinhas','Santo Amaro até Barreirinhas','2 horas, 120 km']],
    ver:[['Lagoa Azul','O circuito clássico em Toyota 4x4, saindo da cidade.'],['Lagoa Bonita','A grande duna de 80 m e o pôr do sol sobre as lagoas.'],['Rio Preguiças','Lancha até Vassouras, Mandacaru e Caburé.'],['Farol de Mandacaru','Vista do alto dos Lençóis e da foz do rio.']],
    pos:'cima-dir' },
  { id:'at', nome:'Atins', uf:'MA', x:640, y:70, foto:'img/atins.jpg', alt:'Lagoa e balanço em Atins', cima:true,
    desc:'O vilarejo mais remoto e preservado dos Lençóis, para quem quer ficar longe das multidões.',
    trechos:[['Barreirinhas|Atins','Barreirinhas até Atins','1h30, 65 km']],
    ver:[['Praia de Atins','Vento constante, um dos pontos de kitesurf mais procurados do Brasil.'],['Canto do Atins','Famoso pelo camarão grelhado servido no meio das dunas.'],['Lagoas sem multidão','O lado leste do parque, mais selvagem e silencioso.'],['Foz do Preguiças','Onde o rio encontra o mar.']],
    pos:'dir' },
  { id:'tu', nome:'Tutóia', uf:'MA', x:780, y:185, foto:'img/tutoia.jpg', alt:'Tutóia vista de cima',
    desc:'Seguimento da Rota das Emoções rumo ao Delta do Parnaíba.',
    trechos:[['Barreirinhas|Tutóia','Barreirinhas até Tutóia','3 horas, 185 km'],['São Luís|Tutóia','Aeroporto São Luís até Tutóia','']],
    ver:[['Porta do Delta','Saída de barco para o Delta do Parnaíba pelo lado maranhense.'],['Pequenos Lençóis','Dunas e lagoas na região de Paulino Neves.'],['Praias de Tutóia','Dunas que encontram o mar.']],
    pos:'cima-esq' },
  { id:'pa', nome:'Parnaíba', uf:'PI', x:1000, y:175, foto:'img/delta.jpg', alt:'Delta do Parnaíba visto de cima',
    desc:'Delta do Parnaíba e Luís Correia, já no litoral do Piauí.',
    trechos:[['Barreirinhas|Luís Correia','Barreirinhas até Luís Correia / Parnaíba',''],['Santo Amaro|Parnaíba','Santo Amaro até Parnaíba','']],
    ver:[['Delta do Parnaíba','O único delta em mar aberto das Américas, com mais de 70 ilhas.'],['Revoada dos guarás','Aves vermelhas voltando aos mangues no fim da tarde.'],['Porto das Barcas','Casarões históricos à beira do rio.'],['Praias de Luís Correia','Litoral piauiense, com a Lagoa do Portinho por perto.']],
    pos:'cima-dir' },
  { id:'je', nome:'Jericoacoara', uf:'CE', x:1140, y:180, foto:'img/jericoacoara.jpg', alt:'Pedra Furada em Jericoacoara',
    desc:'O fim da Rota das Emoções, no Ceará. Uma viagem longa feita de uma vez, com paradas quando você quiser.',
    trechos:[['São Luís|Jericoacoara','Aeroporto São Luís até Jericoacoara',''],['Barreirinhas|Jericoacoara','Barreirinhas até Jericoacoara','']],
    ver:[['Pedra Furada','O cartão-postal de Jeri, esculpido pelo mar.'],['Duna do Pôr do Sol','O fim de tarde mais famoso da vila.'],['Lagoa do Paraíso','Redes dentro da água azul-turquesa.'],['Árvore da Preguiça','Moldada pelo vento, inclinada quase até o chão.']],
    pos:'cima-dir' },
];
const paradasEl = document.getElementById('paradas');
const CARRO_MINI = `<span class="carro-mini" id="carroMini" aria-hidden="true"><svg viewBox="2 8 46 38"><rect x="4" y="26" width="40" height="13" rx="3" fill="#C8900A"/><path d="M12 26 L15 18 Q16 16 18 16 L30 16 Q32 16 33 18 L36 26 Z" fill="#E5A820"/><path d="M18 18 L16.5 24 L22 24 L22 18 Z" fill="rgba(26,18,0,.55)"/><path d="M24 18 L24 24 L31 24 L29.5 18 Z" fill="rgba(26,18,0,.55)"/><circle cx="13" cy="39" r="4.5" fill="#1A1200"/><circle cx="35" cy="39" r="4.5" fill="#1A1200"/><rect x="6" y="13.5" width="36" height="3" rx="1.5" fill="#F5C842" transform="rotate(-4,24,15)"/></svg></span>`;
paradasEl.innerHTML = CARRO_MINI + STOPS.map(s => `<button type="button" class="parada${s.cima?' cima':''}${s.id==='sl'?' ini':''}${s.id==='je'?' fim':''}" style="left:${s.x/12}%;top:${s.y/3.3}%" data-id="${s.id}" aria-pressed="false" onclick="toqueParada('${s.id}')"><span class="pino"></span><span class="nome">${s.nome}</span></button>`).join('');
const PIN = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
function showStop(id, modo){              // modo: 'init' | 'auto' | 'toque'
  const s = STOPS.find(x => x.id === id);
  document.querySelectorAll('.parada').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === id));
  trocaFoto(s);
  const info = document.querySelector('.painel-info'); info.classList.remove('troca'); void info.offsetWidth; if (modo !== 'init') info.classList.add('troca');
  document.getElementById('painelNome').textContent = s.nome;
  document.getElementById('painelDesc').textContent = s.desc;
  document.getElementById('painelVer').innerHTML = s.ver.map(([n, d]) => `<li>${PIN}<div><b>${n}</b><span>${d}</span></div></li>`).join('');
  document.getElementById('painelTrechos').innerHTML = s.trechos.map(([k,t,m]) => `
    <li class="trecho"><div><div class="t">${t}</div>${m?`<div class="m">${m}</div>`:''}</div>
    <div class="v">a partir de<b>${brl(fromPrice(k))}</b></div>
    <button type="button" class="btn btn-escuro" onclick="pickRoute('${k}', true)">Reservar</button></li>`).join('');
  marcaTrilha(id);
  moveMini(id, modo === 'init');
  if (modo !== 'init') rolaFaixa(id);
}
function rolaFaixa(id){
  if (window.innerWidth > 720) return;
  const b = document.querySelector(`.parada[data-id="${id}"]`), m = document.getElementById('mapa');
  if (b) m.scrollTo({ left: b.offsetLeft - m.clientWidth / 2 + b.offsetWidth / 2, behavior: REDUZ ? 'auto' : 'smooth' });
}

/* ----- carrinho pequeno na faixa de cidades (celular) ----- */
let miniEm = 'ba';
function moveMini(id, semAnim){
  const mini = document.getElementById('carroMini'), b = document.querySelector(`.parada[data-id="${id}"]`);
  if (!mini || !b || window.innerWidth > 720) { miniEm = id; return; }
  const ia = ORDEM_FAIXA.indexOf(miniEm), ib = ORDEM_FAIXA.indexOf(id);
  mini.classList.toggle('volta', ib < ia);
  mini.style.transition = semAnim ? 'none' : '';
  mini.style.left = (b.offsetLeft + b.offsetWidth / 2 - 40) + 'px';
  miniEm = id;
}
const ORDEM_FAIXA = ['sl','sa','ba','at','tu','pa','je'];
addEventListener('resize', () => moveMini(miniEm, true));

/* ----- balão com os pontos turísticos ----- */
const POS_BALAO = {
  'cima':     ['translate(-50%, calc(-100% - 36px))', '50% 100%'],
  'cima-esq': ['translate(-34px, calc(-100% - 36px))', '0 100%'],
  'cima-dir': ['translate(calc(-100% + 34px), calc(-100% - 36px))', '100% 100%'],
  'dir':      ['translate(34px, -50%)', '0 50%'],
};
const balao = document.getElementById('balao');
function mostraBalao(id){
  const s = STOPS.find(x => x.id === id), [pos, orig] = POS_BALAO[s.pos];
  balao.classList.remove('on');
  balao.style.left = (s.x / 12) + '%'; balao.style.top = (s.y / 3.3) + '%';
  balao.style.setProperty('--pos', pos); balao.style.setProperty('--orig', orig);
  balao.innerHTML = `<div class="b-top"><b>${s.nome}</b><span class="b-uf">${s.uf}</span></div><ul>${s.ver.slice(0, 3).map(([n]) => `<li>${n}</li>`).join('')}</ul>`;
  void balao.offsetWidth; balao.classList.add('on');
}
function escondeBalao(){ balao.classList.remove('on'); }

/* ----- trilha de progresso no HUD ----- */
const ORDEM = ['sl','sa','ba','at','tu','pa','je'];
document.getElementById('hudTrilha').innerHTML = ORDEM.map(() => '<li></li>').join('');
function marcaTrilha(id){
  const i = ORDEM.indexOf(id);
  document.querySelectorAll('#hudTrilha li').forEach((li, k) => { li.classList.toggle('agora', k === i); li.classList.toggle('feito', k < i); });
}

/* ----- foto do painel com troca suave ----- */
function trocaFoto(s){
  const box = document.getElementById('painelFoto');
  box.querySelectorAll('.sem').forEach(n => n.remove());
  const velhas = [...box.querySelectorAll('img')];
  if (!s.foto){ velhas.forEach(v => v.remove()); box.insertAdjacentHTML('beforeend', `<div class="sem"><span>${s.nome}, ${s.uf}</span></div>`); return; }
  const img = new Image(); img.src = s.foto.replace(/\.jpg$/, '.webp'); img.alt = s.alt; img.className = 'nova'; img.width = 800; img.height = 600;
  box.appendChild(img);
  const mostra = () => requestAnimationFrame(() => { img.classList.remove('nova'); setTimeout(() => velhas.forEach(v => v.remove()), 520); });
  img.complete ? mostra() : (img.onload = mostra, img.onerror = mostra);
}

/* ----- carrinho que percorre a estrada até a cidade escolhida ----- */
const REDUZ = matchMedia('(prefers-reduced-motion: reduce)').matches;
const carro = document.getElementById('carro'), mapa = document.getElementById('mapa');
const PATHS = { main: document.getElementById('road'), sa: document.getElementById('ramalSA'), at: document.getElementById('ramalAT') };
function maisPerto(path, x, y){
  // busca grossa e depois refinada: ~60 medições em vez de ~800
  const L = path.getTotalLength(), dist = l => { const p = path.getPointAtLength(l); return (p.x-x)**2 + (p.y-y)**2; };
  let best = 0, bd = Infinity;
  for (let l = 0; l <= L; l += 40){ const d = dist(l); if (d < bd){ bd = d; best = l; } }
  for (let passo = 20; passo >= 0.5; passo /= 2){
    for (const l of [best - passo, best + passo]){ if (l < 0 || l > L) continue; const d = dist(l); if (d < bd){ bd = d; best = l; } }
  }
  return best;
}
let J = {}, POS = {}, MAPA_OK = true;
try {
J = { sa: maisPerto(PATHS.main, 330, 190), at: maisPerto(PATHS.main, 520, 175) };
STOPS.forEach(s => {
  if (s.id === 'sa') POS.sa = { p:'sa', l: PATHS.sa.getTotalLength() };
  else if (s.id === 'at') POS.at = { p:'at', l: PATHS.at.getTotalLength() };
  else POS[s.id] = { p:'main', l: maisPerto(PATHS.main, s.x, s.y) };
});
} catch(e){ MAPA_OK = false; }
let carroEm = 'ba', carroPos = null, viagem = null;
const PARA_ANTES = 40; // o carro estaciona um pouco antes do pino
function poe(path, l, dir){
  const L = path.getTotalLength(), c = x => Math.max(0, Math.min(L, x));
  const a = path.getPointAtLength(c(l));
  // direção: um pouco à frente; no fim da estrada, olha para trás
  let p1 = a, p2 = path.getPointAtLength(c(l + 3 * dir));
  if (Math.hypot(p2.x - a.x, p2.y - a.y) < .5){ p1 = path.getPointAtLength(c(l - 3 * dir)); p2 = a; }
  const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  const vira = Math.cos(ang * Math.PI / 180) < 0;
  carro.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${(vira ? ang + 180 : ang).toFixed(1)})${vira ? ' scale(-1 1)' : ''}`);
}
function plano(A, B){
  const segs = [];
  if (A.p === B.p && A.p !== 'main') segs.push([PATHS[A.p], A.l, B.l]);
  else {
    const cur = A.p === 'main' ? A.l : J[A.p], alvo = B.p === 'main' ? B.l : J[B.p];
    if (A.p !== 'main') segs.push([PATHS[A.p], A.l, 0]);
    if (Math.abs(cur - alvo) > .5) segs.push([PATHS.main, cur, alvo]);
    if (B.p !== 'main') segs.push([PATHS[B.p], 0, B.l]);
  }
  // encurta o fim para o carro parar ao lado do pino
  const u = segs[segs.length - 1];
  if (u){ const dir = Math.sign(u[2] - u[1]) || 1, len = Math.abs(u[2] - u[1]); u[2] = u[1] + dir * Math.max(0, len - PARA_ANTES); }
  return segs.filter(([, a, b]) => Math.abs(b - a) > .5);
}
let fimViagem = null;
function driveTo(id, lento){
  return new Promise(resolve => {
    if (fimViagem){ fimViagem(false); fimViagem = null; }
    if (viagem) cancelAnimationFrame(viagem);
    if (!MAPA_OK){                    // celular: carrinho pequeno anda pela faixa de cidades
      carroEm = id;
      if (!lento){ resolve(true); return; }
      moveMini(id); rolaFaixa(id);
      const t = setTimeout(() => { fimViagem = null; resolve(true); }, 1400);
      fimViagem = ok => { clearTimeout(t); resolve(ok); };
      return;
    }
    if (id === carroEm){ resolve(true); return; }
    const segs = plano(carroPos, POS[id]); carroEm = id;
    if (!segs.length){ resolve(true); return; }
    const ultimo = segs[segs.length - 1], dirFim = Math.sign(ultimo[2] - ultimo[1]) || 1;
    const nomeDe = path => path === PATHS.main ? 'main' : (path === PATHS.sa ? 'sa' : 'at');
    const fim = ok => { carroPos = { p: nomeDe(ultimo[0]), l: ultimo[2] }; mapa.classList.remove('rodando'); fimViagem = null; resolve(ok); };
    fimViagem = ok => { mapa.classList.remove('rodando'); if (!ok) carroEm = null; resolve(ok); };
    mapa.classList.add('rodando');
    const total = segs.reduce((t, [, a, b]) => t + Math.abs(b - a), 0);
    const dur = lento ? Math.min(5200, Math.max(1800, total * 4.2)) : Math.min(2000, Math.max(650, total * 1.6));
    const t0 = performance.now();
    const ease = k => k < .5 ? 4*k*k*k : 1 - Math.pow(-2*k + 2, 3) / 2;
    const passo = now => {
      const k = Math.min(1, (now - t0) / dur); let d = ease(k) * total;
      for (let i = 0; i < segs.length; i++){
        const [path, a, b] = segs[i], len = Math.abs(b - a), dir = Math.sign(b - a) || 1;
        if (d <= len || i === segs.length - 1){ const l = a + dir * Math.min(d, len); poe(path, l, dir); carroPos = { p: nomeDe(path), l }; break; }
        d -= len;
      }
      if (k < 1) viagem = requestAnimationFrame(passo); else fim(true);
    };
    viagem = requestAnimationFrame(passo);
  });
}
if (MAPA_OK) try { carroPos = { p:'main', l: POS.ba.l - PARA_ANTES }; poe(PATHS.main, carroPos.l, 1); } catch(e){ MAPA_OK = false; }

showStop('ba', 'init');

/* ----- PASSEIO AUTOMÁTICO -----
   O carrinho vai e volta pela rota (São Luís ↔ Jericoacoara), para em cada
   cidade e mostra os pontos turísticos. Toque numa cidade pausa o passeio;
   ele volta sozinho depois de um tempo parado. */
const hud = document.getElementById('hud'), hudTxt = document.getElementById('hudTxt'), anel = document.getElementById('anelProg');
const PARADA_MS = 5200, RETOMA_MS = 15000;
let idx = ORDEM.indexOf('ba'), sentido = 1, tocando = false, querTocar = true, naTela = false, prontoMapa = false;
let espera = null, retoma = null, ciclo = 0;
const nomeDe = id => STOPS.find(x => x.id === id).nome;
function estadoHud(){
  hud.classList.toggle('tocando', tocando); hud.classList.toggle('parado', !tocando);
  document.getElementById('hudBtn').setAttribute('aria-label', tocando ? 'Pausar passeio automático' : 'Continuar passeio automático');
}
function anelCorre(ms){
  anel.classList.remove('corre'); void anel.getBoundingClientRect();
  if (ms){ anel.style.setProperty('--t', ms + 'ms'); anel.classList.add('corre'); }
}
async function proxima(){
  if (!tocando) return;
  const meu = ++ciclo;
  let n = idx + sentido;
  if (n < 0 || n >= ORDEM.length){ sentido *= -1; n = idx + sentido; }
  const de = ORDEM[idx], para = ORDEM[n]; idx = n;
  escondeBalao(); anelCorre(0);
  hudTxt.innerHTML = `Rodando de ${nomeDe(de)} para <em>${nomeDe(para)}</em>`;
  const ok = await driveTo(para, true);
  if (!ok || !tocando || meu !== ciclo) return;
  showStop(para, 'auto'); mostraBalao(para);
  hudTxt.innerHTML = `Parada em <em>${nomeDe(para)}</em>`;
  anelCorre(PARADA_MS);
  espera = setTimeout(proxima, PARADA_MS);
}
function tocar(){
  if (tocando || !naTela || !prontoMapa) return;
  tocando = true; estadoHud();
  clearTimeout(retoma);
  // termina de chegar na cidade atual (se parou no meio do caminho), mostra e segue
  const meu = ++ciclo, aqui = ORDEM[idx];
  hudTxt.innerHTML = `Rodando para <em>${nomeDe(aqui)}</em>`;
  driveTo(aqui, true).then(ok => {
    if (!ok || !tocando || meu !== ciclo) return;
    showStop(aqui, 'auto'); mostraBalao(aqui);
    hudTxt.innerHTML = `Parada em <em>${nomeDe(aqui)}</em>`;
    anelCorre(3000); espera = setTimeout(proxima, 3000);
  });
}
function pausar(motivo){
  tocando = false; ciclo++; clearTimeout(espera); anelCorre(0); estadoHud();
  if (fimViagem){ fimViagem(false); fimViagem = null; cancelAnimationFrame(viagem); }
  if (motivo === 'toque'){ clearTimeout(retoma); retoma = setTimeout(() => { querTocar = true; tocar(); }, RETOMA_MS); }
  if (motivo !== 'fora') hudTxt.innerHTML = motivo === 'toque' ? 'Passeio pausado. Ele volta sozinho em instantes.' : 'Passeio pausado';
}
function alternaPasseio(){
  if (tocando){ querTocar = false; clearTimeout(retoma); pausar('botao'); }
  else { querTocar = true; tocar(); }
}
function toqueParada(id){
  if (tocando || querTocar) pausar('toque');
  idx = ORDEM.indexOf(id);
  showStop(id, 'toque'); mostraBalao(id);
  driveTo(id);
}
// só roda quando o mapa está na tela (economiza bateria)
new IntersectionObserver(es => {
  naTela = es[0].isIntersecting;
  if (naTela && querTocar) tocar();
  else if (!naTela && tocando){ pausar('fora'); }
}, { threshold: .35 }).observe(mapa);
estadoHud();

// estrada se desenha uma vez quando aparece na tela; depois o carro surge e o passeio começa
(function(){
  const cover = document.getElementById('roadCover');
  const pronto = () => { carro.classList.add('on'); prontoMapa = true; if (querTocar) tocar(); };
  if (!cover || !cover.getTotalLength || REDUZ || !MAPA_OK){ cover && cover.remove(); pronto(); return; }
  const len = cover.getTotalLength();
  cover.style.strokeDasharray = len; cover.style.strokeDashoffset = 0;
  new IntersectionObserver((es, ob) => { if (es[0].isIntersecting){
    cover.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.5,0,.2,1)';
    requestAnimationFrame(() => cover.style.strokeDashoffset = -len);
    setTimeout(() => { cover.remove(); pronto(); }, 1900);
    ob.disconnect();
  }}, {threshold:.4}).observe(mapa);
})();

/* ===== NAV ===== */
window.addEventListener('scroll', () => document.getElementById('btt').classList.toggle('vis', scrollY > 700), {passive:true});
function toggleNav(){
  const m = document.getElementById('menu'), h = document.getElementById('ham');
  const open = m.classList.toggle('open'); h.classList.toggle('open', open); h.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeNav(){
  document.getElementById('menu').classList.remove('open');
  const h = document.getElementById('ham'); h.classList.remove('open'); h.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
}

/* ===== FAQ ===== */
function faqToggle(btn){
  const it = btn.parentElement, open = it.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-q').setAttribute('aria-expanded', false); });
  if (!open){ it.classList.add('open'); btn.setAttribute('aria-expanded', true); }
}

/* ===== MÁSCARAS ===== */
document.getElementById('tel').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g,'').slice(0,11);
  if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
  if (v.length > 10) v = v.slice(0,10) + '-' + v.slice(10);
  e.target.value = v;
});
document.getElementById('cpf').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g,'').slice(0,11);
  if (v.length > 3) v = v.slice(0,3) + '.' + v.slice(3);
  if (v.length > 7) v = v.slice(0,7) + '.' + v.slice(7);
  if (v.length > 11) v = v.slice(0,11) + '-' + v.slice(11);
  e.target.value = v;
});
document.getElementById('data').min = new Date().toISOString().split('T')[0];

/* ===== FORMULÁRIO ===== */
let transferType = 'privativo';
function setTransferType(type){
  transferType = type;
  const p = document.getElementById('btnPrivativo'), c = document.getElementById('btnCompartilhado');
  p.classList.toggle('active', type === 'privativo'); p.setAttribute('aria-pressed', type === 'privativo');
  c.classList.toggle('active', type === 'compartilhado'); c.setAttribute('aria-pressed', type === 'compartilhado');
  document.getElementById('transferInfoText').textContent = type === 'privativo'
    ? 'Carro só para você, saída no seu horário e sem paradas extras.'
    : 'Valor por pessoa e horário fixo. Só nas rotas São Luís e Barreirinhas ou Santo Amaro.';
  document.getElementById('veiculoWrap').style.display = type === 'compartilhado' ? 'none' : '';
  updateRouteOptions(); updatePrice();
}
function updateRouteOptions(){
  const sel = document.getElementById('rotaPronta');
  const opts = sel.querySelectorAll('option:not([value=""])'), groups = sel.querySelectorAll('optgroup');
  if (transferType === 'compartilhado'){
    opts.forEach(o => { o.hidden = o.disabled = o.dataset.shared !== 'true'; });
    groups.forEach(g => { g.hidden = !g.querySelector('option[data-shared="true"]'); });
    const cur = sel.options[sel.selectedIndex];
    if (cur && cur.value && cur.dataset.shared !== 'true'){ sel.value = ''; onRotaChange(); }
  } else {
    opts.forEach(o => { o.hidden = o.disabled = false; }); groups.forEach(g => { g.hidden = false; });
  }
}
function isNightTime(h){ if (!h) return false; const x = parseInt(h.split(':')[0], 10); return x >= 22 || x < 5; }
function currentQuote(){
  const rota = document.getElementById('rotaPronta').value, veic = document.getElementById('veiculo').value;
  const night = isNightTime(document.getElementById('hora').value);
  if (!rota || rota === 'outra') return null;
  if (transferType === 'privativo'){
    const row = PRICES_PRIVATIVO[rota], base = row ? row[VEH_INDEX[veic]] : null;
    if (base == null) return { value:null, label:VEH_NAME[veic], note:'Valor sob consulta pelo WhatsApp' };
    return { value: base + (night ? NIGHT_FEE : 0), label: VEH_NAME[veic], note: 'Carro exclusivo, valor total' + (night ? ', com taxa noturna' : '') };
  }
  const base = PRICES_COMPARTILHADO[rota];
  if (!base) return { value:null, label:'Compartilhado', note:'Confirme disponibilidade pelo WhatsApp' };
  return { value: base + (night ? NIGHT_FEE : 0), label:'Compartilhado', note:'Por pessoa' + (night ? ', com taxa noturna' : '') };
}
let precoAtual = null, rolando = null;
function mostraPreco(v){
  const el = document.getElementById('ppPrice');
  cancelAnimationFrame(rolando);
  if (v == null){ el.textContent = 'A combinar'; precoAtual = null; return; }
  const de = precoAtual; precoAtual = v;
  if (de == null || de === v || REDUZ){ el.textContent = brl(v); return; }
  el.classList.remove('muda'); void el.offsetWidth; el.classList.add('muda');
  const t0 = performance.now(), D = 600;
  const passo = now => {
    const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
    el.textContent = brl(k < 1 ? Math.round((de + (v - de) * e) / 10) * 10 : v);
    if (k < 1) rolando = requestAnimationFrame(passo);
  };
  rolando = requestAnimationFrame(passo);
}
function updatePrice(){
  document.getElementById('nightSurchargeAlert').style.display = isNightTime(document.getElementById('hora').value) ? 'flex' : 'none';
  const q = currentQuote(), box = document.getElementById('pricePreview');
  if (!q){ box.style.display = 'none'; precoAtual = null; return; }
  if (box.style.display !== 'flex'){ box.style.display = 'flex'; box.classList.remove('aparece'); void box.offsetWidth; box.classList.add('aparece'); }
  document.getElementById('ppVeh').textContent = q.label;
  mostraPreco(q.value);
  document.getElementById('ppNote').textContent = q.note;
}
function onRotaChange(){
  document.getElementById('customRotaWrap').style.display = document.getElementById('rotaPronta').value === 'outra' ? 'block' : 'none';
  updatePrice();
}
function pickRoute(key, scroll){
  if (transferType !== 'privativo') setTransferType('privativo');
  document.getElementById('rotaPronta').value = key; onRotaChange();
  if (scroll){ document.getElementById('reserva').scrollIntoView({behavior:'smooth', block:'start'}); setTimeout(() => document.getElementById('embarque').focus({preventScroll:true}), 600); }
}
function focusForm(e){
  e.preventDefault();
  document.getElementById('reserva').scrollIntoView({behavior:'smooth', block:'start'});
  setTimeout(() => document.getElementById('rotaPronta').focus({preventScroll:true}), 500);
}
function showPriceTab(tab, btn){
  document.querySelectorAll('.price-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', false); });
  document.getElementById('panel-' + tab).classList.add('active'); btn.classList.add('active'); btn.setAttribute('aria-selected', true);
}
let toastT;
function toast(msg, ms = 3500){
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms);
}
function submitBooking(){
  const val = id => document.getElementById(id).value.trim();
  const rota = val('rotaPronta');
  let origem = '', destino = '';
  if (rota === 'outra'){ origem = val('origem'); destino = val('destino'); }
  else if (rota){ const [a,b] = rota.split('|'); origem = a === 'São Luís' ? 'Aeroporto de São Luís (SLZ)' : a; destino = b === 'São Luís' ? 'Aeroporto de São Luís (SLZ)' : b; }
  const req = ['rotaPronta','embarque','enderecoDestino','data','hora','nome','tel'];
  if (rota === 'outra') req.splice(1, 0, 'origem', 'destino');
  const erros = req.filter(id => !val(id) || (id === 'tel' && val('tel').replace(/\D/g,'').length < 10));
  document.querySelectorAll('#bookForm .err').forEach(el => el.classList.remove('err'));
  erros.forEach(id => document.getElementById(id).classList.add('err'));
  if (erros.length){ document.getElementById(erros[0]).focus(); toast('Preencha os campos marcados em vermelho.'); return; }

  const hora = val('hora'), night = isNightTime(hora), veic = val('veiculo'), q = currentQuote(), obs = val('obs');
  let price = '';
  if (q && q.value != null) price = transferType === 'privativo' ? `\n*Estimativa:* ${brl(q.value)} (${veic})` : `\n*Estimativa:* ${brl(q.value)} por pessoa (compartilhado)`;
  const msg =
`*SOLICITAÇÃO DE TRANSFER — EXPLORE TOURS TRANSFER*

*Passageiro:* ${val('nome')}
*CPF:* ${val('cpf') || 'Não informado'}
*WhatsApp:* ${val('tel')}
*Passageiros:* ${val('pax')}
*Tipo de transfer:* ${transferType === 'privativo' ? 'Privativo' : 'Compartilhado'}

*Local de origem:* ${origem}
*Destino:* ${destino}
*Local de embarque (endereço exato):* ${val('embarque')}
*Endereço de destino (exato):* ${val('enderecoDestino')}
*Data:* ${val('data').split('-').reverse().join('/')}
*Horário:* ${hora}${night ? '\n*Horário noturno:* acréscimo de R$ 150 aplicado' : ''}
*Veículo:* ${transferType === 'privativo' ? veic : 'Compartilhado'}${price}${obs ? `\n*Observações:* ${obs}` : ''}

_Enviado pelo site Explore Tours Transfer_`;
  window.open(`https://wa.me/5598991379433?text=${encodeURIComponent(msg)}`, '_blank');
  document.getElementById('bookForm').style.display = 'none';
  document.getElementById('cRota').textContent = `${origem.replace('Aeroporto de São Luís (SLZ)', 'São Luís')} → ${destino.replace('Aeroporto de São Luís (SLZ)', 'São Luís')}`;
  document.getElementById('cData').textContent = `${val('data').split('-').reverse().join('/')}, ${hora}`;
  document.getElementById('successBox').style.display = 'flex';
  const bil = document.getElementById('reserva'); bil.classList.remove('enviado', 'entra'); void bil.offsetWidth; bil.classList.add('enviado');
}
function resetBooking(){
  const f = document.getElementById('bookForm'); f.reset(); f.style.display = 'block';
  document.getElementById('successBox').style.display = 'none';
  document.getElementById('reserva').classList.remove('enviado');
  document.getElementById('customRotaWrap').style.display = 'none';
  setTransferType('privativo');
}
function bookCircuit(nome){
  const msg = `*INTERESSE EM PASSEIO — EXPLORE TOURS TRANSFER*\n\nOlá, tenho interesse no seguinte passeio:\n\n*${nome}*\n\nPoderia me passar as datas disponíveis e os valores?\n\n_Enviado pelo site Explore Tours Transfer_`;
  window.open(`https://wa.me/5598991379433?text=${encodeURIComponent(msg)}`, '_blank');
}
function openLb(btn){
  const img = btn.querySelector('img'), lb = document.getElementById('lightbox'), big = document.getElementById('lbImg');
  big.src = img.src; big.alt = img.alt; lb.classList.add('open'); document.body.style.overflow = 'hidden'; lb.querySelector('.lb-x').focus();
}
function closeLb(e, force){
  if (!force && e.target.id === 'lbImg') return;
  document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape'){ closeLb(e, true); closeNav(); } });

/* ============================================================
   ANIMAÇÕES AO ROLAR — só entram com .js-anim (respeita
   "reduzir movimento"). Sem JavaScript, tudo fica visível.
   ============================================================ */
(function(){
  const raiz = document.documentElement;
  const barra = document.getElementById('progresso'), nav = document.getElementById('nav');
  // barra dourada de progresso + menu compacto ao rolar
  let pedido = false;
  const rolagem = () => {
    pedido = false;
    const max = raiz.scrollHeight - innerHeight;
    if (barra) barra.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    if (nav) nav.classList.toggle('compacto', scrollY > 160);
  };
  addEventListener('scroll', () => { if (!pedido){ pedido = true; requestAnimationFrame(rolagem); } }, { passive: true });
  rolagem();

  if (!raiz.classList.contains('js-anim') || !('IntersectionObserver' in window)) return;
  const grupos = [
    ['.head > div, .head .lead, .centro', 0],
    ['.prato', 1], ['.dif-item', 1], ['.carro', 1], ['.comp-card', 1],
    ['.dep-grande, .dep-peq', 1], ['.ft', 1], ['.faq-item', 1],
    ['.sobre-foto', 0], ['.sobre > div:last-child', 0], ['.selos li', 1],
    ['.final h2, .final p, .final-btns', 1], ['.painel', 0], ['.tabela tbody tr', 1],
  ];
  const alvos = [];
  grupos.forEach(([sel, escada]) => {
    const els = document.querySelectorAll(sel);
    els.forEach((el, i) => {
      el.classList.add('rv');
      if (escada) el.style.setProperty('--atraso', Math.min(i % 6, 5) * 70 + 'ms');
      alvos.push(el);
    });
  });
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('visivel'); obs.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  alvos.forEach(el => obs.observe(el));
  // segurança: o que já passou da tela (link direto para #precos, por exemplo) aparece na hora
  const libera = () => alvos.forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('visivel'); });
  addEventListener('load', libera); setTimeout(libera, 1500);
  // ícones dos diferenciais se desenham quando aparecem
  document.querySelectorAll('.dif-item svg').forEach(svg => svg.classList.add('desenha'));
  // linhas da tabela entram de novo ao trocar a aba
  document.querySelectorAll('.ptab').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.price-panel.active .rv').forEach(el => { el.classList.remove('visivel'); void el.offsetWidth; el.classList.add('visivel'); });
  }));
})();
