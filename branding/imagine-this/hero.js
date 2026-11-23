/* Protagonista detallado de "Imagine This" (diseño original).
   hero(id, x, y, escala, mirada) devuelve un <g> SVG. Requiere heroDefs(id) dentro de <defs>. */
const HOL = '#0f0b0d';
function heroDefs(id){return `
 <linearGradient id="hJ${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f0954a"/><stop offset=".55" stop-color="#d4702c"/><stop offset="1" stop-color="#8a3d12"/></linearGradient>
 <linearGradient id="hJd${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b65a1e"/><stop offset="1" stop-color="#6d2f0d"/></linearGradient>
 <linearGradient id="hS${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2bc2b4"/><stop offset=".6" stop-color="#1b958b"/><stop offset="1" stop-color="#0f645d"/></linearGradient>
 <linearGradient id="hL${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a5434"/><stop offset="1" stop-color="#3c2414"/></linearGradient>
 <linearGradient id="hP${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d8a52"/><stop offset="1" stop-color="#46502c"/></linearGradient>
 <linearGradient id="hM${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2f4f6"/><stop offset=".45" stop-color="#a9b0b8"/><stop offset="1" stop-color="#5b626a"/></linearGradient>
 <radialGradient id="hG${id}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#9ef3ff"/><stop offset=".45" stop-color="#2d8a9a"/><stop offset="1" stop-color="#0d3640"/></radialGradient>
 <linearGradient id="hB${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2b35a"/><stop offset="1" stop-color="#8a6420"/></linearGradient>
 <radialGradient id="hH${id}" cx="70%" cy="35%" r="80%"><stop offset="0" stop-color="#1d1c24"/><stop offset=".7" stop-color="#0a0a0d"/><stop offset="1" stop-color="#050506"/></radialGradient>`}

function hero(id,x,y,sc,look=1){
 const L=look*14, st=`stroke="${HOL}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;
 const seam=(d,c='#ffd2a8')=>`<path d="${d}" fill="none" stroke="${c}" stroke-opacity=".55" stroke-width="2.5" stroke-dasharray="7 6"/>`;
 // gotas de lluvia sobre la ropa
 const drops=(pts)=>pts.map(([a,b,r])=>`<ellipse cx="${a}" cy="${b}" rx="${r*.7}" ry="${r}" fill="#dff6ff" opacity=".75" stroke="#5aa9c0" stroke-width="1.5"/><ellipse cx="${a-r*.2}" cy="${b-r*.35}" rx="${r*.22}" ry="${r*.3}" fill="#fff" stroke="none"/>`).join('');
 // dientes del cierre
 let zip='';for(let i=0;i<22;i++)zip+=`<rect x="${i%2?-1:-7}" y="${60+i*12}" width="8" height="6" fill="#c9cdd2" stroke="${HOL}" stroke-width="1.5"/>`;
 return `<g transform="translate(${x} ${y}) scale(${sc})" ${st}>
 <!-- ===== MOCHILA (detrás) ===== -->
 <path d="M-270 40 q-10 -20 10 -30 h150 v320 h-170 q-15 0 -15 -15z" fill="url(#hP${id})"/>
 <path d="M-270 40 h160 v80 q-80 20 -160 0z" fill="#5c6a38"/>
 ${seam('M-262 48 h144 M-262 112 q80 18 144 0')}
 <rect x="-200" y="100" width="26" height="40" rx="5" fill="url(#hB${id})" stroke-width="4"/>
 <path d="M-260 170 h70 v110 h-70z" fill="#56603a"/>${seam('M-254 178 h58 v96 h-58z','#d9e2b0')}
 <!-- cantimplora metálica -->
 <rect x="-318" y="140" width="56" height="140" rx="20" fill="url(#hM${id})"/>
 <rect x="-306" y="118" width="32" height="26" rx="6" fill="#5b626a"/>
 <path d="M-305 165 v95" stroke="#ffffff" stroke-opacity=".8" stroke-width="5" fill="none"/>
 <path d="M-322 200 h64" stroke="#3c2414" stroke-width="12"/>
 <!-- saco de dormir enrollado -->
 <rect x="-300" y="-40" width="210" height="84" rx="42" fill="#7a3f2a"/>
 <path d="M-278 -36 q10 40 0 76 M-230 -38 q10 42 0 80 M-180 -38 q10 42 0 80 M-130 -38 q10 42 0 80" stroke="#5a2b1c" stroke-width="4" fill="none"/>
 <ellipse cx="-300" cy="2" rx="22" ry="42" fill="#8e5038"/>
 <path d="M-300 -18 a14 20 0 1 0 2 0 a8 12 0 1 1 -2 0" fill="none" stroke="#5a2b1c" stroke-width="4"/>
 <path d="M-250 -42 v88 M-150 -42 v88" stroke="url(#hL${id})" stroke-width="16"/>
 <rect x="-258" y="-6" width="16" height="16" fill="url(#hB${id})" stroke-width="3"/><rect x="-158" y="-6" width="16" height="16" fill="url(#hB${id})" stroke-width="3"/>
 <!-- cuerda enrollada y mosquetón -->
 <ellipse cx="-200" cy="300" rx="44" ry="26" fill="none" stroke="#c9a26a" stroke-width="10"/>
 <ellipse cx="-200" cy="300" rx="30" ry="16" fill="none" stroke="#a07c48" stroke-width="7"/>
 <path d="M-170 270 a12 16 0 1 1 0.1 0" fill="none" stroke="#a9b0b8" stroke-width="6"/>

 <!-- ===== CAPUCHA (detrás de la cabeza) ===== -->
 <path d="M-135 -30 q-25 -175 135 -185 q160 5 140 185 l-25 70 h-225z" fill="url(#hJd${id})"/>
 <path d="M-108 -30 q-15 -140 108 -150 q125 5 112 150" fill="#5a260b" stroke="none"/>
 ${seam('M-120 -40 q-15 -150 120 -162 q138 6 124 162')}

 <!-- ===== BRAZO IZQUIERDO (detrás del torso) ===== -->
 <path d="M-170 80 q-55 90 -45 230 h80 q-5 -120 30 -200z" fill="url(#hJd${id})"/>
 <path d="M-212 285 h82 v34 h-82z" fill="#6d2f0d"/>${seam('M-208 292 h74')}

 <!-- ===== TORSO / CHAQUETA ===== -->
 <path d="M-200 340 q-15 -230 95 -290 q105 -45 210 0 q110 60 95 290z" fill="url(#hJ${id})"/>
 <!-- sombra lateral derecha y pliegues -->
 <path d="M110 60 q90 70 90 280 h-60 q10 -150 -50 -250z" fill="#7a3510" opacity=".55" stroke="none"/>
 <path d="M-150 120 q20 40 10 90 M140 140 q-20 50 -5 110 M-60 260 q20 30 10 70" stroke="#8a3d12" stroke-width="4" fill="none"/>
 <!-- costuras de hombro -->
 ${seam('M-170 95 q60 -60 165 -60 q100 0 170 60')}
 <!-- solapa y cierre -->
 <path d="M-14 50 h30 v290 h-30z" fill="#b85f22" stroke-width="4"/>
 ${zip}
 <path d="M-4 60 l-2 30 h14 l-2 -30z" fill="url(#hM${id})" stroke-width="3"/>
 ${seam('M-20 60 v270 M22 60 v270')}
 <!-- bolsillos de pecho con solapa y botón -->
 <path d="M-160 150 h110 v95 q-55 10 -110 0z" fill="#c4672a"/>
 <path d="M-165 140 h120 v34 q-60 12 -120 0z" fill="#a85420"/>
 <circle cx="-105" cy="168" r="8" fill="url(#hB${id})" stroke-width="3"/>
 ${seam('M-154 182 v56 h98 v-56')}
 <path d="M50 150 h110 v95 q-55 10 -110 0z" fill="#b25c22"/>
 <path d="M45 140 h120 v34 q-60 12 -120 0z" fill="#93481a"/>
 <circle cx="105" cy="168" r="8" fill="url(#hB${id})" stroke-width="3"/>
 ${seam('M56 182 v56 h98 v-56')}
 <!-- linterna enganchada al bolsillo -->
 <rect x="128" y="190" width="22" height="60" rx="6" fill="#2a2a30"/><rect x="124" y="244" width="30" height="16" rx="4" fill="url(#hM${id})" stroke-width="3"/>
 <!-- parche en el hombro: brújula -->
 <circle cx="-150" cy="92" r="30" fill="#2b3a44" stroke-width="5"/>
 <circle cx="-150" cy="92" r="20" fill="none" stroke="#ffd2a8" stroke-width="2" stroke-dasharray="4 4"/>
 <path d="M-150 72 l7 20 l-7 20 l-7 -20z" fill="#ffc94a" stroke-width="2"/><path d="M-150 92 l7 0 l-7 20 l-7 -20z" fill="#e0525a" stroke="none"/>
 <!-- correas de la mochila + correa de pecho -->
 <path d="M-120 40 q-30 150 -20 300" stroke="#5a3a22" stroke-width="34" fill="none"/>
 
 <path d="M120 40 q30 150 20 300" stroke="#5a3a22" stroke-width="34" fill="none"/>
 ${seam('M-132 60 q-26 140 -18 270 M-108 60 q-26 140 -18 270 M108 60 q26 140 18 270 M132 60 q26 140 18 270','#e8c79a')}
 <path d="M-125 205 h260" stroke="#3c2414" stroke-width="18"/>
 <rect x="-22" y="192" width="44" height="26" rx="6" fill="#1f1f24" stroke-width="4"/><rect x="-10" y="198" width="20" height="14" rx="3" fill="#55555f" stroke="none"/>
 <rect x="-142" y="120" width="40" height="30" rx="5" fill="url(#hB${id})" stroke-width="4"/>
 <rect x="104" y="120" width="40" height="30" rx="5" fill="url(#hB${id})" stroke-width="4"/>
 <!-- ===== BRAZO DERECHO (doblado, mano en la correa) ===== -->
 <path d="M165 70 q75 60 70 170 q-5 60 -70 80 l-40 -50 q40 -20 40 -50 q0 -60 -45 -100z" fill="url(#hJ${id})"/>
 <path d="M200 120 q25 60 10 120" stroke="#8a3d12" stroke-width="4" fill="none"/>
 ${seam('M178 82 q62 60 56 160')}
 <!-- puño con velcro -->
 <path d="M118 262 l52 -40 l26 34 l-52 40z" fill="#6d2f0d"/>
 <path d="M140 250 l34 -26" stroke="#3a1606" stroke-width="10"/>
 <!-- guante sin dedos -->
 <path d="M100 280 q-30 -10 -40 -40 q30 -30 70 -10 l26 30 q-20 30 -56 20z" fill="#2a2a30"/>
 ${seam('M78 248 q24 -18 50 -4','#8a8a96')}
 <!-- dedos (piel en silueta negra) -->
 <path d="M64 238 q-14 -22 -2 -30 q12 2 14 22 M80 230 q-10 -28 4 -32 q12 4 10 26 M98 230 q-4 -26 10 -28 q10 6 4 28" fill="#0b0b0e" stroke-width="4"/>

 <!-- ===== BUFANDA ===== -->
 <path d="M-125 45 q125 70 250 0 q30 45 -8 88 q-117 52 -234 0 q-38 -43 -8 -88z" fill="url(#hS${id})"/>
 <path d="M-118 70 q118 55 236 0 M-112 95 q112 50 224 0" stroke="#0f645d" stroke-width="4" fill="none"/>
 <path d="M-90 60 q20 30 60 38 M30 98 q40 -6 70 -36" stroke="#5fe0d2" stroke-opacity=".6" stroke-width="4" fill="none"/>
 <!-- extremo colgante con flecos -->
 <path d="M30 115 q30 70 0 150 l-55 -10 q28 -70 5 -135z" fill="url(#hS${id})"/>
 <path d="M14 150 l-36 -6 M18 190 l-40 -6 M16 228 l-40 -6" stroke="#0f645d" stroke-width="7" fill="none"/>
 <path d="M-25 255 l-4 22 M-12 258 l-2 24 M2 260 l0 22 M16 262 l2 22" stroke="#1b958b" stroke-width="6"/>

 <!-- ===== CABEZA (silueta negra) ===== -->
 <ellipse cx="0" cy="-60" rx="112" ry="118" fill="url(#hH${id})"/>
 <!-- luz de borde: fría a la izquierda, cálida (luna) a la derecha -->
 <path d="M-104 -10 q-22 -70 8 -130" stroke="#5fd6e6" stroke-opacity=".7" stroke-width="5" fill="none"/>
 <path d="M100 -120 q24 50 4 120" stroke="#ffb46a" stroke-opacity=".75" stroke-width="6" fill="none"/>
 <!-- pelo en capas -->
 <path d="M-112 -100 q4 -60 50 -62 q-8 -30 30 -40 q10 -26 46 -18 q30 -16 52 14 q40 -6 50 40 q20 16 6 52 q-18 -22 -40 -20 q8 -20 -10 -30 q-14 22 -40 16 q-6 -24 -30 -24 q-6 26 -36 26 q-16 -20 -36 -6 q-14 20 -42 52z" fill="#0b0b0e"/>
 <path d="M-60 -150 q14 -18 34 -16 M10 -168 q20 -10 40 2 M60 -150 q20 -2 32 18" stroke="#3a3a46" stroke-width="4" fill="none"/>
 <path d="M-100 -60 q-14 30 -6 60 M104 -70 q12 30 2 60" stroke="#0b0b0e" stroke-width="16" fill="none"/>
 <!-- gafas sobre la frente -->
 <path d="M-122 -150 q122 -66 244 0" fill="none" stroke="#3a2416" stroke-width="22"/>
 <path d="M-118 -146 q118 -62 236 0" fill="none" stroke="#7a5434" stroke-width="3" stroke-dasharray="6 5"/>
 <circle cx="-50" cy="-180" r="40" fill="url(#hB${id})"/>
 <circle cx="50" cy="-180" r="40" fill="url(#hB${id})"/>
 <circle cx="-50" cy="-180" r="30" fill="url(#hG${id})" stroke-width="4"/>
 <circle cx="50" cy="-180" r="30" fill="url(#hG${id})" stroke-width="4"/>
 <path d="M-66 -194 q10 -12 26 -8 M34 -194 q10 -12 26 -8" stroke="#ffffff" stroke-width="6" fill="none"/>
 <circle cx="-36" cy="-166" r="4" fill="#fff" stroke="none"/><circle cx="64" cy="-166" r="4" fill="#fff" stroke="none"/>
 <rect x="-12" y="-192" width="24" height="16" rx="4" fill="url(#hM${id})" stroke-width="4"/>
 ${[-82,-18,18,82].map(a=>`<circle cx="${a}" cy="${-180+(Math.abs(a)>50?-2:0)}" r="3.5" fill="#5b4a2c" stroke="none"/>`).join('')}
 <!-- ojos -->
 <ellipse cx="${-38+L}" cy="-72" rx="23" ry="31" fill="#f6f3ea" stroke="none"/>
 <ellipse cx="${42+L}" cy="-72" rx="23" ry="31" fill="#f6f3ea" stroke="none"/>
 <ellipse cx="${-32+L}" cy="-82" rx="7" ry="9" fill="#ffffff" stroke="none"/>
 <path d="M${-58+L} -52 q20 10 40 0 M${22+L} -52 q20 10 40 0" stroke="#c9c5b8" stroke-width="3" fill="none"/>
 <!-- cejas preocupadas -->
 <path d="M${-62+L} -114 q22 -16 46 -2 M${22+L} -118 q24 -12 46 6" stroke="#f6f3ea" stroke-width="7" fill="none"/>
 <!-- boca -->
 <path d="M${-14+L} 2 q24 -26 48 0 q-6 16 -24 16 q-18 0 -24 -16z" fill="#e0525a" stroke="none"/>
 <path d="M${-4+L} 12 q14 -6 28 0" stroke="#a8323a" stroke-width="3" fill="none"/>
 <!-- gota de sudor / lluvia -->
 <path d="M118 -40 q12 20 0 30 q-12 -10 0 -30z" fill="#bfeeff" stroke-width="3"/>
 <!-- gotas sobre la ropa -->
 ${drops([[-150,250,7],[-60,300,6],[90,300,7],[150,120,5],[-30,140,5],[200,200,6],[-180,130,5],[60,90,5]])}
 </g>`}
